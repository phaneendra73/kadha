import React from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import { Box, Button, Heading } from '@chakra-ui/react'; // Import Chakra UI components
import Footer from '../components/ui/Footer';
import rehypeSanitize from 'rehype-sanitize';
import { useColorModeValue } from '../components/ui/color-mode';
// Header component using Chakra UI
function Header() {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      p='4'
    >
      <Heading size='lg'>Markdown Editor</Heading>
      <Button colorScheme='blue' onClick={() => alert('Post saved')}>
        Save Post
      </Button>
    </Box>
  );
}

export default function MdEditor() {
  const EditorTheme = useColorModeValue('light', 'dark');
  const [value, setValue] = React.useState('**Hello world!!!**');

  return (
    <>
      {/* Header with Save Post Button */}
      <Header />
      <Box className='container' mt='4'>
        <Box data-color-mode={EditorTheme}>
          <MDEditor
            value={value}
            onChange={(val) => setValue(val)}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            height={'80vh'}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
}
