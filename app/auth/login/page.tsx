'use client'
import { FormEvent, useState } from 'react';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // navigation
    const router = useRouter();
    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            toast.error('Please fill in all fields.', {
                style: {
                    background: "rgba(48, 46, 46, 1)",
                    color: "white",
                }
            });
            setLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.', {
                style: {
                    background: "rgba(48, 46, 46, 1)",
                    color: "white",
                }
            });
            setLoading(false);
            return;
        }
        if (password.length < 4) {
            toast.error('Password must be at least 4 characters long.', {
                style: {
                    background: "rgba(48, 46, 46, 1)",
                    color: "white",
                }
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/v1/', { email, password }, {
                withCredentials: true, headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(response);

            if (response.statusText === "OK") {
                toast.success('Login successful!', {
                    style: {
                        color: "white",
                        background: "rgba(48, 46, 46, 1)"
                    }
                });

                router.push('/blogs');

            } else {
                const errorData = await response.data;
                toast.error(errorData);
            }
        } catch (err: any) {
            setEmail("");
            setPassword("");
            console.log(err);
            toast.error(err?.response?.data?.message || 'An error occurred. Please try again.', {
                style: {
                    background: "rgba(48, 46, 46, 1)",
                    color: "white",
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center'>

            <div className="flex justify-center items-center min-h-screen w-full">
                <div><Toaster position="top-right"
                    reverseOrder={false} /></div>
                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-100 mb-6">
                        Welcome Back
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
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
                                placeholder="you@example.com"
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
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <a href="/auth/signup" className="text-indigo-400 hover:underline">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;