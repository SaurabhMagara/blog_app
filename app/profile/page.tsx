"use client";

import React, { FormEvent, useState } from "react";
import {
  User,
  KeyRound,
  Mail,
  ArrowLeft,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";

const ProfilePage = () => {
  // Mock user data - in a real app, this would come from an API/context
  const [userData, setUserData] = useState({
    username: "johndoe",
    email: "john.doe@example.com",
    blogCount: 12,
  });

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [usernameForm, setUsernameForm] = useState({
    username: userData.username,
    email: userData.email,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form errors
  const [passwordError, setPasswordError] = useState("");

  const handleProfileUpdate = (e: FormEvent) => {
    e.preventDefault();
    setUserData({
      ...userData,
      username: usernameForm.username,
      email: usernameForm.email,
    });
    setShowProfileModal(false);
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

  return (<></>
    // <div className="min-h-screen bg-gradient-to-br from-violet-200 to-indigo-100">
    //   <div className="max-w-2xl mx-auto pt-10 pb-16 px-4">
    //     {/* Back Button */}
    //     <button
    //       className="flex items-center text-violet-400 mb-6 hover:text-violet-600"
    //       onClick={() => console.log("Back button clicked")}
    //     >
    //       <ArrowLeft className="mr-2" size={18} />
    //       Back
    //     </button>

    //     {/* Profile Card */}
    //     <div className="bg-white rounded-lg shadow-lg p-6">
    //       <h1 className="text-2xl font-bold text-violet-800 mb-6">
    //         My Profile
    //       </h1>

    //       <div className="space-y-6">
    //         {/* User Info */}
    //         <div className="flex flex-col space-y-4">
    //           <div className="flex items-center">
    //             <User className="text-violet-600 mr-3" />
    //             <div>
    //               <p className="text-sm text-violet-500">Username</p>
    //               <p className="font-medium">{userData.username}</p>
    //             </div>
    //           </div>

    //           <div className="flex items-center">
    //             <Mail className="text-violet-600 mr-3" />
    //             <div>
    //               <p className="text-sm text-violet-500">Email</p>
    //               <p className="font-medium">{userData.email}</p>
    //             </div>
    //           </div>

    //           <div className="flex items-center">
    //             <FileText className="text-violet-600 mr-3" />
    //             <div>
    //               <p className="text-sm text-violet-500">Total Blogs</p>
    //               <p className="font-medium">{userData.blogCount}</p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Action Buttons */}
    //         <div className="flex flex-col sm:flex-row gap-3 pt-4">
    //           <button
    //             className="bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-700 transition"
    //             onClick={() => setShowProfileModal(true)}
    //           >
    //             Update Profile
    //           </button>
    //           <button
    //             className="bg-indigo-100 text-indigo-800 py-2 px-4 rounded hover:bg-indigo-200 transition"
    //             onClick={() => setShowPasswordModal(true)}
    //           >
    //             Change Password
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Profile Update Modal */}
    //     {showProfileModal && (
    //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    //         <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
    //           <h2 className="text-xl font-bold mb-4 text-violet-800">
    //             Update Profile
    //           </h2>

    //           <form onSubmit={handleProfileUpdate}>
    //             <div className="mb-4">
    //               <label
    //                 className="block text-violet-700 text-sm font-bold mb-2"
    //                 htmlFor="username"
    //               >
    //                 Username
    //               </label>
    //               <input
    //                 id="username"
    //                 type="text"
    //                 className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
    //                 value={usernameForm.username}
    //                 onChange={(e) =>
    //                   setUsernameForm({
    //                     ...usernameForm,
    //                     username: e.target.value,
    //                   })
    //                 }
    //                 required
    //               />
    //             </div>

    //             <div className="mb-6">
    //               <label
    //                 className="block text-violet-700 text-sm font-bold mb-2"
    //                 htmlFor="email"
    //               >
    //                 Email
    //               </label>
    //               <input
    //                 id="email"
    //                 type="email"
    //                 className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
    //                 value={usernameForm.email}
    //                 onChange={(e) =>
    //                   setUsernameForm({
    //                     ...usernameForm,
    //                     email: e.target.value,
    //                   })
    //                 }
    //                 required
    //               />
    //             </div>

    //             <div className="flex justify-end space-x-3">
    //               <button
    //                 type="button"
    //                 className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
    //                 onClick={() => setShowProfileModal(false)}
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 type="submit"
    //                 className="px-4 py-2 text-white bg-violet-600 rounded hover:bg-violet-700"
    //               >
    //                 Save Changes
    //               </button>
    //             </div>
    //           </form>
    //         </div>
    //       </div>
    //     )}

    //     {/* Password Update Modal */}
    //     {showPasswordModal && (
    //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    //         <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
    //           <h2 className="text-xl font-bold mb-4 text-violet-800">
    //             Change Password
    //           </h2>

    //           <form onSubmit={handlePasswordUpdate}>
    //             <div className="mb-4">
    //               <label
    //                 className="block text-violet-700 text-sm font-bold mb-2"
    //                 htmlFor="currentPassword"
    //               >
    //                 Current Password
    //               </label>
    //               <div className="relative">
    //                 <input
    //                   id="currentPassword"
    //                   type={showCurrentPassword ? "text" : "password"}
    //                   className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
    //                   value={passwordForm.currentPassword}
    //                   onChange={(e) =>
    //                     setPasswordForm({
    //                       ...passwordForm,
    //                       currentPassword: e.target.value,
    //                     })
    //                   }
    //                   required
    //                 />
    //                 <button
    //                   type="button"
    //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600"
    //                   onClick={() =>
    //                     setShowCurrentPassword(!showCurrentPassword)
    //                   }
    //                 >
    //                   {showCurrentPassword ? (
    //                     <EyeOff size={18} />
    //                   ) : (
    //                     <Eye size={18} />
    //                   )}
    //                 </button>
    //               </div>
    //             </div>

    //             <div className="mb-4">
    //               <label
    //                 className="block text-violet-700 text-sm font-bold mb-2"
    //                 htmlFor="newPassword"
    //               >
    //                 New Password
    //               </label>
    //               <div className="relative">
    //                 <input
    //                   id="newPassword"
    //                   type={showNewPassword ? "text" : "password"}
    //                   className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
    //                   value={passwordForm.newPassword}
    //                   onChange={(e) =>
    //                     setPasswordForm({
    //                       ...passwordForm,
    //                       newPassword: e.target.value,
    //                     })
    //                   }
    //                   required
    //                 />
    //                 <button
    //                   type="button"
    //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600"
    //                   onClick={() => setShowNewPassword(!showNewPassword)}
    //                 >
    //                   {showNewPassword ? (
    //                     <EyeOff size={18} />
    //                   ) : (
    //                     <Eye size={18} />
    //                   )}
    //                 </button>
    //               </div>
    //             </div>

    //             <div className="mb-4">
    //               <label
    //                 className="block text-violet-700 text-sm font-bold mb-2"
    //                 htmlFor="confirmPassword"
    //               >
    //                 Confirm New Password
    //               </label>
    //               <div className="relative">
    //                 <input
    //                   id="confirmPassword"
    //                   type={showConfirmPassword ? "text" : "password"}
    //                   className="w-full px-3 py-2 border border-violet-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
    //                   value={passwordForm.confirmPassword}
    //                   onChange={(e) =>
    //                     setPasswordForm({
    //                       ...passwordForm,
    //                       confirmPassword: e.target.value,
    //                     })
    //                   }
    //                   required
    //                 />
    //                 <button
    //                   type="button"
    //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600"
    //                   onClick={() =>
    //                     setShowConfirmPassword(!showConfirmPassword)
    //                   }
    //                 >
    //                   {showConfirmPassword ? (
    //                     <EyeOff size={18} />
    //                   ) : (
    //                     <Eye size={18} />
    //                   )}
    //                 </button>
    //               </div>
    //             </div>

    //             {passwordError && (
    //               <p className="text-red-500 text-sm mb-4">{passwordError}</p>
    //             )}

    //             <div className="flex justify-end space-x-3">
    //               <button
    //                 type="button"
    //                 className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
    //                 onClick={() => {
    //                   setShowPasswordModal(false);
    //                   setPasswordError("");
    //                   setPasswordForm({
    //                     currentPassword: "",
    //                     newPassword: "",
    //                     confirmPassword: "",
    //                   });
    //                   setShowCurrentPassword(false);
    //                   setShowNewPassword(false);
    //                   setShowConfirmPassword(false);
    //                 }}
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 type="submit"
    //                 className="px-4 py-2 text-white bg-violet-600 rounded hover:bg-violet-700"
    //               >
    //                 Update Password
    //               </button>
    //             </div>
    //           </form>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default ProfilePage;