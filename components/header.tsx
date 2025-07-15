'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-8 sm:py-12"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Muffin and Bug
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <img
              src="/header2.jpg"
              alt="The-Fam"
              className="h-48 sm:h-64 md:h-80 w-auto object-cover border-2 sm:border-4 border-white shadow-lg rounded-lg sm:rounded-xl"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-purple-100 font-light italic mb-4 sm:mb-6 px-4"
          >
            A diary of a girl dad raising two wonderful daughters with a wonderful&nbsp;wife
          </motion.p>
          
        </motion.div>
      </div>
    </motion.header>
  );
}