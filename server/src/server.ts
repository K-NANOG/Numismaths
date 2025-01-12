import express from "express";
import path from "path";
import process from "process";
const app = express();

// express middlewares for url and json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files from the React app
app.use("/", express.static(path.join(process.cwd(), "/client/dist")));

// serve the React app for any route !== /api
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/client/dist/index.html"));
});

app.listen(process.env.port || 8080);