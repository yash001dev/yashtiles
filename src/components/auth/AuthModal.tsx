import React, { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { GoogleLogin } from "@react-oauth/google";
import { z } from "zod";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

type AuthMode = "login" | "register" | "forgot-password" | "reset-password";

// Validation schemas
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const {
    login,
    register,
    forgotPassword,
    resetPassword,
    googleLogin,
    error,
    clearError,
  } = useAuth();
  const { addNotification } = useNotifications();

  // Form data states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    resetToken: "",
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      resetToken: "",
    });
    setMessage("");
    clearError();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (data: any, schema: z.ZodSchema) => {
    try {
      schema.parse(data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    clearError();
    setFormErrors({});

    try {
      switch (mode) {
        case "login": {
          const loginData = {
            email: formData.email,
            password: formData.password,
          };
          if (!validateForm(loginData, loginSchema)) {
            setIsLoading(false);
            return;
          }
          await login(loginData.email, loginData.password);
          addNotification({
            type: "success",
            title: "Welcome back!",
            message: "You have successfully signed in.",
          });
          handleClose();
          break;
        }

        case "register": {
          if (!validateForm(formData, registerSchema)) {
            setIsLoading(false);
            return;
          }
          await register(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password
          );
          addNotification({
            type: "success",
            title: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME} !`,
            message: "Your account has been created successfully.",
          });
          handleClose();
          break;
        }

        case "forgot-password":
          await forgotPassword(formData.email);
          addNotification({
            type: "success",
            title: "Reset link sent",
            message: "If the email exists, a reset link has been sent",
          });
          setMessage("If the email exists, a reset link has been sent");
          break;

        case "reset-password":
          await resetPassword(
            formData.email,
            formData.resetToken,
            formData.password
          );
          addNotification({
            type: "success",
            title: "Password reset successful",
            message: "Your password has been reset successfully",
          });
          setMessage("Password has been reset successfully");
          setMode("login");
          break;
      }
    } catch (err) {
      // Error is handled by the context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setIsLoading(true);
    setMessage("");
    clearError();

    try {
      await googleLogin(credentialResponse.credential);
      addNotification({
        type: "success",
        title: "Welcome back!",
        message: "You have successfully signed in with Google.",
      });
      handleClose();
    } catch (err) {
      // Error is handled by the context
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                formErrors.email ? "text-red-500" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 ml-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                formErrors.password ? "text-red-500" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 ml-1 text-sm text-red-600">
              {formErrors.password}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            addNotification({
              type: "error",
              title: "Google login failed",
              message: "An error occurred during Google login",
            });
          }}
          theme="outline"
          size="large"
        />
      </div>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setMode("forgot-password")}
          className="text-pink-500 hover:text-pink-600 text-sm"
        >
          Forgot your password?
        </button>
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("register")}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <User
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  formErrors.firstName ? "text-red-500" : "text-gray-400"
                }`}
                size={20}
              />
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
              />
            </div>
            {formErrors.firstName && (
              <p className="mt-1 ml-1 text-sm text-red-600">
                {formErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <User
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  formErrors.lastName ? "text-red-500" : "text-gray-400"
                }`}
                size={20}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
              />
            </div>
            {formErrors.lastName && (
              <p className="mt-1 ml-1 text-sm text-red-600">
                {formErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                formErrors.email ? "text-red-500" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 ml-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                formErrors.password ? "text-red-500" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 ml-1 text-sm text-red-600">
              {formErrors.password}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                formErrors.confirmPassword ? "text-red-500" : "text-gray-400"
              }`}
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border ${
                formErrors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200`}
            />
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 ml-1 text-sm text-red-600">
              {formErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("login")}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <div className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode("login")}
          className="text-pink-500 hover:text-pink-600 text-sm"
        >
          Back to sign in
        </button>
      </div>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none bg-white transition-all duration-200"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            name="resetToken"
            placeholder="Reset token"
            value={formData.resetToken}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3 rounded-lg transition-colors duration-200"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </>
  );

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Forgot Password";
      case "reset-password":
        return "Reset Password";
      default:
        return "Authentication";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Sign in to your account";
      case "register":
        return `Join ${process.env.NEXT_PUBLIC_APP_NAME} today`;
      case "forgot-password":
        return "Reset your password";
      case "reset-password":
        return "Enter your new password";
      default:
        return "";
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return renderLoginForm();
      case "register":
        return renderRegisterForm();
      case "forgot-password":
        return renderForgotPasswordForm();
      case "reset-password":
        return renderResetPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
              <p className="text-gray-600 text-sm mt-1">{getSubtitle()}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Display success message */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
