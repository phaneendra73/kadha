import { Routes, Route } from 'react-router-dom';
import BlogPosts from './screens/Blogposts';
import { Box } from '@chakra-ui/react';
import Appbar from './components/ui/Appbar';
import MarkdownEditor from './screens/MarkdownEditor';

const App = () => {
  return (
    <>
      <Appbar />
      <Box pt='80px'>
        <Routes>
          <Route path='/Editor' element={<MarkdownEditor />} />
          <Route path='/BlogPosts' element={<BlogPosts />} />
          {/* <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} /> */}
        </Routes>
      </Box>
    </>
  );
};

export default App;
