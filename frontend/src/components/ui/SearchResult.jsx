/* eslint-disable react/prop-types */
import { Box, Text, Tag, Image } from '@chakra-ui/react';
import { useColorModeValue } from './index.js';

const SearchResult = ({ suggestion }) => {
  const hoverBgColor = useColorModeValue('gray.200', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const tagColorScheme = 'green';

  const createdAt = new Date(suggestion.createdAt);
  const formattedDate = createdAt.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Box
      m={4}
      p={4}
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      borderRadius='md'
      border='2px solid'
      borderColor={borderColor}
      boxShadow='sm'
      _hover={{
        bg: hoverBgColor,
        cursor: 'pointer',
        boxShadow: 'lg',
        transform: 'scale(1.02)',
      }}
      transition='background-color 0.3s, box-shadow 0.3s, transform 0.2s'
      onClick={() => window.open(`Blog/Read/${suggestion.id}`, '_blank')}
    >
      {/* Left Section (Image and Title) */}
      <Box display='flex' flex='1' alignItems='center'>
        {/* Image or Fallback */}
        <Box
          mr={4}
          width='60px'
          height='60px'
          display='flex'
          justifyContent='center'
          alignItems='center'
          borderRadius='10px'
          bg='gray.200'
          overflow='hidden'
        >
          {suggestion.imageUrl ? (
            <Image
              src={suggestion.imageUrl}
              alt={suggestion.title}
              objectFit='cover'
              width='100%'
              height='100%'
              borderRadius='10px'
            />
          ) : (
            <Text
              fontSize='lg'
              color='white'
              fontWeight='bold'
              textAlign='center'
            >
              {suggestion.title[0]}{' '}
            </Text>
          )}
        </Box>

        {/* Title */}
        <Box>
          <Text fontWeight='bold' fontSize='xl' mb={1}>
            {suggestion.title}
          </Text>
        </Box>
      </Box>

      {/* Right Section (Date and Tags) */}
      <Box display='flex' flexDirection='column' alignItems='flex-end'>
        {/* Creation Date */}
        <Text fontSize='sm' color='gray.500' fontWeight='medium' mb={2}>
          {formattedDate}
        </Text>

        {/* Tags */}
        <Box display='flex' flexWrap='wrap' justifyContent='flex-end'>
          {suggestion.tags?.map((tag, tagIndex) => (
            <Tag.Root
              key={tagIndex}
              size='sm'
              colorPalette={tagColorScheme}
              mr={2}
            >
              {tag}
            </Tag.Root>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResult;
