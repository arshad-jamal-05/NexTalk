import { useContext, useState } from "react";
// import AuthBackground from "./AuthBackground";
import { AuthContext } from "../contexts/AuthContext";

export default function AuthCard() {
  const { handleRegister, handleLogin } = useContext(AuthContext);

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [agree, setAgree] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "" });

  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      if (isSignup) {
        if (!agree) return;
        const result = await handleRegister(name, username, password);
        setSnack({ open: true, message: result || "Registered successfully" });
        setMode("login");
        setPassword("");
      } else {
        const result = await handleLogin(username, password);
        setSnack({ open: true, message: result || "Logged in successfully" });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative mt-6 w-[92vw] max-w-[420px]">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-8 relative left-[74px] mx-auto"
        />
        <div className="relative bg-white rounded-xl p-6 shadow-sm">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 h-10 rounded-lg border text-sm ${
                !isSignup
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
              aria-pressed={!isSignup}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 h-10 rounded-lg border text-sm ${
                isSignup
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
              aria-pressed={isSignup}
            >
              Register
            </button>
          </div>

          <h2 className="text-center text-xl font-semibold mb-6">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <input
                name="name"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg text-center bg-gray-100 border-2 border-gray-100 focus:border-gray-300 outline-none"
              />
            )}

            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 w-full rounded-lg text-center bg-gray-100 border-2 border-gray-100 focus:border-gray-300 outline-none"
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg text-center bg-gray-100 border-2 border-gray-100 focus:border-gray-300 outline-none"
            />

            {isSignup && (
              <label className="flex items-center gap-2 text-sm select-none">
                <input
                  id="checkbox"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
                <span>I agree to the terms and privacy policy</span>
              </label>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={
                submitting ||
                (isSignup && (!agree || !name || !username || !password))
              }
              className="h-10 w-full rounded-lg bg-black text-white text-base hover:opacity-90 disabled:opacity-60"
            >
              {submitting
                ? isSignup
                  ? "Registering..."
                  : "Logging in..."
                : isSignup
                  ? "Register"
                  : "Login"}
            </button>
          </form>

          {!isSignup ? (
            <div className="mt-3">
              <p className="text-center text-sm text-gray-500">
                By continuing you agree to our terms and privacy policy
              </p>
              <p className="text-center text-base mt-3 hover:underline cursor-pointer">
                Forgot password?
              </p>
              <p className="mt-4 text-center">
                New here?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-blue-600 hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>
          ) : (
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>

        {/* Simple Tailwind Snackbar substitute */}
        {snack.open && (
          <div
            role="status"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow"
            onAnimationEnd={() => {}}
          >
            {snack.message}
            <button
              onClick={() => setSnack((s) => ({ ...s, open: false }))}
              className="ml-3 underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
