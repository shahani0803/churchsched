import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { INTENTION_TYPES, DAYS_OF_WEEK } from "../data/initialData";
import { ymd, tmin } from "../services/storage";
import { HeartHandshake, CheckCircle, Printer, Copy, CreditCard, Sparkles } from "lucide-react";

export const PublicIntentionForm = () => {
  const { masses, priests, addIntention, addToast } = useParish();

  const [date, setDate] = useState(ymd(new Date()));
  const [selectedMassTime, setSelectedMassTime] = useState("");
  const [category, setCategory] = useState(INTENTION_TYPES[0]);
  const [offeredFor, setOfferedFor] = useState("");
  const [offeredBy, setOfferedBy] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [amount, setAmount] = useState(100);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  // Available masses for chosen date
  const dayOfWeek = new Date(date + "T00:00:00").getDay();
  const dayMasses = masses
    .filter((m) => m.day === dayOfWeek)
    .sort((a, b) => tmin(a.time) - tmin(b.time));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offeredFor.trim()) {
      addToast("Please enter the name for whom the intention is offered.", "error");
      return;
    }

    const selectedMass = dayMasses.find((m) => m.time === selectedMassTime) || dayMasses[0];
    const massTimeStr = selectedMass ? selectedMass.time : "06:00 AM";
    const priestId = selectedMass ? selectedMass.priestId : "miguel";

    const newIntention = addIntention({
      date,
      time: massTimeStr,
      priestId,
      category,
      offeredFor: offeredFor.trim(),
      offeredBy: offeredBy.trim() || "Anonymous Parishioner",
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      offeringAmount: Number(amount) || 0,
      status: "Approved"
    });

    setSubmittedReceipt({
      ...newIntention,
      massType: selectedMass ? `${selectedMass.type} (${selectedMass.language})` : "Holy Mass",
      priestName: priests[priestId]?.name || "Parish Priest",
      location: selectedMass?.location || "Parish Church"
    });
  };

  const handleReset = () => {
    setSubmittedReceipt(null);
    setOfferedFor("");
    setOfferedBy("");
    setContactEmail("");
    setContactPhone("");
  };

  const copyRefCode = () => {
    if (submittedReceipt) {
      navigator.clipboard.writeText(submittedReceipt.refCode);
      addToast("Reference code copied to clipboard!", "success");
    }
  };

  if (submittedReceipt) {
    return (
      <section className="section wrap">
        <div className="receipt-card card shadow-lg">
          <div className="receipt-header text-center">
            <CheckCircle size={48} className="success-icon" />
            <h2>Mass Intention Received!</h2>
            <p className="lead">
              May God bless your offering. Your Mass intention has been scheduled on our parish altar list.
            </p>
          </div>

          <div className="receipt-body">
            <div className="ref-banner">
              <span className="ref-label">Reference Tracking Code:</span>
              <div className="ref-code-box">
                <strong className="ref-code">{submittedReceipt.refCode}</strong>
                <button className="btn-sm btn-icon" onClick={copyRefCode} title="Copy Code">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="receipt-details-grid">
              <div className="detail-item">
                <span className="label">Intention Type:</span>
                <strong>{submittedReceipt.category}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Offered For:</span>
                <strong className="highlight-text">{submittedReceipt.offeredFor}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Offered By:</span>
                <strong>{submittedReceipt.offeredBy}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Scheduled Mass:</span>
                <strong>
                  {submittedReceipt.date} ({DAYS_OF_WEEK[new Date(submittedReceipt.date + "T00:00:00").getDay()]}) @ {submittedReceipt.time}
                </strong>
              </div>
              <div className="detail-item">
                <span className="label">Presiding Priest:</span>
                <strong>{submittedReceipt.priestName}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Location:</span>
                <strong>{submittedReceipt.location}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Mass Offering:</span>
                <strong>₱{submittedReceipt.offeringAmount}</strong>
              </div>
            </div>

            {/* Payment & Donation Instructions */}
            <div className="payment-note-box">
              <h4>
                <CreditCard size={18} /> Love Offering Instructions
              </h4>
              <p>
                Mass offerings are voluntary donations that support parish upkeep and clergy subsistence.
                You may present your reference code at the Parish Office or transfer via GCash:
              </p>
              <div className="gcash-info">
                <span>GCash / Maya Account: <strong>0917-123-4567 (Nuestra Señora de la Candelaria Parish)</strong></span>
              </div>
            </div>

            <div className="receipt-actions print-hide">
              <button className="btn btn-outline" onClick={() => window.print()}>
                <Printer size={16} /> Print Confirmation Slip
              </button>
              <button className="btn btn-primary" onClick={handleReset}>
                <Sparkles size={16} /> Submit Another Intention
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section wrap">
      <div className="form-card card">
        <div className="card-header">
          <h2>
            <HeartHandshake size={24} className="gold-icon" /> Online Mass Intention Request
          </h2>
          <p className="lead">
            Offer Holy Masses for your loved ones, eternal repose of departed souls, thanksgiving, or healing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="intention-form">
          <div className="form-grid-2">
            {/* Category */}
            <div className="form-group">
              <label>Intention Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                required
              >
                {INTENTION_TYPES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Mass Date *</label>
              <input
                type="date"
                value={date}
                min={ymd(new Date())}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedMassTime("");
                }}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Mass Time Selection */}
          <div className="form-group">
            <label>Select Mass Time & Location *</label>
            {dayMasses.length === 0 ? (
              <div className="alert-warning">
                No Mass is scheduled for this selected date. Please pick another date.
              </div>
            ) : (
              <div className="mass-radio-grid">
                {dayMasses.map((m) => {
                  const priest = priests[m.priestId];
                  const isSelected = selectedMassTime === m.time || (!selectedMassTime && dayMasses[0].time === m.time);
                  return (
                    <label
                      key={m.id}
                      className={`mass-radio-card ${isSelected ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="massTime"
                        value={m.time}
                        checked={isSelected}
                        onChange={() => setSelectedMassTime(m.time)}
                      />
                      <div className="radio-content">
                        <strong className="radio-time">{m.time}</strong>
                        <span className="radio-title">{m.type} ({m.language})</span>
                        <span className="radio-sub">
                          {priest ? priest.name : "Parish Priest"} · {m.location}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-grid-2">
            {/* Offered For */}
            <div className="form-group">
              <label>Name(s) / Intention Details *</label>
              <input
                type="text"
                placeholder="e.g. Maria & Juan Santos / Late Roberto Dela Cruz"
                value={offeredFor}
                onChange={(e) => setOfferedFor(e.target.value)}
                className="form-control"
                required
              />
              <small className="help-text">For repose of soul, list the name of deceased. For thanksgiving/healing, list person's name.</small>
            </div>

            {/* Offered By */}
            <div className="form-group">
              <label>Offered By (Family / Individual)</label>
              <input
                type="text"
                placeholder="e.g. Santos Family / Ana Cruz"
                value={offeredBy}
                onChange={(e) => setOfferedBy(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-grid-3">
            {/* Offering Amount */}
            <div className="form-group">
              <label>Mass Stipend / Offering (₱)</label>
              <select
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="form-control"
              >
                <option value={100}>₱ 100 (Standard Offering)</option>
                <option value={200}>₱ 200</option>
                <option value={500}>₱ 500</option>
                <option value={1000}>₱ 1,000</option>
                <option value={0}>Free / Voluntary</option>
              </select>
            </div>

            {/* Contact Email */}
            <div className="form-group">
              <label>Contact Email (Optional)</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Contact Phone */}
            <div className="form-group">
              <label>Contact Phone (Optional)</label>
              <input
                type="tel"
                placeholder="0917 123 4567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary-gold btn-lg">
              <HeartHandshake size={20} /> Submit Mass Intention
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
