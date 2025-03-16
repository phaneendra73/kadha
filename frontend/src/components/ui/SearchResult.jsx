/* eslint-disable react/prop-types */
import { Box, Text, Tag, Image } from '@chakra-ui/react';
import { useColorModeValue } from './index.js';
import { Link } from 'react-router-dom';

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
      flexDirection={{ base: 'column', md: 'row' }} // Stack elements on small screens
    >
      <Link
        to={`/Read?id=${suggestion.id}`}
        target='_blank' // Opens in a new tab
        style={{ textDecoration: 'none', width: '100%' }} // Remove underline and make Link cover the entire Box
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
          flexDirection={{ base: 'column', md: 'row' }} // Stack elements on small screens
        >
          {/* Left Section (Image and Title) */}
          <Box
            display='flex'
            flex='1'
            alignItems='center'
            mb={{ base: 4, md: 0 }}
            width='100%'
          >
            {/* Image or Fallback */}
            <Box
              mr={4}
              width={{ base: '50px', md: '60px' }} // Responsive size
              height={{ base: '50px', md: '60px' }} // Responsive size
              display='flex'
              justifyContent='center'
              alignItems='center'
              borderRadius='10px'
              bg='gray.200'
              overflow='hidden'
              flexShrink={0} // Prevents shrinking on mobile
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
                  fontSize={{ base: 'md', md: 'lg' }} // Responsive font size
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
              <Text
                fontWeight='bold'
                fontSize={{ base: 'lg', md: 'xl' }}
                mb={1}
              >
                {suggestion.title}
              </Text>
            </Box>
          </Box>

          {/* Right Section (Date and Tags) */}
          <Box display='flex' flexDirection='column' alignItems='flex-end'>
            {/* Creation Date */}
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              color='gray.500'
              fontWeight='medium'
              mb={2}
            >
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
                  mb={1}
                >
                  {tag}
                </Tag.Root>
              ))}
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default SearchResult;
