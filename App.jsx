import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/navbar";
import Home from "./components/home";
import AuthPage from "./components/AuthPage";
import { setAuthToken } from "./api";

export default function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user + token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setAuthToken(token);
      setUser(JSON.parse(userData));
    }
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {/* ✅ The new AuthPage sends user info back on successful login */}
              <AuthPage onAuthSuccess={setUser} />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Home user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
