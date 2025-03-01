"use client";

import Navbar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import axios from "axios";
import { ArrowBigLeft, ArrowBigRight, HeartIcon, MessageCircleIcon, MoveLeft, Plus } from "lucide-react";
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
  createdAt: string;
  updatedAt: string;
  postedBy: { _id: string; username: string };
}

const MyBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { user, loading } = useUserContext();
  const [loadings, setLoadings] = useState(false)

  useEffect(() => {
    if(!user){
        return
    }

    if (!user && !loading) {
      router.push("/login");
      return;
    }

    const getBlogsOfUser = async () => {
      try {
        setLoadings(true);
        const response = await axios.get(`/api/users/${user?._id}/get_blogs`);
        // console.log(response);
        setBlogs(response?.data?.data);
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Can not fetch blogs.");
      }finally{
        setLoadings(false);
      }
    };

    getBlogsOfUser();
  }, []);

  const router = useRouter();
  const handleNavigate = () => {
    router.push("/blogs/add_blog");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-violet-200 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 items-center mb-4  p-4 border-b-2 border-violet-700">
            <Link href={"/blogs"} className="rounded-full hover:bg-violet-700">
              <MoveLeft className="text-gray-100 p-1 rounded-full bg-violet-600" />
            </Link>
            <h1 className="text-4xl text-violet-800 font-bold">My Blogs</h1>
          </div>
          {blogs?.length < 0 ? (
            <div className="flex justify-center items-center h-[90vh] bg-gradient-to-b from-violet-200 to-indigo-100">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {blogs.map((blog) => (
                <Link href={`/blogs/${blog._id}`} key={blog._id}>
                  <div className="bg-gradient-to-l from-violet-50 to-violet-200 rounded-lg overflow-hidden shadow-violet-200 shadow-lg cursor-pointer group  flex flex-col  h-[377px]">
                    <div className="w-full h-56 overflow-hidden ">
                      <img
                        src={blog?.image.url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                      />
                    </div>

                    <div className="px-6 pt-2 flex flex-col justify-between">
                      <div className="pb-2">
                        <h2 className="text-2xl text-violet-700 font-semibold">
                          {blog.title}
                        </h2>
                        <span className="text-violet-500">
                          Author : {blog.postedBy.username}
                        </span>
                      </div>
                      <p
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                      <div className="flex items-center justify-end space-x-6 border-t py-2 px-5">
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
                  </div>
                </Link>
              ))}
            </div>
          )}

          {blogs.length === 0 && !loadings && (
            <div className="flex flex-col justify-center items-center h-[50vh] bg-inherit gap-1">
              <h2 className="text-violet-600 font-semibold"> No blogs Yet</h2>
              <p className="text-violet-500">Cick below button to first blog</p>
              <button
                onClick={handleNavigate}
                className="bg-violet-600 px-4 py-2 rounded-lg text-gray-100 flex gap-1"
              >
                Add blog <ArrowBigRight></ArrowBigRight>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBlogs;
