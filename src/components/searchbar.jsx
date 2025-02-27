import { useState, useRef, useEffect } from 'react';
import {
  HStack,
  Input,
  Kbd,
  Box,
  Text,
  Link,
  List,
  ListItem,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup } from './ui/input-group'; // Assuming your InputGroup is correct

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
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
    }
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

  return (
    <HStack gap='4' width='full' justify='center' position='relative'>
      <InputGroup flex='1' maxW='600px'>
        <InputGroup
          startElement={<LuSearch color='gray.500' />}
          endElement={<Kbd>ctrl+K</Kbd>}
        >
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            size='lg'
            fontSize='lg'
            paddingLeft='3.5em'
            _focus={{
              borderColor: 'green.400',
              boxShadow: '0 0 0 1px green.400',
            }}
          />
        </InputGroup>
      </InputGroup>

      {suggestions.length > 0 && (
        <Box
          position='absolute'
          top='100%'
          left='0'
          right='0'
          mt='1'
          bg='white'
          border='1px solid #ccc'
          borderRadius='md'
          boxShadow='md'
          zIndex='1'
          width='100%'
          maxH='300px'
          overflowY='auto'
        >
          <List spacing={0}>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'lightgray';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <Link href={suggestion.url} isExternal>
                  <Box p='3' cursor='pointer'>
                    <Text>{suggestion.text}</Text>
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </HStack>
  );
};

export default SearchBar;
