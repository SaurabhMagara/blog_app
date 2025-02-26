"use client";

import Navbar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import axios from "axios";
import { HeartIcon, MessageCircleIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: {
    public_id: string;
    url: string;
  };
  comments: number;
  likes: number;
  createAt: string;
  updatedAt: string;
}

const Blogs = () => {
  const [loadings, setLoadings] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { user, loading } = useUserContext();

  useEffect(() => {
    // console.log(user)

    if (!user && !loading) {
      router.push("/login");
      return;
    }

    const getAllBlogs = async () => {
      setLoadings(true);
      try {
        const response = await axios.get("/api/blogs");
        // console.log(response);
        setBlogs(response?.data?.data);
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Can not fetch blogs.");
        router.push("/login");
      } finally {
        setLoadings(false);
      }
    };

    getAllBlogs();
  }, []);

  const router = useRouter();
  const handleNavigate = () => {
    router.push("/blogs/add_blog");
  };

  return (
    <>
      <Navbar />
      <div className=" relative min-h-screen bg-gradient-to-b from-violet-200 to-indigo-100 p-6">
        <button
          onClick={() => handleNavigate()}
          className="fixed bottom-8 right-5 md:bottom-16 md:right-20 z-20 rounded-full bg-violet-600 hover:bg-violet-700 p-3 text-white hover:scale-105 transition-all"
        >
          <Plus className="" height={25} width={25} />
        </button>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4  p-4 border-b-2 border-violet-700">
            <h1 className="text-4xl text-violet-800 font-bold">Blogs</h1>
          </div>
          {blogs?.length <= 0 ? (
            <div className="flex justify-center items-center h-[90vh] bg-gradient-to-b from-violet-200 to-indigo-100">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {blogs.map((blog) => (
                <Link href={`/blogs/${blog._id}`} key={blog._id}>
                  <div className="bg-gradient-to-l from-violet-50 to-violet-200 rounded-lg overflow-hidden shadow-violet-200 shadow-lg cursor-pointer group  flex flex-col">
                    <div className="w-full h-48 overflow-hidden ">
                      <img
                        src={blog?.image.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                      />
                    </div>

                    <div className="p-6 flex flex-col justify-between">
                      <h2 className="text-2xl text-violet-700 font-semibold mb-4">
                        {blog.title}
                      </h2>
                      <p
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-6 border-t px-5 py-3">
                      <div className="flex items-center space-x-2 text-red-500 ">
                        <HeartIcon />
                        <span>{blog?.likes} likes</span>
                      </div>

                      <div className="flex items-center space-x-2 text-blue-500">
                        <MessageCircleIcon size={20} />
                        <span>{blog?.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;
