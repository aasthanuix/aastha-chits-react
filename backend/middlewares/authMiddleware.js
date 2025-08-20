import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

export const verifyTokenAndGetAccount = async (token) => {
  if (!token) throw new Error("No token provided");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let account = await Admin.findById(decoded.id).select("-password");
  let accountType = "admin";

  if (!account) {
    account = await User.findById(decoded.id).populate("enrolledChits").select("-password");
    accountType = "user";
  }

  if (!account) throw new Error("Account not found");

  return { account, accountType };
};

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const { account, accountType } = await verifyTokenAndGetAccount(token);

    req.user = account;
    req.userType = accountType;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Not authorized, token invalid or missing" });
  }
};

// Socket authentication
export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    const { account, accountType } = await verifyTokenAndGetAccount(token);

    socket.user = account;
    socket.userType = accountType;

    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Not authorized"));
  }
};
