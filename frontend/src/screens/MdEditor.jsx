import { useState } from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import { Box, Button, Heading, Input, Stack, Field } from '@chakra-ui/react'; // Import Chakra UI components
import { Appbar, Footer, useColorModeValue } from '../components/ui/index';
import rehypeSanitize from 'rehype-sanitize';

function Header() {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      p='2'
    >
      <Heading size='lg'>Markdown Editor</Heading>
    </Box>
  );
}

export default function MdEditor() {
  const EditorTheme = useColorModeValue('light', 'dark');
  const [value, setValue] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !value) {
      setError('Title and content are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Prepare data to send in the request body
    const blogData = {
      title,
      imageUrl,
      tagIds: tags.split(',').map((tag) => tag.trim()), // Example: tags could be "1,2,3"
      content: value,
    };

    try {
      const response = await fetch('/api/blogs/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Blog created successfully!');
        // Optionally, reset form fields after submission
        setTitle('');
        setImageUrl('');
        setTags('');
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
      <Appbar />
      <Header />
      <Box className='container' mt='4'>
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

            <Field.Root>
              <Field.Label htmlFor='tags'>Tags (comma-separated)</Field.Label>
              <Input
                id='tags'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='Enter tag IDs, e.g., 1,2,3'
              />
            </Field.Root>

            <Field.Root>
              <Field.Label htmlFor='content'>Content</Field.Label>
              <MDEditor
                value={value}
                onChange={(val) => setValue(val)}
                previewoptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                height={'80vh'}
                width='99vw'
              />
            </Field.Root>

            {error && <Box color='red.500'>{error}</Box>}

            <Button
              colorScheme='blue'
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText='Submitting'
            >
              Add Blog
            </Button>
          </Stack>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
