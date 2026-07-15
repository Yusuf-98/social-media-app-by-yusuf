type AnalyticsEvent =
  "view_post" | "like" | "unlike" | "follow" | "unfollow" | "save" | "unsave" | "comment_submit";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[analytics]", event, payload ?? {});
  }
}
