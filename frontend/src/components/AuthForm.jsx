import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import Message from "./Message";
import "../styles/AuthForm.css";
import {
  MessagesContextProvider,
  useMessages,
} from "../contexts/MessagesContext";

function AuthForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessages();

  const navigate = useNavigate();
  const name = method === "login" ? "Sign In" : "Sign Up";

  // Check if the user is already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      addMessage(
        <Message name={error.name} message={error.message} type="error" />
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-image">
        <img src="./src/images/auth-img.png" alt="image" />
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="form-title">{name}</h1>
        <div className="input-block">
          <label htmlFor="username">Login</label>
          <input
            type="text"
            className="form-input"
            value={username}
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="on"
          />
        </div>
        <div className="input-block">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="on"
          />
        </div>
        <button type="submit" className="form-button">
          {name}
        </button>
        <div className="form-sign-up">
          {method === "login" ? (
            <p>
              Don't have an account? <a href="/register">Sign Up</a>
            </p>
          ) : (
            <p>
              I'm already have an account! <a href="/login">Sign In</a>
            </p>
          )}
        </div>
        <div className="form-loading">{loading && <LoadingIndicator />}</div>
      </form>
    </div>
  );
}

export default AuthForm;
