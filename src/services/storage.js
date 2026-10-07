import {
  INITIAL_PRIESTS,
  INITIAL_MASSES,
  INITIAL_BOOKINGS,
  INITIAL_LEAVES,
  INITIAL_INTENTIONS,
  INITIAL_ANNOUNCEMENTS
} from "../data/initialData";

const STORAGE_KEY = "candelaria_parish_db_v2";

export const getStoredData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw);
    return {
      priests: parsed.priests || INITIAL_PRIESTS,
      masses: parsed.masses || INITIAL_MASSES,
      bookings: parsed.bookings || INITIAL_BOOKINGS,
      leaves: parsed.leaves || INITIAL_LEAVES,
      intentions: parsed.intentions || INITIAL_INTENTIONS,
      announcements: parsed.announcements || INITIAL_ANNOUNCEMENTS
    };
  } catch (err) {
    console.error("Failed to parse parish database, reverting to defaults:", err);
    return getDefaultData();
  }
};

export const saveStoredData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save parish database to localStorage:", err);
  }
};

export const getDefaultData = () => ({
  priests: { ...INITIAL_PRIESTS },
  masses: [...INITIAL_MASSES],
  bookings: [...INITIAL_BOOKINGS],
  leaves: [...INITIAL_LEAVES],
  intentions: [...INITIAL_INTENTIONS],
  announcements: [...INITIAL_ANNOUNCEMENTS]
});

// Time utilities
export const tmin = (timeStr) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

export const formatMinutes = (totalMinutes) => {
  let h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
};

export const formatDuration = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
};

export const ymd = (d = new Date()) => {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Priest Availability Math
export const DAY_START_MIN = 300; // 5:00 AM
export const DAY_END_MIN = 1260;  // 9:00 PM

export const getPriestItemsForDate = (dateStr, priestId, masses, bookings, leaves) => {
  // Check if on leave
  const isOnLeave = leaves.some(
    (l) => l.priestId === priestId && dateStr >= l.from && dateStr <= l.to
  );
  if (isOnLeave) return null;

  const dateObj = new Date(dateStr + "T00:00:00");
  const dayOfWeek = dateObj.getDay();

  // Weekly Masses for this day & priest
  const dayMasses = masses
    .filter((m) => m.day === dayOfWeek && m.priestId === priestId)
    .map((m) => {
      const s = tmin(m.time);
      const isMainChurch = !m.location || m.location === "Parish Church";
      // Outside parish requires travel time (+30m)
      const duration = isMainChurch ? 60 : 90;
      return {
        id: m.id,
        type: "Mass",
        time: m.time,
        name: `${m.type} (${m.language})`,
        location: m.location || "Parish Church",
        s,
        e: s + duration,
        isMainChurch
      };
    });

  // Date-specific Bookings
  const dayBookings = bookings
    .filter((b) => b.date === dateStr && b.priestId === priestId && b.status !== "Cancelled")
    .map((b) => {
      const s = tmin(b.time);
      const isMainChurch = !b.location || b.location === "Parish Church";
      const duration = isMainChurch ? 60 : 90;
      return {
        id: b.id,
        type: b.type,
        time: b.time,
        name: b.title,
        location: b.location || "Parish Church",
        s,
        e: s + duration,
        isMainChurch
      };
    });

  // Combine and sort chronologically
  const items = [...dayMasses, ...dayBookings].sort((a, b) => a.s - b.s);
  return items;
};

export const getFreeGaps = (items, startMin = DAY_START_MIN, endMin = DAY_END_MIN) => {
  if (!items) return [];
  let curr = startMin;
  const gaps = [];

  items.forEach((item) => {
    if (item.s - curr >= 60) {
      gaps.push([curr, item.s]);
    }
    curr = Math.max(curr, item.e);
  });

  if (endMin - curr >= 60) {
    gaps.push([curr, endMin]);
  }

  return gaps;
};

export const generateRefCode = (prefix = "INT") => {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${year}-${randomStr}`;
};
