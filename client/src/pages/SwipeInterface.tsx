import React, { useState, useRef, useCallback, useEffect } from 'react';
import NumidexHeader from '../components/NumidexHeader';
import Footer from '../components/Footer';
import CardStack from '../components/CardStack';
// import CardFooter from '../components/CardFooter';
import PokedexButton from '../components/PokedexButton';
import TagSelector from '../components/TagSelector';
import TagModal from '../components/TagModal';
import { Tag } from '../config/tags';
import WikipediaSearch from '../components/WikipediaSearch';
import { WikipediaService } from '../services/WikipediaService';

const BATCH_SIZE = 10;
const BUFFER_SIZE = 5;

const SwipeInterface: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [theme, setTheme] = useState('');
  const [searchOffset, setSearchOffset] = useState(0);
  const [noMoreResults, setNoMoreResults] = useState(false);
  const [searchTheme, setSearchTheme] = useState('');
  const [searchTags, setSearchTags] = useState<Tag[]>([]);
  const seenUrls = useRef<Set<string>>(new Set());
  const isFetching = useRef(false);
  const [likedConcepts, setLikedConcepts] = useState<Set<string>>(new Set());
  const justLiked = useRef<Set<string>>(new Set());

  // Fetch liked concepts on mount
  useEffect(() => {
    const fetchLikedConcepts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/liked-concepts');
        if (!response.ok) throw new Error('Failed to fetch liked concepts');
        const data = await response.json();
        setLikedConcepts(new Set(data.map((c: any) => c.id)));
      } catch (err) {
        console.error('Error fetching liked concepts:', err);
      }
    };
    fetchLikedConcepts();
  }, []);

  const handleTagSelection = (tags: Tag[]) => {
    setSelectedTags(tags);
    setIsTagModalOpen(false);
    setConcepts([]);
    seenUrls.current = new Set();
    setSearchOffset(0);
    setNoMoreResults(false);
    fetchMoreConcepts(tags, theme, 0);
  };

  const onConceptLiked = useCallback((conceptId: string) => {
    setLikedConcepts(prev => new Set([...prev, conceptId]));
    justLiked.current.add(conceptId);
  }, []);

  const handleNewCards = (newCards: any[], newTheme?: string, newOffset?: number, newTags?: Tag[]) => {
    // If this is a new search (theme or tags changed), reset everything
    if (newTheme !== undefined || newTags !== undefined) {
      setConcepts([]);
      seenUrls.current = new Set();
      setSearchOffset(0);
      setNoMoreResults(false);
      if (newTheme !== undefined) setSearchTheme(newTheme);
      if (newTags !== undefined) setSearchTags(newTags);
    }
    // Filter out already seen concepts by pageUrl AND liked concepts AND just liked
    const beforeDedup = newCards.length;
    const filtered = newCards.filter(card => 
      card.pageUrl && 
      !seenUrls.current.has(card.pageUrl) &&
      !likedConcepts.has(card.id) &&
      !justLiked.current.has(card.id)
    );
    filtered.forEach(card => {
      if (card.pageUrl) seenUrls.current.add(card.pageUrl);
    });
    console.log(`[SwipeInterface] handleNewCards: offset=${searchOffset}, fetched=${beforeDedup}, afterDedup=${filtered.length}`);
    setConcepts((prev: any[]) => [...prev, ...filtered]);
    if (newOffset !== undefined) setSearchOffset(newOffset);
    // If no new cards and buffer is empty, set noMoreResults
    if (filtered.length === 0 && concepts.length === 0) {
      setNoMoreResults(true);
    }
  };

  const fetchMoreConcepts = useCallback(async (tags: Tag[] = searchTags, currentTheme: string = searchTheme, offset: number = searchOffset) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const wikipediaService = WikipediaService.getInstance();
      console.log(`[SwipeInterface] Fetching more concepts: offset=${offset}, tags=${tags.map(t=>t.name).join(',')}, theme=${currentTheme}`);
      if (!currentTheme && tags.length === 0) {
        console.log('[SwipeInterface] No theme or tags set for search. Skipping fetch.');
        setNoMoreResults(true);
        return;
      }
      const cards = await wikipediaService.searchArticles(currentTheme, tags, BATCH_SIZE, offset);
      if (cards.length === 0) {
        console.log('[SwipeInterface] Wikipedia API returned no more results.');
        setNoMoreResults(true);
      }
      handleNewCards(cards, undefined, offset + BATCH_SIZE);
    } catch (error) {
      console.error('[SwipeInterface] Error fetching more concepts:', error);
    } finally {
      isFetching.current = false;
    }
  }, [searchTags, searchTheme, searchOffset, concepts.length]);

  // Infinite buffer: fetch more if buffer is low
  React.useEffect(() => {
    if (concepts.length < BUFFER_SIZE && !isFetching.current && !noMoreResults) {
      fetchMoreConcepts(searchTags, searchTheme, searchOffset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concepts, searchTags, searchTheme, searchOffset, noMoreResults]);

  // After concepts update, clear justLiked set (so it only blocks the next batch)
  useEffect(() => {
    if (justLiked.current.size > 0) {
      justLiked.current.clear();
    }
  }, [concepts]);

  return (
    <div className="card-stack">
      <NumidexHeader />
      <main>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="explore-card neumorphic-card" style={{ maxWidth: 600, width: '100%', margin: '2rem 0', padding: '2.5rem 2rem', borderRadius: '2rem', boxShadow: '8px 8px 24px #e0e2ea, -8px -8px 24px #ffffff' }}>
            <WikipediaSearch onNewCards={(cards, themeFromSearch, _offset, tagsFromSearch) => handleNewCards(cards, themeFromSearch, BATCH_SIZE, tagsFromSearch)} />
          </div>
          {noMoreResults && concepts.length === 0 ? (
            <div className="text-center" style={{ color: '#888', marginTop: '2rem' }}>
              <p>No more results available for this search.</p>
            </div>
          ) : null}
          <CardStack 
            concepts={concepts} 
            setConcepts={setConcepts} 
            selectedTags={searchTags}
            fetchMoreConcepts={() => fetchMoreConcepts(searchTags, searchTheme, searchOffset)}
            likedConcepts={likedConcepts}
            onConceptLiked={onConceptLiked}
          />
        </div>
      </main>
      {/* <CardFooter /> */}
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
