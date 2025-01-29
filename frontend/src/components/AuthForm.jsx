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
        addMessage(
          <Message
            name={"Success!"}
            message={"You've logged in"}
            type={"success"}
          />
        );
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.detail &&
        error.response.data.detail.errors
      ) {
        error.response.data.detail.errors.forEach((err) => {
          addMessage(
            <Message name={"Invalid data!"} message={err} type={"error"} />
          );
        });
      } else {
        addMessage(
          <Message
            name={"Something went wrong"}
            message={"Please try again"}
            type={"error"}
          />
        );
      }
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
          <div className="input-icons">
            <i className="fa fa-user"></i>
            <i className="fa fa-grip-lines-vertical"></i>
            <input
              type="text"
              className="form-input"
              value={username}
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="on"
              required
            />
          </div>
        </div>
        <div className="input-block">
          <label htmlFor="password">Password</label>
          <div className="input-icons">
            <i className="fa fa-key"></i>
            <i className="fa fa-grip-lines-vertical"></i>
            <input
              type="password"
              className="form-input"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="on"
              required
            />
          </div>
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
