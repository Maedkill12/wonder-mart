export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
export const ACCESS_TOKEN_EXPIRATION =
  process.env.ACCESS_TOKEN_EXPIRATION || "1h";
export const REFRESH_TOKEN_EXPIRATION =
  process.env.REFRESH_TOKEN_EXPIRATION || 15; // in minutes
