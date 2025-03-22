import { useState } from 'react';
import { Box, Text, Button, HStack, Tag, SimpleGrid } from '@chakra-ui/react';
import { Skeleton, BlogsSkeleton } from './index';
import SearchResult from './SearchResult';
import { useColorModeValue } from './index';
import useTags from '../../hooks/useTags';
import useBlogs from '../../hooks/useBlogs';

const HomeBlogs = () => {
  // States for blog posts, pagination, loading, and tag selection
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const { blogs, totalCount, totalPages, loading } = useBlogs(
    currentPage,
    selectedTags
  ); // Pass currentPage to the custom hook
  // Fetch tags using custom hook
  const { tags, error: tagsError, loading: tagsLoading } = useTags();

  // Get background and text colors for the page based on theme
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  // Handle tag selection and deselection
  const handleTagClick = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags((prevTags) => {
        const updatedTags = prevTags.filter((tag) => tag !== tagName);
        setCurrentPage(1); // Reset to page 1 when tag is deselected
        return updatedTags;
      });
    } else {
      setSelectedTags((prevTags) => {
        const updatedTags = [...prevTags, tagName];
        setCurrentPage(1); // Reset to page 1 when new tag is selected
        return updatedTags;
      });
    }
  };

  // Remove a tag from the selected tags array
  const handleTagRemove = (tagName) => {
    setSelectedTags((prevTags) => {
      const updatedTags = prevTags.filter((tag) => tag !== tagName);
      setCurrentPage(1); // Reset to page 1 when tag is removed
      return updatedTags;
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage); // Update the current page
    }
  };

  return (
    <Box width={{ base: '90%', sm: '80%', md: '70%' }} mx='auto' p={6}>
      {/* Tag Filter Section */}
      <Box
        p={4}
        borderRadius='lg'
        bg={bgColor}
        boxShadow='md'
        width={'98%'}
        mx='auto'
        display='flex'
        flexDirection='column'
        alignItems='flex-start'
        borderWidth='1px'
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        transition='all 0.2s'
        _hover={{ boxShadow: 'lg' }}
      >
        <Text
          fontSize='md'
          fontWeight='bold'
          color={textColor}
          mb={3}
          textAlign='left'
          width='100%'
          fontFamily={'heading'}
          letterSpacing='wide'
          textTransform='uppercase'
        >
          TAG FILTER
        </Text>

        <HStack spacing={3} wrap='wrap' justify='flex-start' width='100%'>
          {tagsLoading ? (
            <HStack spacing={2} mt={2}>
              <Skeleton height='24px' width='60px' color={textColor} />
              <Skeleton height='24px' width='75px' />
              <Skeleton height='24px' width='50px' />
              <Skeleton height='24px' width='65px' />
            </HStack>
          ) : tagsError ? (
            <Text color='red.500' fontWeight='medium'>
              Error loading tags
            </Text>
          ) : (
            tags.map((tag) => (
              <Tag.Root
                key={tag.id}
                size='lg'
                variant={selectedTags.includes(tag.name) ? 'solid' : 'subtle'}
                colorPalette={
                  selectedTags.includes(tag.name) ? 'green' : 'gray'
                }
                onClick={() => handleTagClick(tag.name)}
                cursor='pointer'
                mb={2}
                transition='transform 0.2s, box-shadow 0.2s'
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'sm',
                }}
              >
                <Tag.Label fontWeight='bold'>{tag.name}</Tag.Label>

                {/* Show close button if the tag is selected */}
                {selectedTags.includes(tag.name) && (
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagRemove(tag.name);
                      }}
                    />
                  </Tag.EndElement>
                )}
              </Tag.Root>
            ))
          )}
        </HStack>
      </Box>

      {/* Blog Posts Section */}
      <SimpleGrid columns={1} spacing={4}>
        {loading ? (
          <BlogsSkeleton />
        ) : (
          blogs.map((blog) => <SearchResult key={blog.id} suggestion={blog} />)
        )}
      </SimpleGrid>

      {/* Pagination */}
      <HStack mt={6} spacing={4} justify='center'>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          size='sm'
          fontSize='lg'
          colorScheme='teal'
          variant='outline'
          _disabled={{ opacity: 0.4 }}
        >
          {'<'}
        </Button>

        <Text fontSize='md' fontWeight='bold'>
          Page {currentPage} of {totalPages}
        </Text>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages || totalCount === 0}
          size='sm'
          colorScheme='teal'
          variant='outline'
          _disabled={{ opacity: 0.4 }}
        >
          {'>'}
        </Button>
      </HStack>
    </Box>
  );
};

export default HomeBlogs;
