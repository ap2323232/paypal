"use client";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("10.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePayPalPayment = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create PayPal order
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: "USD",
          donor: {
            firstName: "Test",
            lastName: "User",
            isAnonymous: false,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create PayPal order");
      }

      // Redirect to PayPal
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      } else {
        throw new Error("No PayPal approval URL received");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
      console.error("PayPal payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Support Vision Care
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Help us provide vision care around the world
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount (USD)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="10.00"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <button
              onClick={handlePayPalPayment}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Donate with PayPal"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Powered by{" "}
            <a
              href="https://www.eyereach.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Eye Reach
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
