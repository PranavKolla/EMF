import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { jwtDecode } from "jwt-decode"; // Correct import statement
import ShinyText from "../reactbits/ShinyText";
import ShapeBlur from "../reactbits/ShapeBlur"; // Assuming you have a ShapeBlur component

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ShapeBlur Background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the ShapeBlur
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          zIndex: "-1", // Ensure it stays behind the form
        }}
      >
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
      <div
        style={{
          position: "absolute",
          top: "calc(50% + 25px)", // Shift 15px down
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the form
          width: "397px",
          height: "393px",
          padding: "20px",
          backgroundColor: "transperant", // Semi-transparent white background
          borderRadius: "100px",
          
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}><ShinyText text="Event Management" speed={3} /></h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
                   
            <label
              htmlFor="username"
              style={{ display: "block", marginBottom: "20px" }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "80%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "30px",   textAlign: "center" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "15px" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "80%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              required
            />
          </div>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "5px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              background: "none",
              border: " 3 px #ddddddcf",
              padding: "10px 20px",
              cursor: "pointer",
              display: "block",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <ShinyText text="Login" speed={3} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;