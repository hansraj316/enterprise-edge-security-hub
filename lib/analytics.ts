export type AssessmentEvent = "roi_calculated" | "lead_submitted" | "assessment_book_clicked" | "plan_selected";

export function trackEvent(event: AssessmentEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    properties,
  };

  window.dispatchEvent(new CustomEvent("edgeshield:event", { detail: payload }));

  const maybeDataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  if (Array.isArray(maybeDataLayer)) {
    maybeDataLayer.push({ event, ...properties, timestamp: payload.timestamp });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", payload);
  }
}
