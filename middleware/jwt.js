import jwt from "jsonwebtoken";

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const isTokenValid = async (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  res.cookie("token", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 100),
    httpOnly: true,
    secure: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
