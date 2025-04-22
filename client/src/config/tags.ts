export interface Tag {
  id: string;
  name: string;
  category: string;
}

export interface TagCategory {
  id: string;
  name: string;
  tags: Tag[];
}

export const tagCategories: TagCategory[] = [
  {
    id: 'biotechnology',
    name: 'Biotechnology',
    tags: [
      { id: 'synth-bio', name: 'Synthetic Biology', category: 'biotechnology' },
      { id: 'aging-bio', name: 'Aging Biology', category: 'biotechnology' },
      { id: 'bioeng', name: 'Bioengineering', category: 'biotechnology' },
      { id: 'multiomics', name: 'Multiomics', category: 'biotechnology' }
    ]
  },
  {
    id: 'nanotechnology',
    name: 'Nanotechnology',
    tags: [
      { id: 'nanomed', name: 'Nanomedicine', category: 'nanotechnology' },
      { id: 'nanorob', name: 'Nanorobotics', category: 'nanotechnology' },
      { id: 'nanobio', name: 'Nanobiotechnology', category: 'nanotechnology' },
      { id: 'suprachem', name: 'Supramolecular Chemistry', category: 'nanotechnology' }
    ]
  },
  {
    id: 'neurotechnology',
    name: 'Neurotechnology',
    tags: [
      { id: 'compneuro', name: 'Computational Neuroscience', category: 'neurotechnology' },
      { id: 'brain-machine', name: 'Brain-Machine Interfaces', category: 'neurotechnology' },
      { id: 'neuroaesthetics', name: 'Neuroaesthetics / Neuroplasticity', category: 'neurotechnology' },
      { id: 'brain-emulation', name: 'Whole Brain Emulation', category: 'neurotechnology' }
    ]
  },
  {
    id: 'interdisciplinary',
    name: 'Interdisciplinary',
    tags: [
      { id: 'art-evo', name: 'Artificial Evolution', category: 'interdisciplinary' },
      { id: 'life-ext', name: 'Life Extension', category: 'interdisciplinary' },
      { id: 'reg-med', name: 'Regenerative Medicine', category: 'interdisciplinary' },
      { id: 'math-model', name: 'Mathematical Modeling', category: 'interdisciplinary' }
    ]
  }
]; 