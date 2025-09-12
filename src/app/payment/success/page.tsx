"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const capturePayment = async () => {
      const orderID = searchParams.get("token");

      if (!orderID) {
        setError("No order ID found in URL");
        setPaymentStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderID }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment capture failed");
        }

        if (data.status === "COMPLETED") {
          setPaymentStatus("success");
        } else {
          setError(`Payment status: ${data.status}`);
          setPaymentStatus("error");
        }
      } catch (err: any) {
        setError(err.message || "Payment capture failed");
        setPaymentStatus("error");
        console.error("Payment capture error:", err);
      }
    };

    capturePayment();
  }, [searchParams]);

  // Auto-redirect countdown
  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.location.href = "https://www.eyereach.org/";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {paymentStatus === "processing" && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          )}

          {paymentStatus === "success" && (
            <div className="text-green-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}

          {paymentStatus === "error" && (
            <div className="text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {paymentStatus === "processing" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Processing Payment...
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your payment.
              </p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Thank You for Your Donation!
              </h2>
              <p className="text-gray-600 mb-4">
                Your generous contribution has been processed successfully and
                will help us continue our mission of providing vision care
                around the world.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Redirecting to Eye Reach in {countdown} seconds...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {paymentStatus === "error" && (
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {paymentStatus === "success" && (
              <a
                href="https://www.eyereach.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Back to Home
              </a>
            )}
            {paymentStatus !== "success" && (
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
