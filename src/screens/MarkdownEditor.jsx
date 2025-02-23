// MarkdownEditor.js

import { useRef, useEffect } from 'react';
import EasyMDE from 'easymde'; // EasyMDE library
import 'easymde/dist/easymde.min.css'; // EasyMDE default styles

const MarkdownEditor = ({ value, onChange, theme = 'light' }) => {
  const textAreaRef = useRef(null); // Ref for the textarea

  useEffect(() => {
    // Initialize EasyMDE with the ref and the required settings
    const easyMDE = new EasyMDE({
      element: textAreaRef.current,
      initialValue: value,
      theme: theme, // 'light' or 'dark'
      toolbar: [
        'bold',
        'italic',
        '|',
        'heading',
        'quote',
        '|',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
      ],
      status: false,
      spellChecker: false,
    });

    // When the content changes in the editor, call onChange to update the state
    easyMDE.codemirror.on('change', () => {
      onChange(easyMDE.value());
    });

    // Cleanup the EasyMDE instance when the component unmounts
    return () => {
      easyMDE.toTextArea();
    };
  }, [value, onChange, theme]);

  return <textarea ref={textAreaRef} />;
};

export default MarkdownEditor;
