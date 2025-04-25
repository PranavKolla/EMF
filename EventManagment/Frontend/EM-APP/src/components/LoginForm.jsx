import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./css/LoginForm.css"; // Ensure this CSS file contains the styles for the new structure

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpContactNumber, setSignUpContactNumber] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
        // Check if the response is JSON or plain text
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Invalid username or password";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text(); // Handle plain text response
        }
        throw new Error(errorMessage);
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
      window.alert(err.message); // Show clean error message
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate password length
    if (signUpPassword.length < 6) {
      window.alert("Password must be at least 6 characters long.");
      return;
    }

    // Validate contact number length and format
    const contactNumberRegex = /^\d{10}$/; // Regex for exactly 10 digits
    if (!contactNumberRegex.test(signUpContactNumber)) {
      window.alert("Contact number must be exactly 10 digits.");
      return;
    }

    const signupData = {
      userName: signUpUsername,
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
      body = JSON.stringify(signupData);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        // Check if the response is JSON or plain text
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Signup failed";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text(); // Handle plain text response
        }
        throw new Error(errorMessage);
      }

      // Show success message
      window.alert("Signup successful! You can now log in.");
      setShowSignUp(false); // Go back to the login form
    } catch (err) {
      window.alert(err.message); // Show clean error message
    }
  };

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
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