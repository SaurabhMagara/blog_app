"use client";

import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  username: string;
  email: string;
  profile_pic: {
    public_id: string;
    url: string;
  };
  _id: string;
  blogs: Array<string>;
}

const Navbar = () => {
  const { user, loading } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userDetails, setUserDeatils] = useState<User>();
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", { withCredentials: true });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  // use Effect for fetching current users details
  useEffect(() => {
    // wait for user to be load
    if (!user) return;

    // if(!user && !loading) return;

    const getUser = async () => {
      try {
        const response = await axios.get(`/api/users/${user?._id}`);
        // console.log(response.data.data);
        setUserDeatils(response.data.data);
        // toast.success("User fetched");
      } catch (error: any) {
        console.log(error);
        // toast.error(error?.response?.data?.message);
      }
    };
    getUser();
  }, [user]);

  return (
    <nav className="sticky top-0 z-10 bg-violet-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Title/Logo */}
          <div className="flex-shrink-0">
            <Link href="/blogs">
              <span className="text-2xl font-bold cursor-pointer">
                TechBlogs
              </span>
            </Link>
          </div>

          {/* Profile section */}
          {!loading && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {userDetails?.profile_pic ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-300">
                    <img
                      src={userDetails?.profile_pic.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-violet-400 rounded-full overflow-hidden border-2 border-violet-300 flex justify-center items-center">
                    <span className="text-xl">{userDetails?.username?.charAt(0)?.toUpperCase()}</span>
                  </div>
                )}
                <svg
                  className={`ml-1 h-5 w-5 transition-transform ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-violet-900 rounded-lg shadow-lg py-2 z-20">
                  {/* Profile info section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border border-violet-300">
                        <img
                          src={userDetails?.profile_pic.url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-violet-800">
                          {userDetails?.username}
                        </p>
                        <p className="text-sm text-violet-600 truncate">
                          {userDetails?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu options */}
                  <div className="px-2 py-2">
                    {/* <Link href="/profile"> */}
                    <div className="px-4 py-2 text-sm hover:bg-violet-100 rounded-md cursor-pointer flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      My Profile
                    </div>
                    {/* </Link> */}
                    {/* <Link href={`/myblogs/${userDetails?._id}`}> */}
                    <div className="px-4 py-2 text-sm hover:bg-violet-100 rounded-md cursor-pointer flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        ></path>
                      </svg>
                      My Blogs
                    </div>
                    {/* </Link> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-violet-100 rounded-md cursor-pointer flex items-center text-red-600"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
