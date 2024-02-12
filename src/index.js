const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { Todo } = require("./models");

// Add this to the VERY top of the first file loaded in your app
var apm = require("elastic-apm-node").start({
  // Override the service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: "spa-server",

  // Use if APM Server requires a secret token
  secretToken: "3glfm7aYnC4YbuT8nQ",

  // Set the custom APM Server URL (default: http://localhost:8200)
  serverUrl:
    "https://acdf5ddb4ad448bca620a5d6b914a674.apm.us-central1.gcp.cloud.es.io:443",

  // Set the service environment
  environment: "my-environment",
});

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  return res.json({ message: "Hello, World ✌️" });
});

app.get("/todossssssssss", async (req, res) => {
  const todos = await Todo.find();
  return res.status(200).json(todos);
});

app.post("/todos", async (req, res) => {
  const newTodo = new Todo({ ...req.body });
  const insertedTodo = await newTodo.save();
  return res.status(201).json(insertedTodo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.updateOne({ _id: id }, req.body);
  const updatedTodo = await Todo.findById(id);
  return res.status(200).json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await Todo.findByIdAndDelete(id);
  return res.status(200).json(deletedTodo);
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.log(process.env.DB_URI);
    console.error(error);
    process.exit(1);
  }
};

start();
