/* eslint-disable react/prop-types */
import { Box, Text, Tag, useColorModeValue, Image } from '@chakra-ui/react';

const SearchResult = ({ suggestion }) => {
  // Define colors for light/dark mode
  const hoverBgColor = useColorModeValue('gray.200', 'gray.700'); // Subtle background change on hover
  const borderColor = useColorModeValue('gray.300', 'gray.600'); // Lighter border for contrast
  const tagColorScheme = 'green'; // Tag color scheme (could be dynamic)

  // Format the creation date
  const createdAt = new Date(suggestion.createdAt);
  const formattedDate = createdAt.toLocaleDateString();

  return (
    <Box
      mb={4}
      p={4}
      display='flex'
      alignItems='center'
      borderRadius='md'
      border='2px solid'
      borderColor={borderColor} // Border color to give more distinction
      boxShadow='sm' // Soft shadow for a subtle depth
      _hover={{
        bg: hoverBgColor,
        cursor: 'pointer',
        boxShadow: 'lg', // Larger shadow on hover for focus effect
        transform: 'scale(1.02)', // Slight scale increase on hover
      }}
      transition='background-color 0.3s, box-shadow 0.3s, transform 0.2s'
      onClick={() => window.open(suggestion.url, '_blank')}
    >
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
            {/* Display first letter of title as fallback */}
          </Text>
        )}
      </Box>

      {/* Text Content */}
      <Box flex='1'>
        <Text fontWeight='bold' fontSize='xl' mb={1}>
          {suggestion.title}
        </Text>

        {/* Creation Date */}
        <Text fontSize='sm' color='gray.500' mb={2}>
          Created on: {formattedDate}
        </Text>

        {suggestion.description && (
          <Text fontSize='sm' color='gray.500' mb={2}>
            {suggestion.description}
          </Text>
        )}

        {/* Tags */}
        <Box mt={2}>
          {suggestion.tags?.map((tag, tagIndex) => (
            <Tag key={tagIndex} size='sm' colorScheme={tagColorScheme} mr={2}>
              {tag}
            </Tag>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResult;
