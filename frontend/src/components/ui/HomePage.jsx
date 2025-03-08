import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  Tag,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { Skeleton, SkeletonCircle, SkeletonText } from './index';
import SearchResult from './SearchResult'; // Import your SearchResult component
import { useColorModeValue } from './index';

const HomePage = () => {
  // States for blog posts, tags, pagination, and loading
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Track the total pages
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.800'); // Lighter background for light theme and darker for dark theme
  const textColor = useColorModeValue('gray.800', 'gray.200');

  // Fetch blogs from the API
  const fetchBlogs = async (page, selectedTags = []) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8787/blog/getall?tags=${selectedTags.join(
          ','
        )}&page=${page}&limit=2`
      );
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages); // Set the total pages
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tags for filtering
  const fetchTags = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8787/blog/tags');
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Fetch blogs and tags when the component is mounted
  useEffect(() => {
    fetchBlogs(currentPage, selectedTags);
    fetchTags();
  }, [currentPage, selectedTags]);

  // Handle tag selection and deselection
  const handleTagClick = (tagName) => {
    if (selectedTags.includes(tagName)) {
      // If the tag is already selected, remove it
      setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
    } else {
      // If the tag is not selected, add it
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  // Remove a tag from the selected tags array
  const handleTagRemove = (tagName) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Box width={{ base: '90%', sm: '80%', md: '70%' }} mx='auto' p={6}>
      <Box
        p={2}
        borderRadius='md'
        bg={bgColor}
        boxShadow='sm'
        width={'96%'}
        mx='auto'
        display='flex'
        flexDirection='column' // Keep this column so "Tags Filter" and tags are stacked
        alignItems='flex-start' // Align both elements to the left
      >
        <Text
          fontSize='md'
          color={textColor}
          mb={2}
          textAlign='left'
          width='100%'
          fontFamily={'heading'}
        >
          TAG FILTER
        </Text>

        <HStack
          spacing={4}
          wrap='wrap' // Allow tags to wrap to the next row
          justify='flex-start' // Align tags to the left
          width='100%' // Ensure the tag container spans full width of the box
        >
          {tags.map((tag) => (
            <Tag.Root
              key={tag.id}
              size='lg'
              variant='solid'
              colorPalette={selectedTags.includes(tag.name) ? 'green' : 'gray'}
              onClick={() => handleTagClick(tag.name)}
              cursor='pointer'
              mb={2}
              transition='background-color 0.3s ease'
            >
              <Tag.Label>{tag.name}</Tag.Label>

              {/* Show close button if the tag is selected */}
              {selectedTags.includes(tag.name) && (
                <Tag.EndElement>
                  <Tag.CloseTrigger onClick={() => handleTagRemove(tag.name)} />
                </Tag.EndElement>
              )}
            </Tag.Root>
          ))}
        </HStack>
      </Box>

      {/* Blog Posts */}
      <SimpleGrid columns={1} spacing={4}>
        {loading ? (
          <VStack spacing={4} align='start' m={2}>
            {[1, 2, 3, 4, 5].map((_, index) => (
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
                {/* Left Section (Image and Title) */}
                <HStack spacing={4} flex='1'>
                  {/* Skeleton for Image */}
                  <SkeletonCircle size='12' />

                  {/* Skeleton for Title */}
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

                {/* Right Section (Date and Tags) */}
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='flex-end'
                >
                  {/* Skeleton for Date */}
                  <Skeleton height='20px' width='100px' mb={2} />

                  {/* Skeleton for Tags */}
                  <HStack spacing={2} mt={2}>
                    <Skeleton height='20px' width='50px' />
                    <Skeleton height='20px' width='50px' />
                    <Skeleton height='20px' width='50px' />
                  </HStack>
                </Box>
              </Box>
            ))}
          </VStack>
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
          _disabled={{
            opacity: 0.4,
          }}
        >
          {'<'}
        </Button>

        <Text fontSize='md' fontWeight='bold'>
          Page {currentPage} of {totalPages}
        </Text>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages || totalCount === 0}
          size='sm' // Same size as previous button
          colorScheme='teal' // Consistent color scheme for the buttons
          variant='outline' // Maintain outline style
          _disabled={{
            opacity: 0.4,
          }}
        >
          {'>'}
        </Button>
      </HStack>
    </Box>
  );
};

export default HomePage;
