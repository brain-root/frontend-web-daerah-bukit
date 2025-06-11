import React from "react";
import { Bold, Italic, List, Link as LinkIcon } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something...",
}) => {
  // This is a simplified rich text editor
  // In a production app, you'd use a library like TinyMCE, CKEditor, or Quill

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // These buttons would normally apply formatting to the text
  // Since we're not implementing a full editor, they're just placeholders
  const formatBold = () => {
    onChange(value + "**bold text**");
  };

  const formatItalic = () => {
    onChange(value + "*italic text*");
  };

  const formatList = () => {
    onChange(value + "\n- List item");
  };

  const formatLink = () => {
    onChange(value + "[link text](http://example.com)");
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-gray-300 bg-gray-50">
        <button
          type="button"
          onClick={formatBold}
          className="p-1 rounded hover:bg-gray-200 mr-1"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={formatItalic}
          className="p-1 rounded hover:bg-gray-200 mr-1"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={formatList}
          className="p-1 rounded hover:bg-gray-200 mr-1"
          title="Bulleted List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={formatLink}
          className="p-1 rounded hover:bg-gray-200"
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-3 min-h-[150px] focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
