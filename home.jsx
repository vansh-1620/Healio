import React, { useState, useEffect } from "react";
import SymptomForm from "./SymptomForm";
import Results from "./results";
import ChatWidget from "./chatwidget";
import API, { setAuthToken } from "../api";
import "./home.css";

export default function Home({ user }) {
  const [analysis, setAnalysis] = useState(null);

  // ensure token restored on refresh
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setAuthToken(t);
  }, []);

  return (
    <>
      <div className="page-grid">
        <main className="main-col">
          <div className="panel">
            <h2>Tell us your symptoms</h2>
            <SymptomForm onResults={setAnalysis} />
          </div>

          {analysis && (
            <div className="panel">
              <h3>Results</h3>
              <Results data={analysis} />
            </div>
          )}
        </main>

        <aside className="side-col">
          <div className="panel">
            <h3>Quick Chat</h3>
            <p>Use the floating assistant in bottom-right to ask follow-ups.</p>
          </div>
        </aside>
      </div>

      {/* Floating chat widget always present */}
      <ChatWidget />
    </>
  );
}
