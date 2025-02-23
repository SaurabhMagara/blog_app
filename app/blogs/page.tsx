"use client";

import { useUserContext } from "@/context/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
}

const Blogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const {user} = useUserContext();

  useEffect(() => {

    if(!user){
      router.push("/auth/login");
      return;
    }

    const getAllBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs");
        console.log(response);
        setBlogs(response?.data?.data);
      } catch (error: any) {
        console.log(error);
        toast.error(error?.message || "Can not fetch blogs.");
      }
    };

    getAllBlogs();
  }, []);

  const router = useRouter();
  const handleNavigate = ()=>{
    router.push("/blogs/add_blog")
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-violet-200 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4  p-4 border-b-2 border-violet-700">
            <h1 className="text-4xl text-violet-800 font-bold">Latest Blogs</h1>
            <button
              onClick={() => handleNavigate()}
              className="px-4 py-2 rounded-xl bg-violet-800 text-slate-100"
            >
              Add Blog
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog?._id}
                className="bg-gradient-to-l from-violet-50 to-violet-200 rounded-lg overflow-hidden shadow-violet-200 shadow-lg cursor-pointer group"
              >
                <div className="w-full h-48 overflow-hidden ">
                  <img
                    src={blog?.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl text-violet-700 font-semibold mb-4">
                    {blog.title}
                  </h2>
                  <p className=" mb-4 line-clamp-3" dangerouslySetInnerHTML={{__html: blog.content}} />

                  <button className="w-full bg-violet-500 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    See More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
