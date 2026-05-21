import "dotenv/config";
import express from "express";
import config from "config";
import { connectDatabase } from "./database/mongoose";
import publicUserRoute from "./endpoints/user/PublicUserRoute";
import userRoute from "./endpoints/user/UserRoute";
import morgan from "morgan";
import { createUser, userExists } from "./endpoints/user/UserService";
import authenticationRoute from "./endpoints/authentication/AuthenticationRoute";
import { authMiddleware } from "./utils/authMiddleware";
import degreeCourseRoute from "./endpoints/degreeCourse/DegreeCourseRoute";
import degreeCourseApplicationRoute from "./endpoints/degreeCourseApplication/DegreeCourseApplicationRoute";

console.log("tokenKey:", config.get<string>("session.tokenKey"));

const port = config.get<number>("server.port");

const app = express();
app.use(express.json()); // registers middleware to parse json bodies and gives access to req.body in the routes
app.use(morgan("dev")); // registers morgan middleware to log incoming requests in the console(method, url, status code, response time)
app.use("/api/publicUsers", publicUserRoute);
app.use("/api/authenticate", authenticationRoute);
app.use("/api/users", authMiddleware, userRoute);
app.use("/api/degreeCourses", authMiddleware, degreeCourseRoute);
app.use(
  "/api/degreeCourseApplications",
  authMiddleware,
  degreeCourseApplicationRoute,
);

app.get("/", (req, res) => {
  res.json({ message: "Ben's Server is running" });
});

app.use((req, res) => {
  res.status(404).json({ Error: "No such endpoint found!" });
});

async function startServer() {
  // connection to server (async) after awaiting the database connection
  await connectDatabase();

  try {
    if (!(await userExists("admin"))) {
      await createUser({
        userID: "admin",
        password: "123",
        isAdministrator: true,
      });
    }
  } catch (error) {
    throw new Error("Failed to create admin user!!");
  }

  app.listen(port, () => {
    console.log(`Server running on http://127.0.0.1:${port}`);
  });
}

startServer();
