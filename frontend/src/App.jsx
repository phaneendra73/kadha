import { Routes, Route, Navigate } from 'react-router-dom';
import BlogPosts from './screens/Blogposts';
import MdEditor from './screens/MdEditor';
import LandingPage from './screens/LandingPage';
import MdReader from './screens/MdReader';
import Signin from './screens/Signin';
import NotFound from './screens/NotFound';
import AdminPage from './screens/AdminPage';
import TagManager from './screens/TagManager';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/Read' element={<MdReader />} />
        <Route path='/Editor/:id?' element={<MdEditor />} />
        <Route path='/BlogPosts' element={<BlogPosts />} />
        <Route path='/Signin' element={<Signin />} />
        <Route path='/Admin' element={<AdminPage />} />
        <Route path='/Tag' element={<TagManager />} />
        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<Navigate to='/404' replace />} />
      </Routes>
    </>
  );
};

export default App;
