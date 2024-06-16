const express = require("express");
const color = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 4000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, resp, next) => {
  console.log(req.url, req.method);
  // next method has to be called to continue requests
  next();
});

app.use("/api/course", require("./routes/courseRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/class", require("./routes/classRoutes"));
app.use("/api/students", require("./routes/studentRoute"));
app.use("/api/content/files/", require("./routes/contentFileRoute"));
app.use("/api/students", require("./routes/studentNoteRoute"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
