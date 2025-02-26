"use client";

import React, { useState, useEffect, useRef } from "react";
import { DeleteIcon, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useUserContext } from "@/context/userContext";

interface Comment {
  _id: string;
  blogId: {_id : string, postedBy : string};
  userId: {username : string, _id :string}
  content: string;
  createdAt: string;
}

interface CommentModalProps {
  blogId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  blogId,
  isOpen,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const {user} = useUserContext();

  // Handle clicking outside to close modal
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";

      // Fetch comments
      fetchComments();
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "auto";
    };
  }, [isOpen, blogId, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Fetch comments (mock implementation)
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blogs/${blogId}/get_comments`);

      // console.log(response);
      setComments(response.data.data)
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  // Submit a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPostingComment(true);
    if (!newComment.trim()) return;

    try {
      // In a real app, you would send this to your API
      const response = await axios.post(`/api/blogs/${blogId}/add_comment`, {
        userid : user?._id,
        content : newComment
      });

      // console.log(response);
      await fetchComments();
      setNewComment("");
      setIsPostingComment(false);
    } catch (error : any) {
      console.error("Error posting comment:", error);
      toast.error(error?.response?.data?.message);
    }finally{
        setIsPostingComment(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteComment= async(id : string)=>{
    try {
      const response = await axios.delete(`/api/blogs/${blogId}/delete_comment/${id}`);
      // console.log(response);
      await fetchComments()
    } catch (error : any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong.")
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-gradient-to-b from-violet-200 to-indigo-100 rounded-lg shadow-xl w-full md:w-5/12  h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-violet-600">
          <h3 className="text-xl font-semibold text-violet-800">Comments</h3>
          <button
            onClick={onClose}
            className="text-violet-400 hover:text-violet-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-[90vh]">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-violet-500 py-8 h-[90vh]">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border border-violet-400 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{comment.userId?.username}</h4>
                    <div className="flex gap-2 justify-center items-center">
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment?.userId?._id === user?._id ||
                      comment?.blogId?.postedBy === user?._id ? (
                        <button onClick={()=>handleDeleteComment(comment._id)} className="bg-red-400 hover:bg-red-500 cursor-pointer rounded-full text-white ">
                          <Trash2 className="p-1" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSubmitComment}>
            <div className="mb-3">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 ring-1 ring-violet-400 bg-inherit rounded-lg focus:outline-none focus:ring-2 min-h-24 resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2  text-slate-100 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${
                  isPostingComment
                    ? "bg-violet-400 hover:bg-violet-400"
                    : "bg-violet-800 hover:bg-violet-600"
                }`}
                disabled={isPostingComment}
              >
                {isPostingComment ? "Posting comment..." : "Post Comment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
