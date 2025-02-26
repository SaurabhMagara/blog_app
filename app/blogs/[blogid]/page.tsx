"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import toast from "react-hot-toast";
import CommentModal from "@/components/CommentModal";

// defining blog type
export interface Blog {
  title: string;
  content: string;
  image: string;
  updatedAt: string;
  comments: number;
  likes: number;
}

// defining like type
interface Like {
  userid: string;
  blogid: string;
  _id: string;
}

// for formating createdAt time stamps
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Extract hours, minutes, and AM/PM
  let hours = date.getHours();
  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

  // Extract day, short month, and year
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  // Return formatted string with the extra space after hh:mm
  return `${day} ${month} ${year}`;
};

export default function BlogPage() {
  // getting user from context
  const { user } = useUserContext();

  // getting blogid from params
  const { blogid } = useParams();
  const [blog, setBlog] = useState<Blog>(); // for setting details
  const [loading, setLoading] = useState(true); // for loading
  const [likedByUser, setLikedByUser] = useState(false); // for checking if user is liked blog or not
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // for handeling comment modal

  // getting blogs and likes in useEffect
  useEffect(() => {

    // getting likes
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${blogid}`);
        // console.log(response);
        setBlog(response.data.data);
      } catch (error : any) {
        console.error("Error fetching blog:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    // getting likes
    const getLikes = async () => {
      try {
        const response = await axios.get(`/api/blogs/${blogid}/get_likes`);
        console.log(response);

        // checking if user liked the blog or not
        response?.data?.data?.map((val: Like) =>
          val?.userid ? setLikedByUser(true) : setLikedByUser(false)
        );
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Somwthing went wrong fetching Likes.")
      }
    };

    if (blogid) {
      fetchBlog();
      getLikes();
    }
  }, [blogid, likedByUser, isCommentModalOpen]);

  // method for like and unlike blog
  const handleLike = async () => {
    console.log(user?._id);
    // if blog exists then
    if (blog) {
      // if already liked then remove like
      if (likedByUser) {
        try {
          const response = await axios.post(
            `/api/blogs/${blogid}/remove_like`,
            {
              userid: user?._id,
            }
          );
          console.log("Remove like ------->", response);
          setLikedByUser(false);
          toast.success("Unliked 😔");
        } catch (error: any) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      } else {
        // if user didnt have liked, then add like
        try {
          const response = await axios.post(`/api/blogs/${blogid}/like_blog`, {
            userid: user?._id,
          });

          console.log("Like response -------->", response);
          setLikedByUser(true);
          toast.success("Liked ❤️");
        } catch (error: any) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      }
    }
  };

  // handeling comment modal
  const handleComment = () => {
    setIsCommentModalOpen(true);
  };

  // if loading then shows loading 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // if there is no blog then show no blog
  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-violet-200 to-indigo-100">
        Blog not found
      </div>
    );
  }

  return (
    <div className="felx bg-gradient-to-b from-violet-200 to-indigo-100 flex justify-center">
      <div className=" px-4 py-8  md:w-9/12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 pb-3 text-violet-700 border-b border-violet-500">
            {blog?.title}
          </h1>
          <div className="text-violet-500 mb-4">
            {formatTimestamp(blog?.updatedAt)}
          </div>
        </div>

        <div className="relative w-full mb-8">
          <img
            src={blog?.image || ""}
            alt={blog?.title || "image"}
            className="object-cover rounded-lg"
          />
        </div>

        {/* JoEditor content - rendered as HTML */}
        <div
          className="porse mb-8 "
          dangerouslySetInnerHTML={{ __html: blog?.content || "" }} // it renders html content
        />

        <div className="flex items-center space-x-6 mt-8 border-t pt-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <HeartIcon
              size={20}
              className={likedByUser ? "fill-red-500 text-red-500" : ""}
            />
            <span>{blog?.likes} likes</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircleIcon size={20} />
            <span>{blog?.comments} comments</span>
          </button>
        </div>
        <div className="relative">
          <CommentModal
            blogId={blogid as string}
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
