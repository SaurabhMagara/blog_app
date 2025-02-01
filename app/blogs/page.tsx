import React from 'react';

const Blogs = () => {
    // Sample blog data - in a real app, this would come from an API or props
    const blogs = [
        {
            id: 1,
            title: "Getting Started with React",
            content: "React is a popular JavaScript library for building user interfaces. In this guide, we'll explore the fundamental concepts and best practices...",
            imageUrl: "https://media.theeverygirl.com/wp-content/uploads/2021/01/I-Spent-a-Week-Doing-My-Beauty-Routine-Like-a-Celebrity-The-Everygirl-1.jpg",
        },
        {
            id: 2,
            title: "The Future of AI",
            content: "Artificial Intelligence is reshaping our world in unprecedented ways. From machine learning to neural networks, discover how AI is evolving...",
            imageUrl: "https://c4.wallpaperflare.com/wallpaper/662/242/353/katherine-langford-celebrities-girls-actress-wallpaper-preview.jpg",
        },
        {
            id: 4,
            title: "The Future of AI",
            content: "Artificial Intelligence is reshaping our world in unprecedented ways. From machine learning to neural networks, discover how AI is evolving...",
            imageUrl: "https://c4.wallpaperflare.com/wallpaper/662/242/353/katherine-langford-celebrities-girls-actress-wallpaper-preview.jpg",
        },
        {
            id: 3,
            title: "Modern Web Development",
            content: "Explore the latest trends and technologies in web development. From responsive design to progressive web apps, learn what's shaping the future...",
            imageUrl: "https://i.redd.it/aishwarya-rai-in-devdas-2002-v0-wvrcpalip0sb1.jpg?width=678&format=pjpg&auto=webp&s=48256650ae4fae4f266eb6f10b296b4db8c48cff",
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-200 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl text-violet-800 font-bold mb-4 pb-4 border-b-2 border-violet-500">Latest Blogs</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-gradient-to-l from-violet-50 to-violet-200 rounded-lg overflow-hidden shadow-violet-200 shadow-lg cursor-pointer group"
                        >
                            <div className="w-full h-48 overflow-hidden ">
                                <img
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                                />
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl text-violet-700 font-semibold mb-4">
                                    {blog.title}
                                </h2>
                                <p className=" mb-4 line-clamp-3">
                                    {blog.content}
                                </p>

                                <button
                                    className="w-full bg-violet-500 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    See More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blogs;