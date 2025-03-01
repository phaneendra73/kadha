import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Input,
  Kbd,
  Box,
  Text,
  HStack,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogBackdrop,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup, useColorModeValue } from './index.js';
import { IoClose } from 'react-icons/io5';
import { getenv } from '../../utils/getenv';
const suggestionsData = [
  {
    text: 'React Documentation',
    url: 'https://reactjs.org/docs/getting-started.html',
  },
  { text: 'Chakra UI Docs', url: 'https://chakra-ui.com/docs/getting-started' },
  {
    text: 'JavaScript Tutorial',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
  },
  { text: 'CSS Tricks', url: 'https://css-tricks.com/' },
  { text: 'Web Development Blog', url: 'https://www.smashingmagazine.com/' },
];

const SearchBar = () => {
  const inputRef = useRef(null); // Reference for the main input
  const dialogInputRef = useRef(null); // Reference for the input inside the dialog
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const BorderColor = useColorModeValue(getenv('THEMECOLOR'), 'white');
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setDialogOpen(true); // Open dialog when Ctrl+K or Cmd+K is pressed
    }
  };

  const handleClickSearchBar = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
    } else {
      const filteredSuggestions = suggestionsData.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  }, [query]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          onClick={handleClickSearchBar}
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
            pointerEvents={'none'}
            cursor={'default'}
            border={'2px solid '}
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
          p={6} // Add padding for better spacing
        >
          {/* Close Button */}
          <DialogCloseTrigger
            as={Button}
            onClick={() => setDialogOpen(false)}
            visibility='visible'
            position='absolute'
            top='10px'
            right='10px'
            size='sm'
            variant='ghost'
            _hover={{ bg: 'transparent' }}
            _focus={{ boxShadow: 'none' }}
          >
            <IoClose />
          </DialogCloseTrigger>

          <DialogBody
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
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
                width='100%' // Ensures input takes up the full width inside the dialog
              />
            </InputGroup>

            {/* Suggestions Box */}
            {suggestions.length > 0 && (
              <Box
                mt={4}
                width='100%'
                maxHeight='200px'
                overflowY='auto'
                border='1px solid #ccc'
                borderRadius='md'
              >
                {suggestions.map((suggestion, index) => (
                  <Box
                    key={index}
                    mb={2}
                    p={2}
                    _hover={{ bg: 'gray.500', cursor: 'pointer' }}
                    borderRadius='md'
                    transition='background-color 0.2s'
                    onClick={() => window.open(suggestion.url, '_blank')}
                  >
                    <Text>{suggestion.text}</Text>
                    {suggestion.description && (
                      <Text fontSize='sm' color='gray.500'>
                        {suggestion.description}
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </HStack>
  );
};

export default SearchBar;
