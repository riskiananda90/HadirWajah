import React from "react";
import RegisterForm from "../components/RegisterForm";
import Logo from "../components/Logo";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-violet-950">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <Toaster position="top-right" />
      <motion.div
        className="w-full max-w-5xl mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <Link to="/">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Logo />
            </motion.div>
          </Link>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            HadirWajah
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Sistem Absensi dengan Pengenalan Wajah
          </motion.p>
        </div>
        <RegisterForm />
      </motion.div>

      <motion.div
        className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        &copy; {new Date().getFullYear()} HadirWajah. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Register;
