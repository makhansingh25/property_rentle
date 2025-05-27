require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const router = require("./routes/authroutes");
const propertyRoute = require("./routes/propertyRouter");
const messageRoute = require("./routes/messageroutes");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/api", propertyRoute);
app.use("/api", messageRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server is running on port ${PORT} `);
});
