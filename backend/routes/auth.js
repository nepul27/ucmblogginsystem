const express = require("express");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
const User = require("../models/User");
const Admin = require("../models/Admin");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "Darshitisagoodboy";

const router = express.Router();

router.post(
  "/createuser",
  [
    body("firstname", "First Name Must have atleast 3 characters").isLength({
      min: 3,
    }),
    body("lastname", "Last Name Must have atleast 3 characters").isLength({
      min: 3,
    }),
    body("username", "User Name Must have atleast 3 characters").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exist" });
      }
      user = await User.findOne({ username: req.body.username });

      if (user) {
        return res
          .status(400)
          .json({ error: "User with this username already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: secPass,
        status: "Y",
      });

      const data = {
        user: {
          id: user.id,
          username: user.username,
        },
      };

      const authtaken = jwt.sign(data, JWT_SECRET);

      localStorage.setItem("token", authtaken);
      localStorage.setItem("username", req.body.username);
      res.json({
        success: authtaken,
        username: req.body.username,
        date: user.date,
        userType: "user",
      });
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ error: "Internal server error" });
    }
  }
);

router.get("/user/:username", async (req, res) => {
  try {
    if (req.params.username == "admin") {
      const user = await Admin.findOne({ username: req.params.username });
      res.json(user);
    } else {
      const user = await User.findOne({ username: req.params.username });
      res.json(user);
    }
  } catch (error) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
});

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a password it can not be blank").exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    try {
      let admin = await Admin.findOne({ email });

      if (!admin) {
        let user = await User.findOne({ email });

        if (!user) {
          return res
            .status(400)
            .json({ error: "Please Enter Correct login Credentials" });
        }

        if (user.status === "N") {
          return res
            .status(400)
            .json({ error: "This current user is Blocked temporarily!" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
          return res
            .status(400)
            .json({ error: "enter Correct login Credentials" });
        }

        const data = {
          user: {
            id: user.id,
            username: user.username,
          },
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        localStorage.setItem("token", authToken);
        localStorage.setItem("username", user.username);
        localStorage.setItem("since", user.date);

        req.body.authtoken = authToken;

        return res
          .status(200)
          .json({
            success: req.body.authtoken,
            username: user.username,
            userType: "user",
            date: user.date,
          });
      }

      const adminPassword = await bcrypt.compare(password, admin.password);

      if (!adminPassword) {
        return res.status(400).json({ error: "Enter valid credentials" });
      }

      const admindata = {
        user: {
          id: admin.id,
          username: admin.username,
        },
      };

      const authToken = jwt.sign(admindata, JWT_SECRET);
      localStorage.setItem("token", authToken);

      req.body.authtoken = authToken;

      localStorage.setItem("username", admin.username);

      req.body.authtoken = authToken;

      return res
        .status(200)
        .json({
          success: req.body.authtoken,
          username: admin.username,
          userType: "admin",
        });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
