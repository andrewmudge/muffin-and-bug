'use client';

import { motion } from 'framer-motion';
import { Heart, LogIn, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-8 sm:py-12 relative"
    >
      <div className="container mx-auto px-4 text-center">
        {/* Admin Controls - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          {isAdmin ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn()}
              className="flex items-center gap-1 sm:gap-2 bg-white hover:bg-gray-100 text-purple-700 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-md"
            >
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Admin</span>
            </motion.button>
          )}
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 pt-8 sm:pt-0"
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