# Blog App

This is a full-featured blog application built using Next.js, incorporating animations with Framer Motion. The app supports user authentication, blog creation, likes, and comments, with image storage handled via Cloudinary.

## Features

- **Framer Motion Animations**: Smooth animations in the Hero page.
- **Authentication**:
  - Signup with profile image upload (stored in Cloudinary).
  - Login and Logout functionality.
  - Redirection to the login page after successful authentication.
- **Blogs**:
  - Blog cards are displayed on the blogs page.
  - Clicking on a blog card opens the full blog page.
  - Full blog page includes blog image, title, content, likes, and comments.
  - Users can like/unlike blogs.
  - Users can add comments to blogs.

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Styling**: Tailwind CSS, Material-UI
- **Animations**: Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Type Safety**: TypeScript
