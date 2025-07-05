import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import * as userService from "../../user/user.service";
import { type Request, type Response, type NextFunction } from "express";
import { parseExpireTime } from "./token.service";
import { loadConfig } from "../helper/config.hepler";
import User from "../../../database/models/tUser";


loadConfig();
export interface ServiceTokenPayload {
  service: "assignment";
  scopes: string[];
}


const AccessTokenExpireTime = process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? "24h";
const RefreshTokenExpireTime =
  process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? "7d";

const isValidPassword = async function (value: string, password: string) {
  const compare = await bcrypt.compare(value, password);
  return compare;
};

export const initPassport = (): void => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.JWT_SECRET!,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (user, done) => {
        try {
          done(null, user);
        } catch (error) {
          console.log(error, "error");
          done(error);
        }
      }
    )
  );

  // user login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userService.getUserById(email);
          if (user == null) {
            done(createError(401, "Invalid email or password!"), false);
            return;
          }

          const validate = await isValidPassword(password, user.password);
          if (!validate) {
            done(createError(401, "Invalid email or password"), false);
            return;
          }
          const { password: _p, ...result } = user;
          done(null, result, { message: "Logged in Successfully" });
        } catch (error: any) {
          done(createError(500, error.message));
        }
      }
    )
  );
};

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (
      err: Error | null,
      user: Express.User | false,
      info: { message?: string } | undefined
    ) => {
      if (err) {
        throw createError(500, {
          message: info?.message ?? "Unauthorized access",
        });
      }
      if (!user) {
        throw createError(401, {
          message: info?.message ?? "Unauthorized access",
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

export const createUserTokens = async (user: Omit<User, "password">) => {
  const jwtSecret = process.env.JWT_SECRET ?? "";
  const accessTokenExpireTime = parseExpireTime(AccessTokenExpireTime);
  const refreshTokenExpireTime = parseExpireTime(RefreshTokenExpireTime);

  const token = jwt.sign(user, jwtSecret, { expiresIn: accessTokenExpireTime });
  const refreshToken = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: refreshTokenExpireTime,
  });


  return {
    accessToken: token,
    refreshToken
  };
};
export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};
export const decodeToken = <T>(token: string) => {
  // const jwtSecret = process.env.JWT_SECRET ?? "";
  const decode = jwt.decode(token);
  return decode as T;
};

export const createTokensFromRefreshToken = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw createError(400, {
      message: "Refresh token not found",
    });
  }
  const decode = decodeToken<{ id: string }>(refreshToken);

  if (!decode?.id) {
    throw createError(400, { message: "Invalid token" });
  }
  const existUser = await userService.getUserById(decode.id);

  if (!existUser) {
    throw createError(400, {
      message: "User not found",
    });
  }
  const { password, ...remainingUser } = existUser;

  return await createUserTokens(remainingUser);
};
