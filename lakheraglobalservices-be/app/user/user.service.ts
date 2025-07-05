import createHttpError from "http-errors";
import { AppDataSource } from "../../database";
import User from "../../database/models/tUser";
import { createUserTokens, hashPassword } from "../common/services/passport-jwt.service";

export const createUser = async (data: User) => {
    const { email, password, userName } = data;
    const hashedPassword = await hashPassword(password);
    const user = AppDataSource.manager.create(User, { email, password: hashedPassword, userName });
    const result = await AppDataSource.manager.save(user);
    if (!result) {
        throw createHttpError(400, {
            message: "Failed to create user",
            data: null,
        });
    }
    return result;
}
export const generateTokens = async (payload: User) => {
    return createUserTokens(payload)
}
export const getUserById = async (id: string) => {
    const user = await AppDataSource.manager.findOne(User, { where: { id } });
    if (!user) {
        throw createHttpError(404, { message: "Task not found" });
    }
    return user;
}