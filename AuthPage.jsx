import React, { useState } from "react";
import API, { setAuthToken } from "../api";
import "./auth.css";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(""); setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post("/login", { email: form.email, password: form.password });
        // backend returns access_token
        const token = res.data.access_token || res.data.token || res.data.data?.token;
        const user = res.data.user;
        if (!token) throw new Error("No token returned from server");
        localStorage.setItem("token", token);
        setAuthToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        onAuthSuccess(user);
      } else {
        await API.post("/register", { name: form.name, email: form.email, password: form.password });
        alert("Account created — please log in");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Sign in" : "Create account"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && <input name="name" placeholder="Name" onChange={handleChange} value={form.name} />}
          <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? "Please wait..." : (isLogin ? "Sign in" : "Create account")}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Register" : "Login"}</button>
        </p>
      </div>
    </div>
  );
}
