import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, validationErrors } = useSelector(
    (state) => state.auth
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState("");

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (confirmPassword && value !== confirmPassword) {
      setFieldError("New password and confirm password do not match.");
    } else {
      setFieldError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (newPassword && newPassword !== value) {
      setFieldError("New password and confirm password do not match.");
    } else {
      setFieldError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setFieldError("New password and confirm password do not match.");
      return;
    }

    dispatch(
      changePassword({
        currentPassword,
        newPassword,
        newPassword_confirmation: confirmPassword,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate('/');
      }
    });

    if (!loading && !error) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="change-password-container">
      <div className="card abc">
        <div className="card-body xyz">
          <h3 className="text-center">Change Password</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {fieldError && <div className="field-error">{fieldError}</div>}
              {validationErrors?.newPassword && (
                <div className="field-error">
                  {validationErrors.newPassword[0]}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
