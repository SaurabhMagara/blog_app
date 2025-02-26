"use client";

import React, { useMemo, useRef, useState, DragEvent, FormEvent } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BlogPost {
  title: string;
  content: string;
  image: File | null;
}

interface ImagePreview {
  url: string;
  name: string;
  size: number;
}

const add_blog: React.FC = () => {
  const { user } = useUserContext();
  const router = useRouter();

  // console.log(user);
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    content: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false,
      toolbarAdaptive: false,
      toolbarSticky: true,
      uploader: {
        insertImageAsBase64URI: true,
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
      ],
      height: 470,
      placeholder: "Start typing...",
    }),
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview({
          url: reader.result as string,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file");
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.image) {
      toast.error("Image is required.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.title || !formData.content) {
      toast.error("Title and content is required.");
      setIsSubmitting(false);
      return;
    }

    const fileData = new FormData();
    fileData.append("title", formData?.title);
    fileData.append("image", formData?.image);
    fileData.append("content", formData?.content);

    try {
      // Simulate API call
      const response = await axios.post(
        `/api/users/${user?._id}/create_blog`,
        fileData,
        {
          headers: {
            "Content-Type": "multipart/formdata",
          },
        }
      );
      console.log(response);
      setFormData({ title: "", content: "", image: null });
      setContent("");
      setImagePreview(null);
      toast.success("Blog created Successfully.");
      router.push("/blogs");
    } catch (error: any) {
      console.error("Error submitting blog post:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-violet-200 to-indigo-100">
      <div className="flex flex-col gap-3 w-full h-full rounded-lg overflow-hidden px-4 py-3 md:px-5">
        <div className="flex justify-between w-full border-b-2 border-violet-700 py-4">
          <h1 className="text-3xl font-bold text-violet-800">
            Create Blog Post
          </h1>
          <button
            type="submit"
            onClick={(e: FormEvent) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl bg-violet-800 text-slate-100 hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hidden md:block ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Publishing..." : "Post"}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full justify-around"
        >
          <div className="w-full flex justify-center">
            <div className=" w-11/12 h-[91%] ">
              <label className="block text-sm font-medium text-violet-700 pb-2">
                Featured Image
              </label>
              <div
                className={`h-[91%] border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging
                    ? "border-violet-500 bg-blue-50"
                    : "border-gray-300 hover:border-violet-400"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageChange(e.target.files[0]);
                    }
                  }}
                />

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview.url}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <div className="mt-2 text-center text-sm text-gray-600">
                      {imagePreview.name} ({formatFileSize(imagePreview.size)})
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-center cursor-pointer flex justify-center items-center h-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-violet-600">
                      <p>Drag and drop an image here, or click to select</p>
                      <p className="text-sm mt-2">
                        Supports: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-violet-700 pb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-inherit text-violet-600"
                required
                placeholder="Enter your blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-violet-700 pb-2">
                Content
              </label>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                className=""
                onBlur={(newContent) => setContent(newContent)}
                onChange={(newContent) => {
                  setFormData((prev) => ({
                    ...prev,
                    content: newContent,
                  }));
                }}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  md:hidden ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {" "}
                {isSubmitting ? "Publishing..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default add_blog;
