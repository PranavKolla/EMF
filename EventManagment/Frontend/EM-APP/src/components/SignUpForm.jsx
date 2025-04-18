import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./css/LoginForm.css"; // Make sure this CSS file contains the styles for the new structure

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpContactNumber, setSignUpContactNumber] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      localStorage.setItem("jwtToken", token);

      if (userRole === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (userRole === "ORGANIZER") {
        navigate("/organizer-dashboard");
      } else if (userRole === "ATTENDEE") {
        navigate("/home");
      } else {
        throw new Error("Invalid role");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    const signupData = {
      username: signUpUsername,
      password: signUpPassword,
      email: signUpEmail,
      contactNumber: signUpContactNumber,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    let url = "http://localhost:9090/users/create";
    let body = JSON.stringify({ ...signupData, role: "ATTENDEE" });

    if (isOrganizer) {
      url = "http://localhost:9090/organizer/create";
      body = JSON.stringify(signupData); // Organizer API might not need the 'role' field
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      // Optionally, redirect to login or show a success message
      setShowSignUp(false); // Go back to the login form
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
    setError(""); // Clear any previous errors when toggling
  };

  const handleOrganizerChange = (e) => {
    setIsOrganizer(e.target.checked);
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input
            type="checkbox"
            className="toggle"
            checked={showSignUp}
            onChange={handleToggleSignUp}
          />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner" data-active={showSignUp}>
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" onSubmit={handleLogin}>
                <input
                  className="flip-card__input"
                  name="username"
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  className="flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && !showSignUp && <div className="login-error">{error}</div>}
                <button className="flip-card__btn" type="submit">
                  Let`s go!
                </button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={handleSignUp}>
                <input
                  className="flip-card__input"
                  placeholder="Username"
                  type="text"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  required
                />
                <input
                  className="flip-card__input"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
                <input
                  className="flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
                <input
                  className="flip-card__input"
                  placeholder="Contact Number"
                  type="tel"
                  value={signUpContactNumber}
                  onChange={(e) => setSignUpContactNumber(e.target.value)}
                  required
                />
                <label className="container">
                  <input
                    type="checkbox"
                    checked={isOrganizer}
                    onChange={handleOrganizerChange}
                  />
                  <span className="checkmark"></span>
                  Organizer
                </label>
                {error && showSignUp && <div className="login-error">{error}</div>}
                <button className="flip-card__btn" type="submit">
                  Confirm!
                </button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default LoginForm;