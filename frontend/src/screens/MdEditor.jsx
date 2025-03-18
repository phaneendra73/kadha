import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import {
  Appbar,
  Footer,
  useColorModeValue,
  Skeleton,
} from '../components/ui/index';
import rehypeSanitize from 'rehype-sanitize';
import useTags from '../hooks/useTags';
import { Toaster, toaster } from '../components/ui/toaster';
import axios from 'axios';
import { getenv } from '../utils/getenv';

export default function MdEditor() {
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toaster.create({
        title: 'Access Restricted',
        description:
          'Please log in to create blog posts. Only admins can add new content.',
        type: 'warning',
        duration: 8000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/Admin');
      }, 4000);
    }
  }, [navigate]);

  const EditorTheme = useColorModeValue('light', 'dark');
  const [value, setValue] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = getenv('APIURL');

  // Responsive values
  const editorHeight = useBreakpointValue({ base: '50vh', md: '80vh' });
  const editorWidth = useBreakpointValue({ base: '100%', md: '98vw' });
  const containerPadding = useBreakpointValue({ base: '2', md: '4' });

  // Fetch tags using the hook
  const {
    tags: fetchedTags,
    error: tagsError,
    loading: tagsLoading,
  } = useTags();

  // Handle tag selection and deselection
  const handleTagClick = (tagId, tagName) => {
    if (selectedTags.some((tag) => tag.id === tagId)) {
      setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId)); // Deselect tag
    } else {
      setSelectedTags([...selectedTags, { id: tagId, name: tagName }]); // Select tag
    }
  };

  // Submit handler for the form
  const handleSubmit = async () => {
    if (!title || !value) {
      setError('Title and content are required.');
      return;
    }

    if (!localStorage.getItem('authToken')) {
      toaster.create({
        title: 'Not logged in',
        description: 'Please log in to add a blog post.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    const authorId = 1;

    // Prepare data to send in the request body
    const blogData = {
      title,
      imageUrl,
      authorId, // Add the author's ID to the request
      tagIds: selectedTags.map((tag) => tag.id), // Extract tag IDs from selected tags
      content: value,
    };

    try {
      const response = await axios.post(`${apiUrl}/blog/add`, blogData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const result = response.data;
      if (response.status === 201) {
        toaster.create({
          title: 'Blog Created',
          description: 'Your blog post has been created successfully!',
          type: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Optionally, reset form fields after submission
        setTitle('');
        setImageUrl('');
        setSelectedTags([]);
        setValue('**Hello world!!!**');
      } else {
        setError(result.error || 'Failed to create blog');
      }
    } catch (error) {
      setError('Failed to create blog');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <Appbar />
      <Container maxW='container.xl' px={containerPadding} py={4}>
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
              <Input
                id='imageUrl'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder='Enter image URL (optional)'
              />
            </Field.Root>

            {/* Tag Selection */}
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
                          selectedTags.some((t) => t.id === tag.id)
                            ? 'green'
                            : 'gray'
                        }
                        size='md'
                        onClick={() => handleTagClick(tag.id, tag.name)}
                        cursor='pointer'
                      >
                        <TagLabel>{tag.name}</TagLabel>
                        {selectedTags.some((t) => t.id === tag.id) && (
                          <Tag.EndElement>
                            <Tag.CloseTrigger
                              onClick={() => handleTagClick(tag.id, tag.name)}
                            />
                          </Tag.EndElement>
                        )}
                      </Tag.Root>
                    ))}
                  </Flex>
                )}
              </Box>
            </Field.Root>

            {/* Markdown Editor */}
            <Field.Root>
              <Field.Label htmlFor='content'>Content</Field.Label>
              <Box width='100%' overflowX='hidden'>
                <MDEditor
                  value={value}
                  onChange={(val) => setValue(val)}
                  previewoptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                  height={editorHeight}
                  width={editorWidth}
                />
              </Box>
            </Field.Root>

            {error && <Box color='red.500'>{error}</Box>}

            <Flex justifyContent='center' mt={4} mb={6}>
              <Button
                colorScheme='blue'
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText='Submitting'
                width={{ base: '100%', sm: 'auto' }}
              >
                Add Blog
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Container>

      <Footer />
    </>
  );
}
