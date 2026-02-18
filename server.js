import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  await newUser.save();
  res.json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(process.cwd() + "/public/dashboard.html");
});
app.post("/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional business AI assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ reply: "AI Error" });
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
