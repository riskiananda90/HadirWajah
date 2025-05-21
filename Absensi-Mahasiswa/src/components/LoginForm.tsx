import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useUserStore, loginUser } from "../store/useStore";
import { Link } from "react-router-dom";

const loginFormSchema = z.object({
  nim: z.string().min(5, "NIM harus minimal 5 karakter"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading, setError, error, clearError, isLoading } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      nim: "",
      password: "",
    },
  });

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  async function onSubmit(data: LoginFormValues) {
    let sukses = false;
    console.log("Bentar");
    try {
      setLoading(true);
      const response = await loginUser(data.nim, data.password);
      console.log("Response dari server:", response);
      toast.success("Login berhasil!");
      sukses = true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan tidak terduga");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        if (sukses) {
          navigate("/");
        }
      }, 2000);
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
          Masuk ke Akun Anda
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Masukkan NIM dan password untuk melanjutkan
        </p>
      </div>
      <Toaster position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">NIM</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Masukkan NIM"
                      {...field}
                      className="pl-10 focus-visible:ring-violet-500 transition-all duration-300"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      {...field}
                      className="pr-10 focus-visible:ring-violet-500 transition-all duration-300"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600 dark:text-gray-300"
              >
                Ingat saya
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-violet-600 hover:text-violet-500"
              >
                Lupa password?
              </a>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 transition-all relative overflow-hidden group"
              disabled={isLoading}
            >
              <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  "Memproses..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </>
                )}
              </span>
            </Button>
          </div>

          <div className="mt-6 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                  atau
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum memiliki akun?{" "}
              <Link
                to="/register"
                className="font-medium text-violet-600 hover:text-violet-500 transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default LoginForm;
