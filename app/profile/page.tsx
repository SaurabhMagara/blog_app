"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  User,
  KeyRound,
  Mail,
  ArrowLeft,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProfilePage = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    blogCount: 0,
    profile_pic : ""
  });

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    profile_pic: "",
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>();
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form errors
  const [passwordError, setPasswordError] = useState("");

  const handleProfileUpdate = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (
      (!userData.email || userData.email.trim() === "") &&
      (!userData.username || userData.username.trim() === "") &&
      (!profilePic)
    ) {
      toast.error("Please fill field to update. ");
      return;
    }

    const fileData = new FormData();
    fileData.append("username", form?.username);
    fileData.append("email", form?.email);
    fileData.append("image", profilePic || "");

    try {
      const response = await axios.post(
        `/api/users/${user?._id}/update_profile`,
        fileData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData({
        username : response?.data?.data?.username,
        email : response?.data?.data?.email,
        blogCount : response?.data?.data?.blogs?.length,
        profile_pic : response?.data?.data?.profile_pic?.url
      });

      setProfilePic(null);
      setProfilePicPreview(response?.data?.data?.profile_pic?.url);
      setShowProfileModal(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update.");
    }finally{
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    // In a real app, you would call an API to update the password
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const getUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${user?._id}`);
        setUserData({
          blogCount: response?.data?.data?.blogs?.length,
          email: response?.data?.data?.email,
          username: response?.data?.data?.username,
          profile_pic  :response?.data?.data?.profile_pic?.url
        });
        setProfilePicPreview(response?.data?.data?.profile_pic?.url);
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };

    getUserDetails();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 to-indigo-100">
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4">
        {/* Back Button */}
        <button
          className="flex items-center text-violet-500 mb-6 hover:text-violet-600"
          onClick={() => router.push("/blogs")}
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to blogs
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="rounded-full h-56 w-56 overflow-hidden">
            <img
              src={userData.profile_pic}
              className="object-cover h-56 w-56"
            />
          </div>
          <div className="w-11/12 md:w-auto">
            <h1 className="text-2xl font-bold text-violet-800 mb-6">
              My Profile
            </h1>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <User className="text-violet-600 mr-3" />
                  <div>
                    <p className="text-sm text-violet-500">Username</p>
                    <p className="font-medium">{userData.username}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="text-violet-600 mr-3" />
                  <div>
                    <p className="text-sm text-violet-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FileText className="text-violet-600 mr-3" />
                  <div>
                    <p className="text-sm text-violet-500">Total Blogs</p>
                    <p className="font-medium">{userData.blogCount}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  className="bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-700 transition"
                  onClick={() => setShowProfileModal(true)}
                >
                  Update Profile
                </button>
                <button
                  className="bg-indigo-100 text-indigo-800 py-2 px-4 rounded hover:bg-indigo-200 transition"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Update Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4 text-violet-800">
                Update Profile
              </h2>

              <form onSubmit={handleProfileUpdate}>
                <div className="flex flex-col items-center mb-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-full bg-violet-200 border-2 border-violet-400 flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    {profilePicPreview ? (
                      <img
                        src={profilePicPreview}
                        alt="Profile preview"
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-violet-500 text-sm text-center">
                        Upload Photo
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="profile-pic"
                  />
                  <label
                    htmlFor="profile-pic"
                    className="mt-2 text-sm font-medium text-violet-800 cursor-pointer"
                  >
                    {profilePic ? profilePic.name : "Choose a profile picture"}
                  </label>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-violet-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={form.username}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-violet-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className={`${loading && "cursor-not-allowed"}px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 `}
                    onClick={() => setShowProfileModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white ${
                      loading
                        ? "bg-violet-400 hover:bg-violet-400 cursor-not-allowed "
                        : "bg-violet-600 hover:bg-violet-700"
                    }rounded `}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Update Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4 text-violet-800">
                Change Password
              </h2>

              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                  <label
                    className="block text-violet-700 text-sm mb-2"
                    htmlFor="currentPassword"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-violet-700 text-sm mb-2"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-violet-700 text-sm mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError("");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setShowCurrentPassword(false);
                      setShowNewPassword(false);
                      setShowConfirmPassword(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-violet-600 rounded hover:bg-violet-700"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;