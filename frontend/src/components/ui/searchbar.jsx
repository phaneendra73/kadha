/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
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
  VStack,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import {
  InputGroup,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from './index.js';
import { useDebounce } from 'use-debounce'; // Debounce input to delay API calls
import useSearch from '../../hooks/useSearch.js'; // Import the custom useSearch hook
import SearchResult from './SearchResult.jsx'; // Component to display search results

const SearchBar = () => {
  const inputRef = useRef(null); // Reference for the main input field
  const dialogInputRef = useRef(null); // Reference for the input inside the dialog
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1); // Page for infinite scroll
  const BorderColor = useColorModeValue('black', 'white');
  const [debouncedQuery] = useDebounce(query, 1000); // Debounced search query

  // Using the custom useSearch hook for fetching blogs
  const {
    blogs,
    totalCount,
    totalPages,
    loading: searchLoading,
    error,
  } = useSearch(page, debouncedQuery);

  // Trigger fetching more blogs when scroll reaches the bottom
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && blogs.length < totalCount && !searchLoading) {
      setPage((prevPage) => prevPage + 1); // Load next page of results
    }
  };

  // Handle key down events to open dialog with Ctrl+K
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

  // Focus the input field when the dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        if (dialogInputRef.current) {
          dialogInputRef.current.focus();
        }
      }, 100);
    }
  }, [dialogOpen]);

  // Effect to handle the initial fetch of blogs
  useEffect(() => {
    if (debouncedQuery || debouncedQuery === '') {
      setPage(1); // Reset to page 1 when query changes
    }
  }, [debouncedQuery]);

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

          {/* Suggestions Box with Infinite Scroll */}
          {blogs.length > 0 && (
            <Box
              mt={4}
              width='100%'
              maxHeight='200px'
              overflowY='auto'
              border='1px solid #ccc'
              borderRadius='md'
              boxShadow='md'
              onScroll={handleScroll} // Handle scroll event to load more blogs
            >
              {blogs.map((blog) => (
                <SearchResult key={blog.id} suggestion={blog} />
              ))}
              {searchLoading && (
                <VStack spacing={4} align='start' m={2}>
                  {[1, 2, 3].map((_, index) => (
                    <Box
                      key={index}
                      p={4}
                      shadow='md'
                      borderWidth='1px'
                      width='full'
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                    >
                      <HStack spacing={4} flex='1'>
                        <SkeletonCircle size='12' />
                        <Box>
                          <Skeleton height='20px' width='200px' />
                          <SkeletonText
                            noOfLines={2}
                            spacing={4}
                            mt={2}
                            width='250px'
                          />
                        </Box>
                      </HStack>
                      <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='flex-end'
                      >
                        <Skeleton height='20px' width='100px' mb={2} />
                        <HStack spacing={2} mt={2}>
                          <Skeleton height='20px' width='50px' />
                          <Skeleton height='20px' width='50px' />
                          <Skeleton height='20px' width='50px' />
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          )}
          {/* Loading spinner */}

          {/* Error message */}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </DialogContent>
      </DialogRoot>
    </HStack>
  );
};

export default SearchBar;
