'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-12"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <div className="mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
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
              src="/muffin.jpeg"
              alt="Muffin"
              className="h-80 object-cover border-4 border-white shadow-lg"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-2xl text-purple-100 font-light italic mb-6"
          >
            A diary of a girl dad raising two wonderful daughters
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-2 text-purple-200"
          >
            
            <span className="text-sm">Capturing moments, creating memories</span>
            
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}