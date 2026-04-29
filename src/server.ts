import "dotenv/config";
import express from "express";
import config from "config";
import { connectDatabase } from "./database/mongoose";
import publicUsersRoute from "./endpoints/user/PublicUsersRoute";
import morgan from "morgan";
import { createUser, userExists } from "./endpoints/user/UserService";

console.log("tokenKey:", config.get<string>("session.tokenKey"));

const port = config.get<number>("server.port");

const app = express();
app.use(express.json()); // registers middleware to parse json bodies and gives access to req.body in the routes
app.use(morgan("dev")); // registers morgan middleware to log incoming requests in the console in dev format (method, url, status code, response time)
app.use("/api/publicUsers", publicUsersRoute);

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
        password: "admin",
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
