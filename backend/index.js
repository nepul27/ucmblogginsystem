const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to UCM-Blogger!...");
});

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/question", require("./routes/questions"));
app.use("/api/answer", require("./routes/answers"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/admin", require("./routes/admin"));

app.listen(port, () => {
  console.log(`UCM-Blogger app listening at http://localhost:${port}`);
});
