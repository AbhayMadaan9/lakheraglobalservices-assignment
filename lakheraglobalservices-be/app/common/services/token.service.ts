export const parseExpireTime = (expireTime: string): number => {
  const unit = expireTime.slice(-1);
  const value = parseInt(expireTime.slice(0, -1));

  switch (unit) {
    case "m":
      return value * 60; // Minutes
    case "h":
      return value * 60 * 60; // Convert hours to minutes
    case "d":
      return value * 24 * 60 * 60; // Convert days to minutes (24 hours * 60 minutes)
    default:
      throw new Error("Invalid expiration format");
  }
};
