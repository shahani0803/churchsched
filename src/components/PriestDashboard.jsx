import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import { ymd, tmin } from "../services/storage";
import {
  Calendar,
  BookOpen,
  ScrollText,
  Clock,
  Printer,
  MapPin,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { DAYS_OF_WEEK } from "../data/initialData";

export const PriestDashboard = () => {
  const {
    currentUser,
    priests,
    masses,
    bookings,
    intentions,
    leaves,
    addLeave,
    deleteLeave,
    setActiveTab
  } = useParish();

  const priestKey = currentUser?.key;
  const priestInfo = priests[priestKey];
  const todayStr = ymd(new Date());
  const todayDow = new Date().getDay();

  // Leave Form state
  const [leaveFrom, setLeaveFrom] = useState(todayStr);
  const [leaveTo, setLeaveTo] = useState(todayStr);
  const [leaveReason, setLeaveReason] = useState("");

  if (!priestInfo) {
    return (
      <div className="section wrap text-center">
        <p>Priest record not found.</p>
      </div>
    );
  }

  // Priest specific data
  const myMasses = masses.filter((m) => m.priestId === priestKey);
  const todayMasses = myMasses
    .filter((m) => m.day === todayDow)
    .sort((a, b) => tmin(a.time) - tmin(b.time));

  const myBookings = bookings
    .filter((b) => b.priestId === priestKey && b.date >= todayStr && b.status !== "Cancelled")
    .sort((a, b) => a.date.localeCompare(b.date) || tmin(a.time) - tmin(b.time));

  const myTodayIntentions = intentions.filter(
    (i) => i.priestId === priestKey && i.date === todayStr
  );

  const myLeaves = leaves.filter((l) => l.priestId === priestKey);

  const handleAddLeave = (e) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo || leaveTo < leaveFrom) {
      return;
    }
    addLeave({
      priestId: priestKey,
      from: leaveFrom,
      to: leaveTo,
      reason: leaveReason.trim() || "Personal Leave / Retreat"
    });
    setLeaveReason("");
  };

  return (
    <section className="section wrap">
      <div className="dashboard-hero card shadow-sm">
        <div className="dash-hero-content">
          <div>
            <span className="dash-badge">Priest Personal Dashboard</span>
            <h2>{priestInfo.name}</h2>
            <p className="lead">{priestInfo.role} · Nuestra Señora de la Candelaria Parish</p>
          </div>
          <div className="dash-hero-actions">
            <button
              className="btn btn-outline"
              onClick={() => {
                setActiveTab("intentions");
                setTimeout(() => window.print(), 300);
              }}
            >
              <Printer size={16} /> Print Altar Sheet
            </button>
          </div>
        </div>
      </div>

      <div className="dash-grid-2 mt-6">
        {/* Today's Masses */}
        <div className="card shadow-sm">
          <div className="card-header flex-between">
            <h3>
              <Calendar size={18} className="gold-icon" /> Today's Assigned Masses ({DAYS_OF_WEEK[todayDow]})
            </h3>
            <span className="badge-count">{todayMasses.length} Today</span>
          </div>
          <div className="card-body">
            {todayMasses.length === 0 ? (
              <p className="empty-text">No Mass scheduled for you today.</p>
            ) : (
              <div className="dash-list">
                {todayMasses.map((m) => (
                  <div key={m.id} className="dash-item-row">
                    <div className="item-time">{m.time}</div>
                    <div className="item-main">
                      <strong>{m.type} ({m.language})</strong>
                      <span className="item-sub">
                        <MapPin size={12} /> {m.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Today's Intentions */}
        <div className="card shadow-sm">
          <div className="card-header flex-between">
            <h3>
              <ScrollText size={18} className="gold-icon" /> Today's Mass Intentions
            </h3>
            <span className="badge-count">{myTodayIntentions.length} Total</span>
          </div>
          <div className="card-body">
            {myTodayIntentions.length === 0 ? (
              <p className="empty-text">No intentions recorded for your Masses today.</p>
            ) : (
              <div className="dash-list">
                {myTodayIntentions.map((i) => (
                  <div key={i.id} className="dash-item-row">
                    <div className="item-time">{i.time}</div>
                    <div className="item-main">
                      <strong>{i.offeredFor}</strong>
                      <span className="item-sub">
                        {i.category} {i.offeredBy && `· Offered by: ${i.offeredBy}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dash-grid-2 mt-6">
        {/* Upcoming Bookings & Sacraments */}
        <div className="card shadow-sm">
          <div className="card-header flex-between">
            <h3>
              <BookOpen size={18} className="gold-icon" /> Upcoming Sacramental Bookings
            </h3>
            <span className="badge-count">{myBookings.length} Upcoming</span>
          </div>
          <div className="card-body">
            {myBookings.length === 0 ? (
              <p className="empty-text">No upcoming bookings assigned.</p>
            ) : (
              <div className="dash-list">
                {myBookings.map((b) => (
                  <div key={b.id} className="dash-item-row">
                    <div className="item-date">
                      <span>{b.date}</span>
                      <small>{b.time}</small>
                    </div>
                    <div className="item-main">
                      <strong>{b.type}: {b.title}</strong>
                      <span className="item-sub">
                        <MapPin size={12} /> {b.location} · Contact: {b.contactPerson} ({b.contactPhone})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Manage Personal Leave / Absence */}
        <div className="card shadow-sm">
          <div className="card-header">
            <h3>
              <Clock size={18} className="gold-icon" /> Request Leave / Absence
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddLeave} className="leave-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Diocesan Retreat / Vacation"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary-gold btn-block">
                <PlusCircle size={16} /> Submit Leave Schedule
              </button>
            </form>

            <h4 className="mt-6 mb-2">My Scheduled Leaves:</h4>
            {myLeaves.length === 0 ? (
              <p className="empty-text">No leave scheduled.</p>
            ) : (
              <div className="dash-list">
                {myLeaves.map((l) => (
                  <div key={l.id} className="dash-item-row flex-between">
                    <div>
                      <strong>
                        {l.from} → {l.to}
                      </strong>
                      <span className="item-sub">{l.reason}</span>
                    </div>
                    <button
                      className="btn-sm btn-outline-danger"
                      onClick={() => deleteLeave(l.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
