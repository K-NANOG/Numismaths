import express from "express";
import path from "path";
import process from "process";
const app = express();

// express middlewares for url and json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dist = path.join(process.cwd(), "../client/dist");

app.use("/assets", express.static(path.join(dist, "/assets")));

app.use("/", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(dist, "/index.html"))
});

app.listen(process.env.port || 8080);