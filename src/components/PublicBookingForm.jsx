import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { ymd, getPriestItemsForDate, tmin, formatMinutes } from "../services/storage";
import { BookOpen, Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export const PublicBookingForm = () => {
  const { priests, masses, bookings, leaves, addBooking, addToast } = useParish();

  const [type, setType] = useState("Wedding");
  const [date, setDate] = useState(ymd(new Date()));
  const [time, setTime] = useState("10:00 AM");
  const [priestId, setPriestId] = useState("miguel");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Parish Church");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculate priest availability for selected date & time
  const dayItems = getPriestItemsForDate(date, priestId, masses, bookings, leaves);
  const isPriestOnLeave = dayItems === null;

  // Check if requested time clashes with existing schedule
  const requestedStart = tmin(time);
  const isMainChurch = !location || location === "Parish Church";
  const requestedEnd = requestedStart + (isMainChurch ? 60 : 90);

  const hasConflict = dayItems && dayItems.some((item) => {
    return Math.max(item.s, requestedStart) < Math.min(item.e, requestedEnd);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPriestOnLeave) {
      addToast("Selected priest is on leave/retreat on this date. Please select another priest or date.", "error");
      return;
    }

    if (hasConflict) {
      addToast("Selected time conflicts with an existing Mass or booking. Please pick another time window.", "error");
      return;
    }

    if (!title.trim() || !contactPerson.trim() || !contactPhone.trim()) {
      addToast("Please fill in event title, contact name, and phone number.", "error");
      return;
    }

    const newBk = addBooking({
      date,
      time,
      type,
      title: title.trim(),
      priestId,
      location: location.trim() || "Parish Church",
      contactPerson: contactPerson.trim(),
      contactPhone: contactPhone.trim(),
      notes: notes.trim(),
      status: "Confirmed"
    });

    setConfirmedBooking({
      ...newBk,
      priestName: priests[priestId]?.name || "Parish Priest"
    });
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setTitle("");
    setContactPerson("");
    setContactPhone("");
    setNotes("");
  };

  if (confirmedBooking) {
    return (
      <section className="section wrap">
        <div className="receipt-card card shadow-lg">
          <div className="receipt-header text-center">
            <CheckCircle2 size={48} className="success-icon" />
            <h2>Sacramental Booking Confirmed!</h2>
            <p className="lead">
              Your request for <strong>{confirmedBooking.type}</strong> has been logged into the parish calendar.
            </p>
          </div>

          <div className="receipt-body">
            <div className="receipt-details-grid">
              <div className="detail-item">
                <span className="label">Sacrament / Event:</span>
                <strong className="highlight-text">{confirmedBooking.type} — {confirmedBooking.title}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Date & Time:</span>
                <strong>{confirmedBooking.date} @ {confirmedBooking.time}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Officiating Priest:</span>
                <strong>{confirmedBooking.priestName}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Venue / Location:</span>
                <strong>{confirmedBooking.location}</strong>
              </div>
              <div className="detail-item">
                <span className="label">Contact Person:</span>
                <strong>{confirmedBooking.contactPerson} ({confirmedBooking.contactPhone})</strong>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="chip status-confirmed">{confirmedBooking.status}</span>
              </div>
            </div>

            <div className="alert-info mt-4">
              <p>
                <strong>Next Steps:</strong> Please visit or contact the Parish Secretariat at least 1 week prior to submit required documentations (e.g. Baptismal certificate, Marriage license, or parish permits).
              </p>
            </div>

            <div className="receipt-actions print-hide">
              <button className="btn btn-outline" onClick={() => window.print()}>
                Print Confirmation
              </button>
              <button className="btn btn-primary" onClick={handleReset}>
                <Sparkles size={16} /> Book Another Sacrament
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
            <BookOpen size={24} className="gold-icon" /> Book Sacramental Services & Blessings
          </h2>
          <p className="lead">
            Schedule Weddings, Baptisms, House Blessings, Funeral Masses, and Holy Sacraments with our Parish Priests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-grid-2">
            {/* Sacrament Type */}
            <div className="form-group">
              <label>Service / Sacrament Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-control"
              >
                <option value="Wedding">Nuptial / Wedding Mass</option>
                <option value="Baptism">Holy Baptism</option>
                <option value="Funeral Mass">Funeral Mass / Blessing</option>
                <option value="House Blessing">House or Business Blessing</option>
                <option value="Anointing of the Sick">Anointing of the Sick</option>
                <option value="Confession">Sacrament of Reconciliation</option>
              </select>
            </div>

            {/* Event Title */}
            <div className="form-group">
              <label>Event Title / Family Name *</label>
              <input
                type="text"
                placeholder="e.g. Santos-Reyes Nuptial / Baby Gabriel Baptism"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            {/* Date */}
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={date}
                min={ymd(new Date())}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                required
              />
            </div>

            {/* Time */}
            <div className="form-group">
              <label>Preferred Time *</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-control"
              >
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>

            {/* Officiating Priest */}
            <div className="form-group">
              <label>Officiating Priest *</label>
              <select
                value={priestId}
                onChange={(e) => setPriestId(e.target.value)}
                className="form-control"
              >
                {Object.entries(priests).map(([k, p]) => (
                  <option key={k} value={k}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Conflict Alert */}
          {isPriestOnLeave ? (
            <div className="alert-danger flex-align">
              <AlertTriangle size={18} />
              <span>
                <strong>Unavailable:</strong> {priests[priestId]?.name} is on leave/retreat on {date}.
              </span>
            </div>
          ) : hasConflict ? (
            <div className="alert-warning flex-align">
              <AlertTriangle size={18} />
              <span>
                <strong>Time Conflict:</strong> {priests[priestId]?.name} already has a Mass or booking around {time}. Please choose another time slot.
              </span>
            </div>
          ) : (
            <div className="alert-success flex-align">
              <CheckCircle2 size={18} />
              <span>
                <strong>Slot Available:</strong> {priests[priestId]?.name} is free at {time} on {date}.
              </span>
            </div>
          )}

          <div className="form-grid-2">
            {/* Location */}
            <div className="form-group">
              <label>Venue / Location</label>
              <input
                type="text"
                placeholder="Parish Church (or Chapel / Residence address)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Contact Person */}
            <div className="form-group">
              <label>Contact Person Name *</label>
              <input
                type="text"
                placeholder="Full name of representative"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            {/* Contact Phone */}
            <div className="form-group">
              <label>Contact Phone Number *</label>
              <input
                type="tel"
                placeholder="0917 123 4567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="form-control"
                required
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>Special Requests / Notes</label>
              <input
                type="text"
                placeholder="e.g. Flower setup, baptism sponsors count..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-footer">
            <button
              type="submit"
              disabled={isPriestOnLeave || hasConflict}
              className="btn btn-primary btn-lg"
            >
              <BookOpen size={18} /> Confirm Sacramental Booking
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
