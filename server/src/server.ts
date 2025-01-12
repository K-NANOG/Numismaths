import express from "express";
import path from "path";
import process from "process";
const app = express();

// express middlewares for url and json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dist = path.join(process.cwd(), "../client/dist");

app.use("/assets", express.static(path.join(dist, "/assets")));

app.get("/concepts", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(process.cwd(), "/src/concepts.json"));
});

app.use("/", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(dist, "/index.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
