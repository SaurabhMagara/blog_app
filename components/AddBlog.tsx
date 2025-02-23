"use client";

import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import JoditEditor from "jodit-react";

interface BlogPost {
  title: string;
  content: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  onSubmit: (blog: BlogPost) => void;
}

const AddBlog: React.FC<BlogModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      toolbarAdaptive: false, // Ensures the toolbar is always visible
      toolbarSticky: true, // Toolbar stays fixed while scrolling
      uploader: {
        insertImageAsBase64URI: true, // Allows direct image upload as base64 (No server needed)
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "image",
        "link",
        "brush",
        "|",
        "align",
        "font",
        "fontsize",
        "|",
        "undo",
        "redo",
        "eraser",
        "|",
        "source",
      ], // Customize buttons
      height: 400,
      placeholder: "Start typings...",
    }),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", content: "" });
    onClose(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => onClose(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Create New Blog Post
                </h2>
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                  onChange={(newContent) => {}}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Post
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddBlog;
