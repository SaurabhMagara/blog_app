'use client';

import { FormEvent, useState } from 'react';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !name) {
      toast.error('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (name.length < 3 || name.trim() === "") {
      toast.error('Name must be at least 3 characters long.');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      toast.error('Password must be at least 4 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/v1/auth/signup", { email, name, password }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      if (response.statusText === "OK") {
        toast.success('Register successful!');
        router.push('/login');
      } else {
        toast.error(response.data);
      }
    } catch (err: any) {
      setEmail("");
      setPassword("");
      setName("");
      toast.error(err?.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Floating Bubbles Component
  interface FloatingBubbleProps {
    position: { top?: string; bottom?: string; left?: string; right?: string };
    size: string;
    animationDuration: number;
    delay: number;
  }

  const FloatingBubble: React.FC<FloatingBubbleProps> = ({ position, size, animationDuration, delay }) => (
    <div className="absolute" style={{ ...position, width: size, height: size }}>
      <motion.div
        className="rounded-full bg-violet-900 w-full h-full"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: animationDuration, delay, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gradient-to-br from-violet-400 via-violet-500 to-violet-200"
    >
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-violet-100 rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-violet-900 mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-violet-800">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-violet-200 border border-violet-400 rounded-md text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-violet-800">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full px-4 py-2 bg-violet-200 border border-violet-400 rounded-md text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-violet-800">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full px-4 py-2 bg-violet-200 border border-violet-400 rounded-md text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
              </button>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`w-full py-2 px-4 text-white rounded-lg font-medium transition-all ${loading ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-500 hover:bg-violet-600 focus:ring-4 focus:ring-violet-300'}`}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </motion.button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-violet-700">
            Already have an account?{' '}
            <a href="/auth/login" className="text-violet-500 hover:underline">Login</a>
          </p>
        </div>
      </motion.div>
      {/* Floating Bubbles */}
      <FloatingBubble position={{ top: "20%", left: "20%" }} size="5rem" animationDuration={4} delay={0} />
      <FloatingBubble position={{ bottom: "20%", right: "20%" }} size="4rem" animationDuration={3} delay={1} />
    </div>
  );
};

export default SignupPage;