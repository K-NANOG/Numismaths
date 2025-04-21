import express from "express";
import path from "path";
import process from "process";
import cors from 'cors';
import { conceptService } from './services/ConceptService';
import { Concept } from './services/ConceptService';

const app = express();

// Express middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dist = path.join(process.cwd(), "../client/dist");
app.use("/assets", express.static(path.join(dist, "/assets")));

// API Routes
app.get("/api/concepts", async (req, res) => {
  try {
    const concepts = await conceptService.getAllConcepts();
    res.json(concepts);
  } catch (error) {
    console.error("Error fetching concepts:", error);
    res.status(500).json({ error: "Failed to fetch concepts" });
  }
});

app.post("/api/save-liked", async (req, res) => {
  try {
    const { id, concept } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Concept ID is required" });
    }
    
    // If it's a new concept from Wikipedia, it will have the full concept object
    if (concept) {
      // Generate a new ID for the concept if it's from Wikipedia
      const newId = await conceptService.getNextConceptId();
      const newConcept: Concept = {
        ...concept,
        id: newId
      };
      await conceptService.saveLikedConcept(newId, newConcept);
      res.json({ success: true, newId });
    } else {
      await conceptService.saveLikedConcept(id);
      res.json({ success: true });
    }
  } catch (error) {
    console.error("Error saving liked concept:", error);
    res.status(500).json({ error: "Failed to save liked concept" });
  }
});

app.get("/api/liked-concepts", async (req, res) => {
  try {
    const likedConcepts = await conceptService.getLikedConcepts();
    res.json(likedConcepts);
  } catch (error) {
    console.error("Error fetching liked concepts:", error);
    res.status(500).json({ error: "Failed to fetch liked concepts" });
  }
});

app.get("/api/action-history", async (req, res) => {
  try {
    const history = await conceptService.getActionHistory();
    res.json(history);
  } catch (error) {
    console.error("Error fetching action history:", error);
    res.status(500).json({ error: "Failed to fetch action history" });
  }
});

// Serve static files for all other routes
app.use("/", (_: express.Request, res: express.Response) => {
  res.sendFile(path.join(dist, "/index.html"));
});

const startServer = async (port: number) => {
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        resolve(server);
      }).on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}`);
          reject(err);
        } else {
          reject(err);
        }
      });
    });
  } catch (err) {
    if ((err as any).code === 'EADDRINUSE') {
      await startServer(port + 1);
    } else {
      console.error('Error starting server:', err);
    }
  }
};

const initialPort = process.env.PORT ? parseInt(process.env.PORT) : 8080;
startServer(initialPort);
