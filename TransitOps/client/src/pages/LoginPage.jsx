import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";
import "../App.css";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("transitops_token");

    if (!token) {
      return;
    }

    const verifySession = async () => {
      try {
        const response = await api.get("/v1/auth/me");
        setSession(response.data.data.user);
        setMessage("Session restored successfully.");
        setMessageType("success");
      } catch {
        localStorage.removeItem("transitops_token");
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/v1/auth/login", formData);
      const { token, user } = response.data.data;

      localStorage.setItem("transitops_token", token);
      setSession(user);
      setMessage(`Welcome back, ${user.fullName || user.email}.`);
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again.",
      );
      setMessageType("error");
      localStorage.removeItem("transitops_token");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-copy">
          <p className="eyebrow">TransitOps</p>
          <h1>Smart transport operations, ready for login.</h1>
          <p className="lead">
            Use the Supabase-backed credentials to enter the fleet dashboard.
            This front end talks only to the Express API.
          </p>

          <div className="feature-list">
            <div>
              <strong>Secure</strong>
              <span>JWT session handled by the server</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span>One-step login and session restore</span>
            </div>
            <div>
              <strong>Aligned</strong>
              <span>Matches your friend’s Supabase schema</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <p className="card-kicker">Fleet access</p>
            <h2>{session ? "Signed in" : "Login to continue"}</h2>
            <p>
              {session
                ? "Your session is active and ready for protected routes."
                : "Enter your email and password to open the operations panel."}
            </p>
          </div>

          {message ? (
            <div className={`feedback feedback--${messageType}`}>{message}</div>
          ) : null}

          {session ? (
            <div className="session-panel">
              <div>
                <span>User</span>
                <strong>{session.fullName || session.email}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{session.roleName || "N/A"}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{session.email}</strong>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Continue to dashboard
              </button>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="fleet.manager@company.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your secure password"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
