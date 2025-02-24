import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useColorModeValue } from '../components/ui/color-mode';
import Footer from './Footer';
export default function MdEditor() {
  const EditorTheme = useColorModeValue('light', 'dart');
  const [value, setValue] = React.useState('**Hello world!!!**');
  return (
    <>
      <div className='container'>
        <div data-color-mode={EditorTheme}>
          <MDEditor
            value={value}
            onChange={(val) => {
              setValue(val);
            }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            height={'90vh'}
          />
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
