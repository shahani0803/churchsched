import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import {
  ymd,
  tmin,
  formatMinutes,
  formatDuration,
  getPriestItemsForDate,
  getFreeGaps,
  DAY_START_MIN,
  DAY_END_MIN
} from "../services/storage";
import { Clock, ChevronLeft, ChevronRight, Calendar as CalIcon, MapPin, CheckCircle, AlertTriangle } from "lucide-react";

export const PriestAvailabilitySection = () => {
  const { priests, masses, bookings, leaves } = useParish();

  const [selectedPriest, setSelectedPriest] = useState(Object.keys(priests)[0] || "miguel");
  const [selectedDate, setSelectedDate] = useState(ymd(new Date()));

  const dateObj = new Date(selectedDate + "T00:00:00");

  const handlePrevDay = () => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() - 1);
    setSelectedDate(ymd(d));
  };

  const handleNextDay = () => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + 1);
    setSelectedDate(ymd(d));
  };

  const handleToday = () => {
    setSelectedDate(ymd(new Date()));
  };

  // Get current priest schedule items on selected date
  const items = getPriestItemsForDate(selectedDate, selectedPriest, masses, bookings, leaves);
  const isLeave = items === null;
  const gaps = items ? getFreeGaps(items) : [];

  // Helper status for priest tab
  const getStatus = (pKey, dStr) => {
    const pItems = getPriestItemsForDate(dStr, pKey, masses, bookings, leaves);
    if (pItems === null) return { class: "badge-leave", label: "On Leave" };
    if (!pItems.length) return { class: "badge-free", label: "Free All Day" };
    return { class: "badge-busy", label: `${pItems.length} Scheduled` };
  };

  const currentPriest = priests[selectedPriest];
  const dateFormatted = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <section id="availability" className="section wrap">
      <div className="section-header">
        <div>
          <h2>Priest Availability & Visual Schedule</h2>
          <p className="lead">
            Select a priest and date to view busy times, travel windows, and free time slots.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="controls-bar card">
        <div className="priest-select-row">
          <label className="meta-label">Select Priest:</label>
          <select
            value={selectedPriest}
            onChange={(e) => setSelectedPriest(e.target.value)}
            className="select-input"
          >
            {Object.entries(priests).map(([k, p]) => (
              <option key={k} value={k}>
                {p.name} ({p.role})
              </option>
            ))}
          </select>
        </div>

        {/* Date Navigator */}
        <div className="date-nav-row">
          <button className="btn-sm btn-outline" onClick={handlePrevDay} title="Previous Day">
            <ChevronLeft size={16} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button className="btn-sm btn-outline" onClick={handleNextDay} title="Next Day">
            <ChevronRight size={16} />
          </button>
          <button className="btn-sm btn-primary" onClick={handleToday}>
            Today
          </button>
        </div>
      </div>

      {/* Priest Status Chips for Selected Date */}
      <div className="priest-chips-row">
        <span className="chips-title">Who is free on {selectedDate}?</span>
        <div className="chips-grid">
          {Object.entries(priests).map(([k, p]) => {
            const st = getStatus(k, selectedDate);
            const isSelected = k === selectedPriest;
            return (
              <button
                key={k}
                className={`priest-chip ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedPriest(k)}
              >
                <span className="chip-name">{p.name.replace("Rev. Fr. ", "Fr. ")}</span>
                <span className={`chip-badge ${st.class}`}>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Display Card */}
      <div className="availability-card card">
        <div className="av-card-header">
          <div>
            <h3 className="priest-title">{currentPriest ? currentPriest.name : "Priest"}</h3>
            <span className="date-tag">
              <CalIcon size={14} /> {dateFormatted}
            </span>
          </div>
        </div>

        {isLeave ? (
          <div className="empty-card alert-danger">
            <AlertTriangle size={24} />
            <p>
              <strong>On Leave / Retreat:</strong> {currentPriest?.name} is not available for assignments on this date.
            </p>
          </div>
        ) : !items.length ? (
          <div className="all-free-card">
            <CheckCircle size={32} className="free-icon" />
            <div>
              <strong className="free-title">No Mass or Booking Scheduled</strong>
              <p>Available all day between 5:00 AM and 9:00 PM.</p>
            </div>
          </div>
        ) : (
          <div className="timeline-container">
            {/* Timeline Visual Bar */}
            <div className="timeline-bar-wrapper">
              <div className="timeline-bar">
                {items.map((item) => {
                  const leftPct = ((item.s - DAY_START_MIN) / (DAY_END_MIN - DAY_START_MIN)) * 100;
                  const widthPct = ((item.e - item.s) / (DAY_END_MIN - DAY_START_MIN)) * 100;
                  return (
                    <div
                      key={item.id || item.s}
                      className="busy-block"
                      style={{
                        left: `${Math.max(0, leftPct)}%`,
                        width: `${Math.min(100 - leftPct, widthPct)}%`
                      }}
                      title={`${item.name} (${formatMinutes(item.s)} - ${formatMinutes(item.e)})`}
                    />
                  );
                })}
              </div>

              <div className="timeline-axis">
                <span>5 AM</span>
                <span>9 AM</span>
                <span>1 PM</span>
                <span>5 PM</span>
                <span>9 PM</span>
              </div>
            </div>

            <div className="legend-row">
              <span className="legend-item busy">■ Busy Block</span>
              <span className="legend-item free">■ Free Window</span>
              <small className="legend-note">
                * Outside-parish celebrations include 30 min travel time.
              </small>
            </div>

            {/* Scheduled Busy Items & Free Gaps Breakdown */}
            <div className="schedule-breakdown">
              <h4 className="breakdown-title">Chronological Schedule</h4>
              <div className="timeline-list">
                {items.map((item) => (
                  <div key={item.id || item.s} className="timeline-row busy-row">
                    <span className="badge-busy-sm">Busy</span>
                    <div className="row-time">
                      {formatMinutes(item.s)} – {formatMinutes(item.e)}
                    </div>
                    <div className="row-details">
                      <strong>{item.name}</strong>
                      <div className="row-loc">
                        <MapPin size={12} /> {item.location}
                      </div>
                    </div>
                  </div>
                ))}

                {gaps.length > 0 ? (
                  gaps.map(([start, end], idx) => (
                    <div key={idx} className="timeline-row free-row">
                      <span className="badge-free-sm">Free</span>
                      <div className="row-time">
                        {formatMinutes(start)} – {formatMinutes(end)}
                      </div>
                      <div className="row-details">
                        <span className="free-duration">
                          Available window ({formatDuration(end - start)})
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="timeline-row no-gap">
                    <span className="meta">No free window of 1 hour or more.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 14-Day Lookahead Calendar Grid */}
      <div className="lookahead-section">
        <h3>14-Day Availability Lookahead</h3>
        <p className="lead">Quick view of upcoming days for {currentPriest?.name}:</p>

        <div className="lookahead-grid">
          {Array.from({ length: 14 }, (_, i) => {
            const d = new Date(dateObj);
            d.setDate(d.getDate() + i);
            const dStr = ymd(d);
            const pItems = getPriestItemsForDate(dStr, selectedPriest, masses, bookings, leaves);
            const pIsLeave = pItems === null;
            const pGaps = pItems ? getFreeGaps(pItems) : [];
            const freeSumMinutes = pGaps.reduce((sum, g) => sum + (g[1] - g[0]), 0);
            const isSelected = dStr === selectedDate;

            return (
              <button
                key={dStr}
                className={`lookahead-card ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedDate(dStr)}
              >
                <div className="lookahead-date">
                  {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </div>
                <div className="lookahead-status">
                  {pIsLeave ? (
                    <span className="status-chip chip-leave">On Leave</span>
                  ) : !pItems.length ? (
                    <span className="status-chip chip-free">Free All Day</span>
                  ) : (
                    <span className="status-chip chip-busy">
                      {pItems.length} Event(s) · {formatDuration(freeSumMinutes)} free
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
