import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Bens Server is running" });
});

app.get("/api/users", (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Ben" },
    { id: 2, name: "Alice" },
  ]);
});

app.post("/api/users", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newUser = {
    id: Date.now(),
    name,
  };

  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
