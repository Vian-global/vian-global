import { useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  // Synchronize initial value or updates from parent
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '<p><br></p>';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const addLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) {
      execCmd('createLink', url);
    }
  };

  const addImage = () => {
    const url = prompt('Enter the image URL:');
    if (url) {
      execCmd('insertImage', url);
    }
  };

  return (
    <div className="wysiwyg-container">
      {/* Premium Glassmorphic Toolbar */}
      <div className="wysiwyg-toolbar" role="toolbar" aria-label="Rich Text Formatting">
        <button type="button" onClick={() => execCmd('formatBlock', '<h2>')} title="Heading 2">H2</button>
        <button type="button" onClick={() => execCmd('formatBlock', '<h3>')} title="Heading 3">H3</button>
        <button type="button" onClick={() => execCmd('formatBlock', '<p>')} title="Paragraph">P</button>
        
        <div className="toolbar-divider" />
        
        <button type="button" onClick={() => execCmd('bold')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => execCmd('italic')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => execCmd('underline')} title="Underline"><u>U</u></button>
        <button type="button" onClick={() => execCmd('strikeThrough')} title="Strikethrough"><s>S</s></button>
        
        <div className="toolbar-divider" />
        
        <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Bullet List">• List</button>
        <button type="button" onClick={() => execCmd('insertOrderedList')} title="Numbered List">1. List</button>
        <button type="button" onClick={() => execCmd('formatBlock', '<blockquote>')} title="Blockquote">“ Quote</button>
        
        <div className="toolbar-divider" />
        
        <button type="button" onClick={addLink} title="Insert Link">🔗 Link</button>
        <button type="button" onClick={addImage} title="Insert Image">🖼️ Image</button>
        <button type="button" onClick={() => execCmd('removeFormat')} title="Clear Formatting">🧹 Clean</button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        className="wysiwyg-editor"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        placeholder="Start writing your premium article..."
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default RichTextEditor;
