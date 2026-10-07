import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredData,
  saveStoredData,
  getDefaultData,
  generateRefCode
} from "../services/storage";

const ParishContext = createContext(null);

export const ParishProvider = ({ children }) => {
  const [data, setData] = useState(() => getStoredData());
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("candelaria_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("schedule");
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("candelaria_theme");
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [toasts, setToasts] = useState([]);

  // Sync dataset to LocalStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Sync theme to root DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("candelaria_theme", theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Toast helper
  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth functions
  const login = (accountKey, pinInput) => {
    if (accountKey === "admin") {
      if (pinInput === "1234") {
        const userObj = { role: "admin", key: "admin", name: "Administrator" };
        setCurrentUser(userObj);
        sessionStorage.setItem("candelaria_user", JSON.stringify(userObj));
        addToast("Welcome, Administrator!", "success");
        return true;
      }
    } else if (data.priests[accountKey]) {
      const priest = data.priests[accountKey];
      if (pinInput === priest.pin) {
        const userObj = { role: "priest", key: accountKey, name: priest.name };
        setCurrentUser(userObj);
        sessionStorage.setItem("candelaria_user", JSON.stringify(userObj));
        addToast(`Welcome, ${priest.name}!`, "success");
        return true;
      }
    }
    addToast("Invalid Account or PIN code. Please try again.", "error");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("candelaria_user");
    addToast("Logged out of Priests Portal.", "info");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // --- CRUD Operations ---

  // Masses
  const addMass = (massObj) => {
    const newMass = { ...massObj, id: `m-${Date.now()}` };
    setData((prev) => ({ ...prev, masses: [...prev.masses, newMass] }));
    addToast("New Mass added to weekly schedule.", "success");
  };

  const deleteMass = (id) => {
    setData((prev) => ({ ...prev, masses: prev.masses.filter((m) => m.id !== id) }));
    addToast("Mass schedule entry deleted.", "info");
  };

  // Bookings / Sacraments
  const addBooking = (bookingObj) => {
    const newBooking = {
      ...bookingObj,
      id: `b-${Date.now()}`,
      status: bookingObj.status || "Confirmed"
    };
    setData((prev) => ({ ...prev, bookings: [...prev.bookings, newBooking] }));
    addToast(`Booking "${newBooking.title}" recorded!`, "success");
    return newBooking;
  };

  const updateBookingStatus = (id, newStatus) => {
    setData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    }));
    addToast(`Booking status updated to ${newStatus}.`, "info");
  };

  const deleteBooking = (id) => {
    setData((prev) => ({ ...prev, bookings: prev.bookings.filter((b) => b.id !== id) }));
    addToast("Booking deleted.", "info");
  };

  // Intentions
  const addIntention = (intentionObj) => {
    const newIntention = {
      ...intentionObj,
      id: `i-${Date.now()}`,
      refCode: intentionObj.refCode || generateRefCode("INT"),
      status: intentionObj.status || "Approved"
    };
    setData((prev) => ({ ...prev, intentions: [...prev.intentions, newIntention] }));
    addToast("Mass Intention submitted successfully!", "success");
    return newIntention;
  };

  const updateIntentionStatus = (id, status) => {
    setData((prev) => ({
      ...prev,
      intentions: prev.intentions.map((i) => (i.id === id ? { ...i, status } : i))
    }));
    addToast("Intention status updated.", "info");
  };

  const deleteIntention = (id) => {
    setData((prev) => ({ ...prev, intentions: prev.intentions.filter((i) => i.id !== id) }));
    addToast("Intention entry removed.", "info");
  };

  // Leaves
  const addLeave = (leaveObj) => {
    const newLeave = { ...leaveObj, id: `l-${Date.now()}` };
    setData((prev) => ({ ...prev, leaves: [...prev.leaves, newLeave] }));
    addToast("Priest leave schedule added.", "success");
  };

  const deleteLeave = (id) => {
    setData((prev) => ({ ...prev, leaves: prev.leaves.filter((l) => l.id !== id) }));
    addToast("Leave entry removed.", "info");
  };

  // Announcements
  const addAnnouncement = (annObj) => {
    const newAnn = { ...annObj, id: `a-${Date.now()}` };
    setData((prev) => ({ ...prev, announcements: [newAnn, ...prev.announcements] }));
    addToast("New parish announcement published.", "success");
  };

  const deleteAnnouncement = (id) => {
    setData((prev) => ({ ...prev, announcements: prev.announcements.filter((a) => a.id !== id) }));
    addToast("Announcement deleted.", "info");
  };

  // Priests Roster
  const addPriest = (priestObj) => {
    setData((prev) => ({
      ...prev,
      priests: { ...prev.priests, [priestObj.id]: priestObj }
    }));
    addToast(`Fr. ${priestObj.name} added to parish roster.`, "success");
  };

  const updatePriest = (id, updates) => {
    setData((prev) => ({
      ...prev,
      priests: {
        ...prev.priests,
        [id]: { ...prev.priests[id], ...updates }
      }
    }));
    addToast("Priest details updated.", "info");
  };

  // Database Reset & Backup
  const resetDatabase = () => {
    const defaults = getDefaultData();
    setData(defaults);
    addToast("Database reset to factory default sample data.", "info");
  };

  const importDatabase = (jsonData) => {
    try {
      if (jsonData.priests && jsonData.masses) {
        setData(jsonData);
        addToast("Parish database imported successfully!", "success");
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    addToast("Invalid database file format.", "error");
    return false;
  };

  return (
    <ParishContext.Provider
      value={{
        ...data,
        currentUser,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        addMass,
        deleteMass,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addIntention,
        updateIntentionStatus,
        deleteIntention,
        addLeave,
        deleteLeave,
        addAnnouncement,
        deleteAnnouncement,
        addPriest,
        updatePriest,
        resetDatabase,
        importDatabase
      }}
    >
      {children}
    </ParishContext.Provider>
  );
};

export const useParish = () => {
  const ctx = useContext(ParishContext);
  if (!ctx) throw new Error("useParish must be used within ParishProvider");
  return ctx;
};
