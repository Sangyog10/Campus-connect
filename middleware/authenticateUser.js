import { UnauthenticatedError } from "../errors/index.js";
import { isTokenValid } from "./jwt.js";

const authenticateUser = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication failed, Please login");
  }
  try {
    const payload = await isTokenValid(token);

    req.user = {
      userId: payload.id,
      email: payload.email,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export { authenticateUser };
