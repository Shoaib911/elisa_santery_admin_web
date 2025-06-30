import React, { useState } from "react";
import axios from "axios";
import "./SignIn.css";
import { requestPermission } from "../../firebase";

const uri = "https://elisasentary-cdd246e98fea.herokuapp.com";

const SignIn = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted");

    // Check for static credentials
    if (email === "admin@gmail.com" && password === "admin@123") {
      try {
        console.log("Using static credentials");
        // Create a mock token for static login
        const mockToken = "static-admin-token";
        localStorage.setItem("token", mockToken);

        console.log("Requesting FCM Permission...");
        const fcmToken = await requestPermission();
        console.log("Get FCM Token...", fcmToken);
        if (fcmToken) {
          console.log("Storing FCM Token:", fcmToken);
          await axios.post(`${uri}/api/store-fcm-token`, {
            email,
            fcmToken,
          });
        }

        console.log("Authentication Successful");
        setIsAuthenticated(true);
        return;
      } catch (err) {
        console.error("Error during static Sign-In:", err);
        setError("Error during login");
        return;
      }
    }

    // If not static credentials, proceed with normal API authentication
    try {
      console.log("Sending Sign-In Request...");
      const response = await axios.post(`${uri}/api/signin`, {
        email,
        password,
      });

      console.log("Received Response:", response);
      localStorage.setItem("token", response.data.token);

      console.log("Requesting FCM Permission...");
      const fcmToken = await requestPermission();
      console.log("Get FCM Token...", fcmToken);
      if (fcmToken) {
        console.log("Storing FCM Token:", fcmToken);
        await axios.post(`${uri}/api/store-fcm-token`, {
          email,
          fcmToken,
        });
      }

      console.log("Authentication Successful");
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error during Sign-In:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
