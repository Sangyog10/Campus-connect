import jwt from "jsonwebtoken";

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
  return token;
};

const isTokenValid = async (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  res.cookie("token", token, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
