import { Routes, Route } from 'react-router-dom';
import BlogPosts from './screens/Blogposts';
import { Box } from '@chakra-ui/react';
import MdEditor from './screens/MdEditor';
import LandingPage from './screens/LandingPage';
import MdReader from './components/ui/MDReader';
import Signin from './screens/Signin';

const App = () => {
  return (
    <>
      <Box pt='80px'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/Blog/Read/:id' element={<MdReader />} />
          <Route path='/Editor' element={<MdEditor />} />
          <Route path='/BlogPosts' element={<BlogPosts />} />
          <Route path='/Admin' element={<Signin />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
