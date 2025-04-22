import React, { useState } from 'react';
import NumidexHeader from '../components/NumidexHeader';
import Footer from '../components/Footer';
import CardStack from '../components/CardStack';
import CardFooter from '../components/CardFooter';
import PokedexButton from '../components/PokedexButton';
import TagSelector from '../components/TagSelector';
import TagModal from '../components/TagModal';
import { Tag } from '../config/tags';

const SwipeInterface: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const handleTagSelection = (tags: Tag[]) => {
    setSelectedTags(tags);
    setIsTagModalOpen(false);
  };

  return (
    <div className="card-stack">
      <NumidexHeader />
      <main>
        <div className="container">
          <CardStack />
        </div>
      </main>
      <CardFooter />
      <TagSelector
        selectedTags={selectedTags}
        onTagClick={() => setIsTagModalOpen(true)}
      />
      <PokedexButton />
      <Footer />
      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagsSelected={handleTagSelection}
        selectedTags={selectedTags}
      />
    </div>
  );
};

export default SwipeInterface;
