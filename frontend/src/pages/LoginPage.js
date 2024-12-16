import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { getUserPreferences } from '../store/preferencesSlice';
import './LoginPage.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(getUserPreferences()).then((data) => {
          if (data.payload && data.payload.length > 0) {
            navigate('/');
          }
          else {
            navigate("/preferences");
          }
        })
      }
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          {loading && (
            <div className="loader-container">
              <Loader />
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <div className="form-footer">
          <p>
            Don’t have an account?{" "}
            <a href="/register" className="register-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
