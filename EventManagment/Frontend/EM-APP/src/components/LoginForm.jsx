import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { jwtDecode } from "jwt-decode"; // Correct import statement
import ShinyText from "../reactbits/ShinyText";
import ShapeBlur from "../reactbits/ShapeBlur"; // Assuming you have a ShapeBlur component
import SignUpForm from "./SignUpForm";
import "./css/LoginForm.css"; // Import your CSS file

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false); // Define the showSignUp state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:9090/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      const token = data.token;

      // Decode the JWT token to extract the role
      const decodedToken = jwtDecode(token); // Correct usage
      const userRole = decodedToken.role;

      // Store the token in localStorage
      localStorage.setItem("jwtToken", token);

      // Redirect based on role
      if (userRole === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (userRole === "ORGANIZER") {
        navigate("/organizer-dashboard");
      } else if (userRole === "ATTENDEE") {
        navigate("/home"); // Redirect to Home.jsx
      } else {
        throw new Error("Invalid role");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (showSignUp) {
    return <SignUpForm onCancel={() => setShowSignUp(false)} />; // Render SignUpForm if toggled
  }

  return (
    <div className="login-container">
      {/* ShapeBlur Background */}
      <div className="login-background">
        <ShapeBlur
          variation={0}
          pixelRatioProp={window.devicePixelRatio || 2}
          shapeSize={1.21}
          roundness={0.5}
          borderSize={0.005}
          circleSize={0.005}
          circleEdge={0.2}
        />
      </div>

      {/* Login Form */}
      <div className="login-form">
        <h2 className="login-title">
          <ShinyText text="Event Management" speed={3} />
        </h2>
        <form onSubmit={handleLogin}>
          <div className="login-input-container">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="login-input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button
            type="button"
            onClick={() => setShowSignUp(true)} // Toggle SignUpForm
            className="new-user-button"
          >
            New User?
          </button>
          <button type="submit" className="login-button">
            <ShinyText text="Login" speed={3} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;