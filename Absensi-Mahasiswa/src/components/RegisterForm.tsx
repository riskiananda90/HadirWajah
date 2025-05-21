import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Mail, User, Key, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { Link } from "react-router-dom";
import { useUserStore, registerUser } from "../store/useStore";

// Define form schema
const registerFormSchema = z
  .object({
    nim: z.string().min(5, "NIM harus minimal 5 karakter"),
    email: z.string().email("Format email tidak valid"),
    nama: z.string().min(3, "Nama harus minimal 3 karakter"),
    password: z.string().min(6, "Password harus minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password harus minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading, setError, error, clearError, isLoading } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectFile, setSelectFIle] = useState<File | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      nim: "",
      email: "",
      nama: "",
      password: "",
      confirmPassword: "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectFIle(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: RegisterFormValues) {
    let sukses = false;
    try {
      setLoading(true);
      console.log(data);
      const response = await registerUser(
        data.nim,
        data.email,
        data.nama,
        data.password,
        selectFile || undefined
      );
      console.log("Response dari server:", response);
      toast.success(response.message || "Pendaftaran berhasil!");
      sukses = true;
    } catch (error) {
      console.error("Terjadi error saat pendaftaran:", error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Terjadi kesalahan tidak terduga");
        toast.error("Terjadi kesalahan tidak terduga");
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        if (sukses) {
          navigate("/login");
        }
      }, 2000);
    }
  }

  const togglePasswordVisibility = (field: "password" | "confirm") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700 w-full max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile upload section */}
        <motion.div
          variants={itemVariants}
          className="md:w-1/3 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700"
        >
          <div className="relative h-32 w-32 md:h-40 md:w-40 mb-6">
            <div className="h-full w-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer hover:bg-violet-700 transition-colors"
            >
              <Upload className="h-5 w-5 text-white" />
              <input
                id="profile-upload"
                type="file"
                name="foto_profil"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <h3 className="text-lg font-medium mb-2 text-center">
            Upload Foto Profil
          </h3>
          <p className="text-xs text-gray-500 text-center mb-4">
            Tambahkan foto untuk membuat profil Anda lebih personal
          </p>

          <motion.div className="w-full mt-auto" variants={itemVariants}>
            <Link
              to="/"
              className="w-full block text-center text-violet-600 hover:text-violet-500 text-sm font-medium transition-colors"
            >
              Sudah memiliki akun? Masuk
            </Link>
          </motion.div>
        </motion.div>

        {/* Form section */}
        <div className="md:w-2/3">
          <motion.div className="mb-6" variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              Daftar Akun Baru
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Lengkapi informasi berikut untuk mendaftar
            </p>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          NIM
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="Masukkan email"
                              {...field}
                              className="pl-10 focus-visible:ring-violet-500 transition-all duration-300"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Nama Lengkap
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Masukkan nama lengkap"
                              {...field}
                              className="pl-10 focus-visible:ring-violet-500 transition-all duration-300"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                                onClick={() =>
                                  togglePasswordVisibility("password")
                                }
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
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Konfirmasi Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                                onClick={() =>
                                  togglePasswordVisibility("confirm")
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Konfirmasi password"
                                {...field}
                                className="pr-10 focus-visible:ring-violet-500 transition-all duration-300"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
              </div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 transition-all relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      "Mendaftarkan..."
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Daftar
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
