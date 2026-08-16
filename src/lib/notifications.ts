export type AdminNotification = {
  id: string;
  text: string;
  type: "suggestion" | "comment" | "action";
  timestamp: number;
  timeStr: string;
  targetUrl: string;
  read?: boolean;
};

export function getTargetUrl(text: string, type: "suggestion" | "comment" | "action"): string {
  if (type === "suggestion") return "/admin/suggestions";
  if (type === "comment") return "/admin/content";
  const lower = text.toLowerCase();
  if (lower.includes("track") || lower.includes("song") || lower.includes("music")) return "/admin/music";
  if (lower.includes("media") || lower.includes("image") || lower.includes("video") || lower.includes("gallery")) return "/admin/gallery";
  if (lower.includes("festival")) return "/admin/festivals";
  return "/admin/content";
}

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("dagbon_read_notifs");
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function markAllNotificationsAsRead(ids?: string[]) {
  if (typeof window === "undefined") return;
  try {
    const current = getReadIds();
    if (ids && ids.length > 0) {
      ids.forEach((id) => current.add(id));
    } else {
      const all = getNotifications();
      all.forEach((n) => current.add(n.id));
    }
    localStorage.setItem("dagbon_read_notifs", JSON.stringify(Array.from(current)));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to mark notifications as read", e);
  }
}

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
      targetUrl: getTargetUrl(text, type),
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
    const readIds = getReadIds();

    // Also collect suggestions from localStorage
    const rawSuggs = localStorage.getItem("dagbon_suggestions");
    const suggs: any[] = rawSuggs ? JSON.parse(rawSuggs) : [];
    const suggNotifs: AdminNotification[] = suggs.map((s) => {
      const text = `Suggestion from ${s.author}: "${s.text.length > 50 ? s.text.slice(0, 50) + "..." : s.text}"`;
      return {
        id: `sugg_${s.id}`,
        text,
        type: "suggestion" as const,
        timestamp: s.id || Date.now(),
        timeStr: s.date || "Recent",
        targetUrl: "/admin/suggestions",
      };
    });

    // Merge and deduplicate by text/id, sort descending by timestamp
    const all = [...notifs, ...suggNotifs];
    const seen = new Set<string>();
    const unique: AdminNotification[] = [];

    for (const item of all) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        if (!item.targetUrl) {
          item.targetUrl = getTargetUrl(item.text, item.type);
        }
        item.read = readIds.has(item.id);
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
