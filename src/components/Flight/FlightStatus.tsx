"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FlightStatus {
  id: number;
  flightName: string;
  from: string;
  to: string;
  status: string;
  delay?: string;
  delayReason?: string;
  departureTime: string;
  arrivalTime: string;
}

const FlightStatusPage = () => {
  const [flights, setFlights] = useState<FlightStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlightStatus();
  }, []);

  const fetchFlightStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/flight-status");
      setFlights(response.data);
    } catch (error) {
      console.error("Failed to fetch flight status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading flight status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Live Flight Status
        </h1>
        <p className="mb-6 text-gray-500">
          Track the latest status and updates for your flights.
        </p>

        <div className="grid gap-5">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="rounded-xl bg-white p-6 shadow-md"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {flight.flightName}
                  </h2>
                  <p className="mt-1 text-gray-500">
                    {flight.from} → {flight.to}
                  </p>
                </div>
                <div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      flight.status === "DELAYED"
                        ? "bg-red-100 text-red-700"
                        : flight.status === "BOARDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {flight.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 border-t pt-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Departure
                  </p>
                  <p className="font-semibold text-gray-800">
                    {flight.departureTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Estimated Arrival
                  </p>
                  <p className="font-semibold text-gray-800">
                    {flight.arrivalTime}
                  </p>
                </div>
              </div>

              {flight.status === "DELAYED" && (
                <div className="mt-5 rounded-lg bg-red-50 p-4">
                  <p className="font-semibold text-red-700">
                    Delayed {flight.delay}
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    Reason: {flight.delayReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightStatusPage;