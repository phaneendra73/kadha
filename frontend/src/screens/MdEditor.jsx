import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  Stack,
  Field,
  Tag,
  TagLabel,
  Text,
  HStack,
  Container,
  useBreakpointValue,
  Flex,
  Heading,
  Image,
} from '@chakra-ui/react';
import { Footer, useColorModeValue, Skeleton } from '../components/ui/index';
import rehypeSanitize from 'rehype-sanitize';
import useTags from '../hooks/useTags';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { getenv } from '../utils/getenv';

export default function MdEditor() {
  const navigate = useNavigate();
  const { id: blogId } = useParams(); // Get blog ID from URL parameters
  const isEditMode = Boolean(blogId);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  // Form state
  const EditorTheme = useColorModeValue('light', 'dark');
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = getenv('APIURL');

  // Fetch tags using the hook
  const {
    tags: fetchedTags,
    error: tagsError,
    loading: tagsLoading,
  } = useTags();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/blog/get/${blogId}`, {});
        const blog = response.data;

        setTitle(blog.title);
        setImageUrl(blog.imageUrl || '');
        setValue(blog.markdownContent);

        // Set selected tags based on blog data (now handling tag names instead of IDs)
        if (blog.tags && Array.isArray(blog.tags)) {
          setSelectedTags(blog.tags);
        }
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to load blog content. Please try again.',
          type: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const authToken = localStorage.getItem('p73SessionData');
    if (!authToken) {
      toaster.create({
        title: 'Access Restricted',
        description:
          'Please log in to manage blog posts. Only admins can modify content.',
        type: 'warning',
        duration: 8000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/Admin');
      }, 4000);
    } else {
      setIsAuthorized(true);

      // If in edit mode, fetch the blog data
      if (isEditMode) {
        fetchBlogData();
      } else {
        setValue('**Hello world!!!**'); // Default content for new blog
        setIsLoading(false);
      }
    }
  }, [navigate, blogId, isEditMode, apiUrl]);

  // Responsive values - Adjusted for better UI
  const editorHeight = useBreakpointValue({ base: '50vh', md: '70vh' });
  const containerMaxWidth = useBreakpointValue({
    base: '100%',
    md: '90vw',
    lg: '1200px',
  });
  const containerPadding = useBreakpointValue({ base: '2', md: '4' });

  // Handle tag selection and deselection - now using tagName instead of id
  const handleTagClick = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== tagName)); // Deselect tag
    } else {
      setSelectedTags([...selectedTags, tagName]); // Select tag
    }
  };

  // Submit handler for the form
  const handleSubmit = async () => {
    if (!title || !value) {
      setError('Title and content are required.');
      return;
    }

    if (!localStorage.getItem('p73SessionData')) {
      toaster.create({
        title: 'Not logged in',
        description: 'Please log in to manage blog posts.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    const authorId = 1; // This could be dynamic based on user info

    // Convert selected tag names to tag IDs for the API
    const tagIds = selectedTags
      .map((tagName) => {
        const tagObject = fetchedTags.find((tag) => tag.name === tagName);
        return tagObject ? tagObject.id : null;
      })
      .filter((id) => id !== null);

    // Prepare data to send in the request body
    const blogData = {
      title,
      imageUrl,
      authorId,
      tagIds, // Send tag IDs to the API
      content: value,
    };

    try {
      let response;

      if (isEditMode) {
        // Update existing blog
        response = await axios.put(`${apiUrl}/blog/edit/${blogId}`, blogData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('p73SessionData')}`,
          },
        });
      } else {
        // Create new blog
        response = await axios.post(`${apiUrl}/blog/add`, blogData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('p73SessionData')}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          title: isEditMode ? 'Blog Updated' : 'Blog Created',
          description: isEditMode
            ? 'Your blog post has been updated successfully!'
            : 'Your blog post has been created successfully!',
          type: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Navigate back to admin page after successful submission
        setTimeout(() => {
          navigate('/Admin');
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to save blog');
      }
    } catch (error) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} blog`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return null; // Don't render until auth check is complete
  }

  return (
    <>
      <Toaster />
      <Container maxW={containerMaxWidth} px={containerPadding} py={4}>
        <Heading mb={6} textAlign='center'>
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </Heading>

        {isLoading ? (
          <Stack spacing={4}>
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='20px' width='30%' />
            <Skeleton height='400px' />
          </Stack>
        ) : (
          <Box data-color-mode={EditorTheme}>
            <Stack spacing={4}>
              <Field.Root>
                <Field.Label htmlFor='title'>Title</Field.Label>
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter blog title'
                />
              </Field.Root>

              <Field.Root>
                <Field.Label htmlFor='imageUrl'>Image URL</Field.Label>
                <Stack>
                  <Input
                    id='imageUrl'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder='Enter image URL (optional)'
                  />
                  {imageUrl && (
                    <Box
                      mt={2}
                      borderRadius='md'
                      overflow='hidden'
                      maxH='200px'
                    >
                      <Image
                        src={imageUrl}
                        alt='Blog preview'
                        fallback={
                          <Box p={4} bg='gray.100' textAlign='center'>
                            Invalid image URL
                          </Box>
                        }
                        maxH='200px'
                        objectFit='contain'
                      />
                    </Box>
                  )}
                </Stack>
              </Field.Root>

              {/* Tag Selection - Now using tag names instead of IDs */}
              <Field.Root>
                <Field.Label htmlFor='tags'>Tags</Field.Label>
                <Box>
                  {tagsLoading ? (
                    <HStack spacing={2} mt={2} flexWrap='wrap'>
                      <Skeleton height='20px' width='50px' />
                      <Skeleton height='20px' width='50px' />
                      <Skeleton height='20px' width='50px' />
                    </HStack>
                  ) : tagsError ? (
                    <Text color='red.500'>Error loading tags</Text>
                  ) : (
                    <Flex flexWrap='wrap' gap={2}>
                      {fetchedTags.map((tag) => (
                        <Tag.Root
                          key={tag.id}
                          colorPalette={
                            selectedTags.includes(tag.name) ? 'green' : 'gray'
                          }
                          size='md'
                          onClick={() => handleTagClick(tag.name)}
                          cursor='pointer'
                          boxShadow='sm'
                          _hover={{
                            transform: 'translateY(-1px)',
                            boxShadow: 'md',
                          }}
                          transition='all 0.2s'
                        >
                          <TagLabel>{tag.name}</TagLabel>
                          {selectedTags.includes(tag.name) && (
                            <Tag.EndElement>
                              <Tag.CloseTrigger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagClick(tag.name);
                                }}
                              />
                            </Tag.EndElement>
                          )}
                        </Tag.Root>
                      ))}
                    </Flex>
                  )}
                </Box>
              </Field.Root>

              {/* Markdown Editor - UI fixes applied */}
              <Field.Root>
                <Field.Label htmlFor='content'>Content</Field.Label>
                <Box
                  width='100%'
                  sx={{
                    '.w-md-editor': {
                      width: '100% !important',
                      maxWidth: '100%',
                      border: '1px solid',
                      borderColor: 'gray.200',
                      borderRadius: 'md',
                    },
                    '.w-md-editor-content': {
                      height: editorHeight + ' !important',
                    },
                    '.w-md-editor-text': {
                      minHeight: 'auto !important',
                    },
                    '.w-md-editor-text-pre, .w-md-editor-text-input, .w-md-editor-text-pre > code':
                      {
                        minHeight: 'auto !important',
                      },
                  }}
                >
                  <MDEditor
                    value={value}
                    onChange={(val) => setValue(val)}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                    height={editorHeight}
                    style={{ width: '100%' }}
                  />
                </Box>
              </Field.Root>

              {error && (
                <Box p={3} bg='red.50' color='red.500' borderRadius='md'>
                  {error}
                </Box>
              )}

              <Flex justifyContent='space-between' mt={4} mb={6}>
                <Button
                  variant='outline'
                  onClick={() => navigate('/Admin')}
                  width={{ base: '48%', sm: 'auto' }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme='blue'
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  loadingText='Submitting'
                  width={{ base: '48%', sm: 'auto' }}
                >
                  {isEditMode ? 'Update Blog' : 'Add Blog'}
                </Button>
              </Flex>
            </Stack>
          </Box>
        )}
      </Container>

      <Footer />
    </>
  );
}
