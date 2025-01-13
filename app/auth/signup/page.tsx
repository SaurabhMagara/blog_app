'use client'

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !name) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (name.length < 3 || name.trim() === "") {
      setError('Name must be at least 3 characters long');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/v1/auth/signup", { email, name, password }, {
        withCredentials: true, headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(response);

      if (response.statusText === "OK") {
        toast.success('Register successful!',{style:{
          color : "white",
          background : "rgba(48, 46, 46, 1)"
        }});
      } else {
        const errorData = await response.data;
        setError(errorData.message || 'Login failed.');
      }

    } catch (err: any) {
      setEmail("");
      setPassword("");
      setName("");
      console.log(err);
      toast.error(err.response.data.message || 'An error occurred. Please try again.', {style :{
        background : "rgba(48, 46, 46, 1)",
        color : "white",
      }});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div><Toaster position="top-right"
        reverseOrder={false} /></div>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Joe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="xyz@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-lg font-medium transition-all ${loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400'
              }`}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
