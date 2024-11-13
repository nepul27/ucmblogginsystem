const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "Darshitisagoodboy";

const fetchuser = (req, res, next) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return res.status(401).send({ error: "Authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
};

module.exports = fetchuser;
