interface Visual {
  type: 'image' | 'diagram';
  url: string;
  description: string;
}

interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  visuals: Visual[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  wikipediaUrl?: string;
  pageUrl?: string; // For backward compatibility
  fullArticle?: string;
}

export const concepts: Concept[] = [
  {
    "id": "concept_001",
    "name": "Ramsey Theory",
    "category": "Graph Theory and Combinatorics",
    "description": "Ramsey theory states that complete disorder is impossible. It explores how order emerges in large enough structures.",
    "visuals": [
      {
        "type": "image",
        "url": "https://mathworld.wolfram.com/images/eps-gif/RamseyGraph_1000.gif",
        "description": "Visualization of Ramsey numbers."
      }
    ],
    "difficulty": "Intermediate"
  },
  {
    "id": "concept_002",
    "name": "Splines",
    "category": "Geometry and Curves",
    "description": "Splines are smooth curves used in computer graphics and interpolation.",
    "visuals": [
      {
        "type": "image",
        "url": "https://mathworld.wolfram.com/images/eps-gif/BicubicSpline_1000.gif",
        "description": "Example of bicubic splines."
      }
    ],
    "difficulty": "Beginner"
  },
  {
    "id": "concept_003",
    "name": "Prime Numbers",
    "category": "Number Theory",
    "description": "Prime numbers are integers greater than 1 that have no divisors other than 1 and themselves.",
    "visuals": [
      {
        "type": "image",
        "url": "https://mathworld.wolfram.com/images/eps-gif/PrimeNumbers_700.gif",
        "description": "Visualization of prime numbers."
      }
    ],
    "difficulty": "Beginner"
  }
  // Add more concepts as needed
]; 