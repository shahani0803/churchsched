import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { Lock, X, Shield, KeyRound } from "lucide-react";

export const LoginModal = ({ isOpen, onClose }) => {
  const { priests, login, setActiveTab } = useParish();
  const [accountKey, setAccountKey] = useState("admin");
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg("Please enter your PIN code.");
      return;
    }

    const success = login(accountKey, pin);
    if (success) {
      setErrorMsg("");
      setPin("");
      onClose();
      setActiveTab("dashboard");
    } else {
      setErrorMsg("Incorrect PIN code. Please try again.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header text-center">
          <div className="cross-icon-lg">✝</div>
          <h2>Parish Clergy & Admin Portal</h2>
          <p className="lead">Authorized access for Parish Priests & Secretariat</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Account</label>
            <select
              value={accountKey}
              onChange={(e) => {
                setAccountKey(e.target.value);
                setErrorMsg("");
              }}
              className="form-control"
            >
              <option value="admin">Administrator / Secretariat</option>
              {Object.entries(priests).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Security PIN Code</label>
            <div className="pin-input-wrap">
              <KeyRound size={18} className="pin-icon" />
              <input
                type="password"
                inputMode="numeric"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="form-control pin-input"
                autoFocus
              />
            </div>
          </div>

          {errorMsg && <div className="alert-danger text-center">{errorMsg}</div>}

          <button type="submit" className="btn btn-primary btn-block mt-4">
            <Lock size={16} /> Log In to Portal
          </button>

          <div className="demo-pin-box">
            <div className="demo-pin-title">
              <Shield size={14} /> Demo Accounts & PINs:
            </div>
            <ul className="demo-pin-list">
              <li><strong>Admin:</strong> PIN <code>1234</code></li>
              <li><strong>Fr. Miguel Santos:</strong> PIN <code>1111</code></li>
              <li><strong>Fr. Joseph Reyes:</strong> PIN <code>2222</code></li>
              <li><strong>Fr. Antonio Dela Cruz:</strong> PIN <code>3333</code></li>
              <li><strong>Fr. Ramon Fernandez:</strong> PIN <code>4444</code></li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};
