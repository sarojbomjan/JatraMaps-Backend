const adminMiddleWare = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(403).json({ message: "Access denied. Admin Only" });
  }
  next();
};

module.exports = adminMiddleWare;
