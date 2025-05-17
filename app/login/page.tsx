"use client";

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { signIn, getSession } from "next-auth/react"
import { assets } from "@/app/assets/assets";

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
  })

  // Form validation errors
  const [errors, setErrors] = useState<{
    login: {
      email: string;
      password: string;
      general: string;
    };
    register: {
      email: string;
      password: string;
      confirmPassword: string;
      full_name: string;
      general: string;
    };
  }>({
    login: {
      email: "",
      password: "",
      general: "",
    },
    register: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      general: "",
    },
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })

    // Clear error when user types
    setErrors({
      ...errors,
      login: {
        ...errors.login,
        [name]: "",
        general: "",
      },
    })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData({
      ...registerData,
      [name]: value,
    })

    // Clear error when user types
    setErrors({
      ...errors,
      register: {
        ...errors.register,
        [name]: "",
        general: "",
      },
    })
  }

  const validateLoginForm = () => {
    let isValid = true
    const newErrors = { ...errors.login }

    if (!loginData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!loginData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors({
      ...errors,
      login: newErrors,
    })

    return isValid
  }

  const validateRegisterForm = () => {
    let isValid = true
    const newErrors = { ...errors.register }

    if (!registerData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!registerData.full_name) {
      newErrors.full_name = "Full name is required"
      isValid = false
    }

    if (!registerData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors({
      ...errors,
      register: newErrors,
    })

    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateLoginForm()) return;
    setIsLoading(true);

    try {
      await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: true,
        callbackUrl: "/"
      });
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          name: registerData.full_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto login after successful registration
      const result = await signIn("credentials", {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
        callbackUrl: "/"
      });

      if (result?.error) {
        setError(result.error);
        setErrors(prev => ({
          ...prev,
          register: {
            ...prev.register,
            general: result.error || ""
          }
        }));
      } else if (result?.url) {
        router.push(result.url);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error?.message || "Registration failed. Please try again.");
      setErrors(prev => ({
        ...prev,
        register: {
          ...prev.register,
          general: error?.message || "Registration failed. Please try again."
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { 
        callbackUrl,
        redirect: true
      });
    } catch (error: any) {
      console.error("Google auth error:", error);
      setError(error?.message || "Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <Image src={assets.logo} alt="QuickStay Logo" className="h-9 invert opacity-80" />
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-black">
            <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">Welcome to QuickStay</h1>
              <p className="text-lg mb-8">
                Discover the world&#39;s most extraordinary places to stay, from boutique hotels to luxury villas and more.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-none shadow-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              handleLoginChange(e)
                            }}
                          />
                        </div>
                        {errors.login.email && <p className="text-red-500 text-xs mt-1">{errors.login.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Password</Label>
                          <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              handleLoginChange(e)
                            }}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.login.password && <p className="text-red-500 text-xs mt-1">{errors.login.password}</p>}
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={() => setRememberMe(!rememberMe)}
                        />
                        <label
                          htmlFor="remember-me"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    </CardContent>
                    <div className="px-6">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                    <div className="relative my-6 px-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                      >
                        <Image
                          src="/google.svg"
                          alt="Google logo"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Sign in with Google
                      </Button>
                    </div>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-none shadow-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>Enter your information to create a QuickStay account</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      {errors.register.general && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{errors.register.general}</div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                          />
                        </div>
                        {errors.register.email && <p className="text-red-500 text-xs mt-1">{errors.register.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-full-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="register-full-name"
                            name="full_name"
                            placeholder="John Doe"
                            className="pl-10"
                            value={registerData.full_name}
                            onChange={handleRegisterChange}
                          />
                        </div>
                        {errors.register.full_name && (
                          <p className="text-red-500 text-xs mt-1">{errors.register.full_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.register.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.register.password}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="register-confirm-password"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                          />
                        </div>
                        {errors.register.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.register.confirmPassword}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </CardContent>
                    <div className="px-6">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </div>
                    <div className="relative my-6 px-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or register with</span>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                      >
                        <Image
                          src="/google.svg"
                          alt="Google logo"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Sign up with Google
                      </Button>
                    </div>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 QuickStay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
