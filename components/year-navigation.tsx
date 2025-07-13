'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface YearNavigationProps {
  years: number[];
  selectedYear: number | null;
  onYearSelect: (year: number | null) => void;
}

export default function YearNavigation({ years, selectedYear, onYearSelect }: YearNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToYear = (year: number) => {
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleYearSelect = (year: number) => {
    if (selectedYear === year) {
      onYearSelect(null);
    } else {
      onYearSelect(year);
      scrollToYear(year);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Calendar className="w-5 h-5" />
        <span className="font-medium">
          {selectedYear ? `Year ${selectedYear}` : 'All Years'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-20 min-w-[200px]"
          >
            <motion.button
              onClick={() => handleYearSelect(null as any)}
              className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors ${
                selectedYear === null ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
              }`}
              whileHover={{ backgroundColor: '#f3e8ff' }}
            >
              All Years
            </motion.button>
            
            {years.map((year) => (
              <motion.button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors ${
                  selectedYear === year ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'
                }`}
                whileHover={{ backgroundColor: '#f3e8ff' }}
              >
                {year}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick year navigation buttons for larger screens */}
      <div className="hidden md:flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-600 mr-2">Quick jump:</span>
        {years.map((year) => (
          <motion.button
            key={year}
            onClick={() => {
              onYearSelect(year);
              scrollToYear(year);
            }}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
              selectedYear === year
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white/70 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {year}
          </motion.button>
        ))}
      </div>
    </div>
  );
}