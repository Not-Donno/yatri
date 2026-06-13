"use client";

import { useState } from "react";
import { api } from "@/lib/axios";

export default function CustomerDashboard() {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const createRequest = async () => {
    if (!issue) return alert("Please describe your issue");

    setLoading(true);

    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          const res = await api.post("/requests", {
            issue,
            latitude,
            longitude,
          });

          setRequestId(res.data.requestId);
        },
        () => {
          alert("Location permission required");
        }
      );
    } catch (err) {
      alert("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        Customer Dashboard
      </h1>

      {/* CREATE REQUEST */}
      {!requestId && (
        <div className="bg-white p-4 rounded shadow max-w-md">
          <textarea
            placeholder="Describe your issue (flat tyre, battery, etc.)"
            className="w-full border p-2 rounded mb-3"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />

          <button
            onClick={createRequest}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Finding mechanic..." : "Request Mechanic"}
          </button>
        </div>
      )}

      {/* ACTIVE REQUEST */}
      {requestId && (
        <div className="bg-white p-4 rounded shadow max-w-md">
          <h2 className="font-semibold text-lg">
            Request Created 🚗
          </h2>

          <p className="mt-2">
            Request ID:
          </p>

          <code className="text-sm bg-gray-200 p-1 rounded block mt-1">
            {requestId}
          </code>

          <p className="mt-3 text-blue-600">
            Waiting for mechanic...
          </p>
        </div>
      )}
    </div>
  );
}