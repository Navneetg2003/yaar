import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Login page - handles email/password auth + anonymous sessions
 */
export function Login() {
  const navigate = useNavigate();
  const { login, register, loginAnonymous, loading, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setLocalError("Passwords don't match.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/chat");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleAnonymous = async () => {
    try {
      await loginAnonymous();
      navigate("/chat");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">💙</div>
          <h1 className="text-3xl font-bold text-gray-900">Yaar</h1>
          <p className="text-gray-600 mt-2">Your supportive AI friend</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Error Message */}
          {(localError || error) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
              {localError || error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Log In"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setLocalError("");
              }}
              className="text-blue-500 font-medium hover:underline"
            >
              {isRegister ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Anonymous Button */}
        <button
          type="button"
          onClick={handleAnonymous}
          disabled={loading}
          className="w-full bg-purple-100 text-purple-700 font-bold py-2 rounded-lg hover:bg-purple-200 disabled:bg-gray-100 disabled:text-gray-400 transition"
        >
          Continue as Guest
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Try without creating an account. Your data won't be saved.
        </p>
      </div>
    </div>
  );
}

export default Login;
