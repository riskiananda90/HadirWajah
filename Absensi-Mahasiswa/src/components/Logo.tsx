import React from "react";
import { motion } from "framer-motion";

const Logo: React.FC = () => {
  return (
    <motion.div
      className="relative w-16 h-16 flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        className="absolute w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-500/30"
        initial={{ rotate: -10 }}
        animate={{ rotate: -10 }}
      />
      <motion.div
        className="absolute z-10 w-12 h-12 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center text-2xl font-bold"
        initial={{ rotate: 5 }}
        animate={{ rotate: 5 }}
      >
        <motion.span
          className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          HW
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default Logo;
