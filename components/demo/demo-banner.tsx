"use client";

export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 text-sm py-3 px-4 text-center">
      <span className="font-semibold">⚠️ Demo Mode:</span> No real data, payments, or accounts are used. This is a preview for testing purposes only.
    </div>
  );
}
