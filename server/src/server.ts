import express from "express";
import path from "path";
import process from "process";
import fs from "fs";

const app = express();

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dist = path.join(process.cwd(), "../client/dist");
app.use("/assets", express.static(path.join(dist, "/assets")));

app.get("/concepts", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(process.cwd(), "/src/concepts.json"));
});

// New API to save swiped-right concepts
app.post("/save-liked", (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  const filePath = path.join(process.cwd(), "/src/liked_concepts.json");

  let likedConcepts: string[] = [];

  // Load existing liked concepts if the file exists
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    likedConcepts = JSON.parse(fileData);
  }

  // Add new ID if not already stored
  if (!likedConcepts.includes(id)) {
    likedConcepts.push(id);
    fs.writeFileSync(filePath, JSON.stringify(likedConcepts, null, 2));
  }

  res.json({ success: true, likedConcepts });
});

app.use("/", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(dist, "/index.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
