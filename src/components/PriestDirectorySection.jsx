import React from "react";
import { useParish } from "../context/ParishContext";
import { Mail, Phone, Calendar, BookOpen, CheckCircle2, User } from "lucide-react";
import { ymd } from "../services/storage";

export const PriestDirectorySection = () => {
  const { priests, masses, bookings, leaves, setActiveTab } = useParish();
  const todayStr = ymd(new Date());

  return (
    <section id="priests" className="section wrap">
      <div className="section-header text-center">
        <h2>Our Parish Priests & Clergy</h2>
        <p className="lead">
          Meet the dedicated shepherds who serve the liturgical, sacramental, and pastoral needs of Nuestra Señora de la Candelaria Parish.
        </p>
      </div>

      <div className="priest-cards-grid">
        {Object.entries(priests).map(([key, p]) => {
          const assignedMassesCount = masses.filter((m) => m.priestId === key).length;
          const assignedBookingsCount = bookings.filter(
            (b) => b.priestId === key && b.date >= todayStr && b.status !== "Cancelled"
          ).length;

          const isOnLeave = leaves.some(
            (l) => l.priestId === key && todayStr >= l.from && todayStr <= l.to
          );

          return (
            <div key={key} className="priest-profile-card card shadow-sm">
              <div className="priest-card-header">
                <div className="priest-avatar">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="priest-name-heading">{p.name}</h3>
                  <span className="priest-role-tag">{p.role}</span>
                </div>
              </div>

              <p className="priest-bio">{p.bio || "Dedicated minister of God's Word and Sacraments."}</p>

              <div className="priest-stats-row">
                <div className="stat-pill">
                  <Calendar size={14} />
                  <span>{assignedMassesCount} Masses / week</span>
                </div>
                <div className="stat-pill">
                  <BookOpen size={14} />
                  <span>{assignedBookingsCount} Upcoming Sacraments</span>
                </div>
              </div>

              <div className="priest-contact-box">
                {p.email && (
                  <div className="contact-line">
                    <Mail size={14} />
                    <span>{p.email}</span>
                  </div>
                )}
                {p.phone && (
                  <div className="contact-line">
                    <Phone size={14} />
                    <span>{p.phone}</span>
                  </div>
                )}
              </div>

              <div className="priest-card-footer">
                {isOnLeave ? (
                  <span className="chip status-leave">Currently On Leave</span>
                ) : (
                  <span className="chip status-available">
                    <CheckCircle2 size={12} /> Active on Duty
                  </span>
                )}
                <button
                  className="btn-sm btn-outline-gold"
                  onClick={() => setActiveTab("availability")}
                >
                  View Schedule
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
