"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

// Define animation variants
const containerVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const titleVariants: Variants = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 } }
};

const descriptionVariants: Variants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.8 } }
};

const lineVariants: Variants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { delay: 0.8, duration: 0.8 } }
};

const buttonVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 1, duration: 0.8 } },
  hover: { scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" },
  tap: { scale: 0.95 }
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
      className="rounded-full bg-white/10 w-full h-full"
      animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: animationDuration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const BlogEntrance: React.FC = () => {
  const handleEnterClick = () => console.log("Enter button clicked");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-400 via-violet-300 to-violet-200 p-6 relative overflow-hidden">
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="text-center max-w-3xl relative z-10">

        {/* Title */}
        <motion.div variants={titleVariants}>
          <motion.h1 className="text-6xl md:text-7xl font-bold text-white mb-6" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            TechBlog
          </motion.h1>
        </motion.div>

        {/* Description */}
        <motion.div variants={descriptionVariants}>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Exploring the intersection of technology, innovation, and human creativity. Join us on a journey through the digital frontier.
          </p>
        </motion.div>

        {/* Animated Line */}
        <div className="relative">
          <motion.div variants={lineVariants} className="h-px bg-white/30 w-full absolute top-0" />
        </div>

        {/* Enter Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleEnterClick}
          className="mt-12 px-8 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-full text-lg font-semibold hover:bg-white/30 transition-colors duration-300"
        >
          Enter Blog
        </motion.button>
      </motion.div>

      {/* Floating Bubbles */}
      <FloatingBubble position={{ top: "20%", left: "20%" }} size="5rem" animationDuration={4} delay={0} />
      <FloatingBubble position={{ bottom: "20%", right: "20%" }} size="4rem" animationDuration={3} delay={1} />
    </div>
  );
};

export default BlogEntrance;
