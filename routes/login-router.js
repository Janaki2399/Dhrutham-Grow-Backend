const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/user.model");

router.post("/", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email });
  if (user) {
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      let token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "24h",
      });
      token = `Bearer ${token}`;

      return res.status(200).json({ success: true, token });
    }
    return res
      .status(400)
      .json({ success: false, errorMessage: "Password is incorrect" });
  }
  res
    .status(401)
    .json({ success: false, errorMessage: "Email id does not exist" });
});
module.exports = router;
