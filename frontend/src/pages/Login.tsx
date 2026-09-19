
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  // Login form state.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Request state and user-facing error message.
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Authenticates the user and stores the returned session data
   * before redirecting to the dashboard.
   */
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "350px",
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 5px 25px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1>Financial Analytics</h1>

        <p style={{ color: "#666" }}>
          Login to continue
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "18px",
            boxSizing: "border-box",
          }}
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "6px",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

