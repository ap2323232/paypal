"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Redirect to home page immediately
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting...
        </h2>
        <p className="text-gray-600">Taking you back to the donation page.</p>
      </div>
    </div>
  );
}
