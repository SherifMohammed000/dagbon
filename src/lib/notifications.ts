export type AdminNotification = {
  id: string;
  text: string;
  type: "suggestion" | "comment" | "action";
  timestamp: number;
  timeStr: string;
};

export function addNotification(text: string, type: "suggestion" | "comment" | "action") {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("dagbon_notifications");
    const list: AdminNotification[] = raw ? JSON.parse(raw) : [];
    const item: AdminNotification = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text,
      type,
      timestamp: Date.now(),
      timeStr: "Just now",
    };
    // Keep max 30 recent notifications
    const updated = [item, ...list].slice(0, 30);
    localStorage.setItem("dagbon_notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to add notification", e);
  }
}

export function getNotifications(): AdminNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const rawNotifs = localStorage.getItem("dagbon_notifications");
    const notifs: AdminNotification[] = rawNotifs ? JSON.parse(rawNotifs) : [];

    // Also collect suggestions from localStorage
    const rawSuggs = localStorage.getItem("dagbon_suggestions");
    const suggs: any[] = rawSuggs ? JSON.parse(rawSuggs) : [];
    const suggNotifs: AdminNotification[] = suggs.map((s) => ({
      id: `sugg_${s.id}`,
      text: `Suggestion from ${s.author}: "${s.text.length > 50 ? s.text.slice(0, 50) + "..." : s.text}"`,
      type: "suggestion",
      timestamp: s.id || Date.now(),
      timeStr: s.date || "Recent",
    }));

    // Merge and deduplicate by text/id, sort descending by timestamp
    const all = [...notifs, ...suggNotifs];
    const seen = new Set<string>();
    const unique: AdminNotification[] = [];

    for (const item of all) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }

    unique.sort((a, b) => b.timestamp - a.timestamp);
    return unique.slice(0, 20);
  } catch (e) {
    console.error("Failed to load notifications", e);
    return [];
  }
}

export function getTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}
