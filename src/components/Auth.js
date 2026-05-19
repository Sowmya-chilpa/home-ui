import { useState } from "react";
import "./Auth.css";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-logo">
            <h2>WanderNest</h2>
            <p>Explore More. Experience Life.</p>
          </div>
          <div className="auth-tabs">
            <button
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
          </div>
          <div className="auth-content">
            <h1>
              {activeTab === "login"
                ? "Welcome Back"
                : "Begin Your Adventure"}
            </h1>
            <p className="auth-subtitle">
              {activeTab === "login"
                ? "Login to continue your travel journey."
                : "Create your account and explore the world."}
            </p>
            <form className="auth-form">
              {activeTab === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
              />
              <input
                type="password"
                placeholder="Password"
              />
              {activeTab === "signup" && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                />
              )}
              <div className="auth-options">
                {activeTab === "login" && (
                  <span className="forgot">
                    Forgot Password?
                  </span>
                )}
              </div>
              <button className="auth-btn">
                {activeTab === "login"
                  ? "Login"
                  : "Let's Start"}
              </button>
            </form>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-overlay"></div>
          <div className="travel-card">
            <h3>Travel The World, Your Way!</h3>
            <p>
              Explore destinations and plan unforgettable journeys
              with personalized experiences.
            </p>
          </div>
          <div className="travel-text">
            <h1>
              Explore the World,
              Beyond Boundaries!
            </h1>
            <p>
              Start your adventure today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;