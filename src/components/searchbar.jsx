import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Input,
  Kbd,
  Box,
  Text,
  Link,
  HStack,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogBackdrop,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup } from './ui/input-group';

const suggestionsData = [
  {
    text: 'React Documentation',
    url: 'https://reactjs.org/docs/getting-started.html',
  },
  { text: 'Chakra UI Docs', url: 'https://chakra-ui.com/docs/getting-started' },
  {
    text: 'Chakra UI Docs2',
    url: 'https://chakra-ui.com/docs/getting-started',
  },
  {
    text: 'Chakra UI Docs3',
    url: 'https://chakra-ui.com/docs/getting-started',
  },
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
  const [dialogOpen, setDialogOpen] = useState(false);

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
    // Focus the input inside the dialog after it's open
    if (dialogOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus(); // Focus the input after a slight delay to ensure dialog is rendered
      }, 100); // Timeout of 100ms
    }
  }, [dialogOpen]);

  return (
    <HStack gap='4' width='full' justify='center' position='relative'>
      {/* Search Input wrapped in Box */}
      <Box width='70%' position='relative'>
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
            width='100%' // Ensure the input takes up full width within the container
            disabled={dialogOpen} // Disable the main input when the dialog is open
            pointerEvents={dialogOpen ? 'none' : 'auto'} // Disable pointer events when dialog is open
            _focus={
              dialogOpen
                ? {}
                : {
                    // Remove focus styles when dialog is open
                    borderColor: 'green.400',
                    boxShadow: '0 0 0 1px green.400',
                  }
            }
          />
        </InputGroup>
      </Box>

      {/* Dialog for Search Suggestions */}
      <DialogRoot open={dialogOpen}>
        <DialogBackdrop
          bg='rgba(0, 0, 0, 0.4)' // Semi-transparent background
          backdropFilter='blur(5px)' // Apply blur to the background
        />
        <DialogContent
          width='60%' // Set the dialog width to be 60% of the screen
          margin='auto'
          borderRadius='md'
          boxShadow='lg'
          padding='2rem'
          display='flex'
          flexDirection='column'
          position='fixed'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)' // Center the dialog on screen
        >
          {/* Close Button moved to Top-Right */}
          <DialogCloseTrigger
            as={Button}
            onClick={() => setDialogOpen(false)}
            visibility='visible'
            position='absolute'
            top='10px'
            right='10px'
            size='sm'
            variant='ghost'
          >
            X
          </DialogCloseTrigger>

          <DialogBody>
            <InputGroup
              flex='1'
              startElement={<LuSearch />}
              onClick={handleClickSearchBar}
            >
              <Input
                ref={inputRef}
                value={query || ''}
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

            {/* Display suggestions inside dialog body */}
            {suggestions.length > 0 && (
              <Box mt={4}>
                {suggestions.map((suggestion, index) => (
                  <Box key={index} mb={2}>
                    <Link href={suggestion.url} isExternal>
                      <Text>{suggestion.text}</Text>
                    </Link>
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
