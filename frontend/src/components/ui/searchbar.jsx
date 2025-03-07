import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Input,
  Kbd,
  Box,
  HStack,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogBackdrop,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { InputGroup, useColorModeValue } from './index.js';
import { useDebounce } from 'use-debounce'; // We'll use this for debouncing the search input
import SearchResult from './SearchResult.jsx';
const SearchBar = () => {
  const inputRef = useRef(null); // Reference for the main input
  const dialogInputRef = useRef(null); // Reference for the input inside the dialog
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const BorderColor = useColorModeValue('black', 'white');
  const [debouncedQuery] = useDebounce(query, 500); // Debounce the query

  const fetchBlogs = async (
    searchQuery = '',
    pageNumber = 1,
    selectedTags = []
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8787/blog/getall?query=${searchQuery}&page=${pageNumber}&limit=10&tags=${selectedTags.join(
          ','
        )}`
      );
      const data = await response.json();

      setBlogs((prevBlogs) =>
        pageNumber === 1 ? data.blogs : [...prevBlogs, ...data.blogs]
      );
      setTotalCount(data.pagination.totalCount);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger an API call when debounced query changes
  useEffect(() => {
    if (debouncedQuery || debouncedQuery === '') {
      setPage(1); // Reset page to 1 when the query changes
      fetchBlogs(debouncedQuery);
    }
  }, [debouncedQuery]);

  // Trigger fetching more blogs on scroll
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && blogs.length < totalCount && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchBlogs(debouncedQuery, page);
    }
  }, [debouncedQuery, page]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setDialogOpen(true);
    }
  };

  const handleClickSearchBar = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetching suggestions
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      // If query is provided, search the suggestions
      const filteredSuggestions = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      // If no query, fetch the latest blogs
      setSuggestions(blogs);
    }
  }, [debouncedQuery, blogs]);

  useEffect(() => {
    fetchBlogs();
  }, []); // Initial fetch when the component is mounted

  // Focus the input field after the dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        if (dialogInputRef.current) {
          dialogInputRef.current.focus();
        }
      }, 100);
    }
  }, [dialogOpen]);

  return (
    <HStack gap='4' width='full' justify='center' position='relative'>
      {/* Main search bar */}
      <Box width={{ base: '90%', md: '60%' }} position='relative'>
        <InputGroup
          flex='1'
          startElement={<LuSearch />}
          endElement={<Kbd>Ctrl + K</Kbd>}
          onClick={handleClickSearchBar} // Open dialog on click
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Input
            ref={inputRef}
            placeholder='Search'
            size='lg'
            fontSize='lg'
            paddingLeft='3.5em'
            width='100%'
            pointerEvents='none'
            cursor='default'
            border='0.11rem solid'
            borderColor={BorderColor}
          />
        </InputGroup>
      </Box>

      {/* Dialog to show suggestions */}
      <DialogRoot open={dialogOpen}>
        <DialogBackdrop
          bg='rgba(0, 0, 0, 0.4)' // Semi-transparent background
          backdropFilter='blur(5px)' // Apply blur to the background
        />
        <DialogContent
          width={{ base: '80%', sm: '70%', md: '60%' }} // Responsive dialog width
          margin='auto'
          borderRadius='md'
          boxShadow='lg'
          display='flex'
          flexDirection='column'
          position='fixed'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          p={6}
        >
          {/* Close Button */}
          <DialogCloseTrigger
            as={Button}
            onClick={() => setDialogOpen(false)}
            position='absolute'
            top='25px'
            right='25px'
            size='md'
            variant='ghost'
            _hover={{ bg: 'transparent' }}
            zIndex={99}
          >
            <IoClose />
          </DialogCloseTrigger>

          {/* Search Bar inside the dialog */}
          <Box display='flex' alignItems='center' mb={4}>
            <InputGroup
              flex='1'
              startElement={<LuSearch />}
              onClick={handleClickSearchBar}
              width='100%'
            >
              <Input
                ref={dialogInputRef}
                value={query || ''}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search...'
                size='lg'
                fontSize='lg'
                paddingLeft='3.5em'
                width='100%'
                _focus={{ border: 'none' }}
              />
            </InputGroup>
          </Box>

          {/* Suggestions Box */}
          {suggestions.length > 0 && (
            <Box
              mt={4}
              width='100%'
              maxHeight='200px'
              overflowY='auto'
              border='1px solid #ccc'
              borderRadius='md'
              boxShadow='md'
              onScroll={handleScroll}
            >
              {suggestions.map((suggestion, index) => (
                <SearchResult key={index} suggestion={suggestion} />
              ))}
            </Box>
          )}
        </DialogContent>
      </DialogRoot>
    </HStack>
  );
};

export default SearchBar;
