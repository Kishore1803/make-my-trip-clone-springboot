"use client";

import { useEffect, useState } from "react";
import { getFlightStatus, simulateFlightStatus, trackFlight, stopTrackingFlight, getTrackedFlights } from "@/api/flight-status-api";

interface Flight {
  id: number;
  flightName: string;
  from: string;
  to: string;
  departureDate?: string;
  departureTime?: string;
  arrivalTime?: string;
}

interface FlightStatus {
  id: number;
  flight?: Flight;
  status: string;
  delayMinutes: number;
  delayReason: string;
  estimatedDeparture: string;
  estimatedArrival: string;
  updatedAt: string;
}

interface FlightTrackingProps {
  userId: number;
}

const FlightTracking = ({ userId }: FlightTrackingProps) => {

  const [flights, setFlights] = useState<FlightStatus[]>([]);
  const [trackedFlights, setTrackedFlights] = useState<FlightStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [simulatingId, setSimulatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadFlights = async () => {
    try {
      const data = await getFlightStatus();
      setFlights(data);
      setError("");
    } catch (error) {
      console.error("Failed to load flight statuses:", error);
      setError("Unable to load flight status.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrackedFlights = async () => {
    try {
      const data = await getTrackedFlights(userId);
      setTrackedFlights(data);
    } catch (error) {
      console.error("Failed to load tracked flights:", error);
    }
  };

  useEffect(() => {
    loadFlights();
    loadTrackedFlights();

    const interval = setInterval(() => {
      loadFlights();
      loadTrackedFlights();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  const isTracked = (flightId: number) => {
    return trackedFlights.some(
      (flight) => flight.flight?.id === flightId || flight.id === flightId,
    );
  };

  const handleTrack = async (flightId: number) => {
    try {
      setTrackingId(flightId);
      await trackFlight(flightId, userId);
      await loadTrackedFlights();
      alert("Flight added to tracking.");

    } catch (error) {
      console.error("Track flight error:", error);
      alert("Unable to track this flight.");

    } finally {
      setTrackingId(null);
    }
  };

  const handleStopTracking = async (flightId: number) => {
    try {
      setTrackingId(flightId);
      await stopTrackingFlight(flightId, userId);
      await loadTrackedFlights();
      alert("Flight removed from tracking.");

    } catch (error) {
      console.error("Stop tracking error:", error);
      alert("Unable to stop tracking this flight.");

    } finally {
      setTrackingId(null);
    }
  };

  const handleSimulate = async (flightId: number) => {
    try {
      setSimulatingId(flightId);
      await simulateFlightStatus(flightId);
      await loadFlights();
      await loadTrackedFlights();
      alert("Flight status updated.");

    } catch (error) {
      console.error("Simulation error:", error);
      alert("Unable to update flight status.");

    } finally {
      setSimulatingId(null);
    }
  };

  const formatDateTime = (value: string) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "On Time";

      case "DELAYED":
        return "Delayed";

      case "BOARDING":
        return "Boarding";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "bg-green-100 text-green-700";

      case "DELAYED":
        return "bg-red-100 text-red-700";

      case "BOARDING":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading flight status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Live Flight Tracking
        </h1>
        <p className="mt-2 text-gray-500">
          Track your flights and view the latest flight status.
        </p>
      </div>

      {trackedFlights.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              My Tracked Flights
            </h2>
            <p className="text-sm text-gray-500">
              Flights you are currently tracking
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {trackedFlights.map((status) => {
              const flight = status.flight;

              return (
                <div
                  key={status.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {flight?.flightName || "Flight"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {flight?.from} → {flight?.to}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        status.status,
                      )}`}
                    >
                      {getStatusText(status.status)}
                    </span>
                  </div>

                  {status.delayMinutes > 0 && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3">
                      <p className="font-semibold text-red-700">
                        Delayed by {status.delayMinutes} minutes
                      </p>
                      <p className="mt-1 text-sm text-red-600">
                        {status.delayReason}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Estimated Departure
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDateTime(status.estimatedDeparture)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Estimated Arrival</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDateTime(status.estimatedArrival)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        handleStopTracking(flight?.id || status.id)
                      }
                      disabled={trackingId === (flight?.id || status.id)}
                      className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {trackingId === (flight?.id || status.id)
                        ? "Removing..."
                        : "Stop Tracking"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Available Flights</h2>
          <p className="text-sm text-gray-500">
            Select a flight to start tracking it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {flights.map((status) => {
            const flight = status.flight;

            if (!flight) {
              return null;
            }

            const tracked = isTracked(flight.id);

            return (
              <div
                key={status.id}
                className="rounded-xl bg-white p-5 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {flight.flightName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {flight.from} → {flight.to}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      status.status,
                    )}`}
                  >
                    {getStatusText(status.status)}
                  </span>
                </div>

                {status.delayMinutes > 0 && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4">
                    <p className="font-semibold text-red-700">
                      Delayed by {status.delayMinutes} minutes
                    </p>
                    <p className="mt-1 text-sm text-red-600">
                      Reason: {status.delayReason}
                    </p>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-gray-500">Estimated Departure</p>
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      {formatDateTime(status.estimatedDeparture)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-gray-500">Estimated Arrival</p>
                    <p className="mt-2 text-sm font-semibold text-gray-800">
                      {formatDateTime(status.estimatedArrival)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Last updated: {formatDateTime(status.updatedAt)}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {tracked ? (
                    <button
                      onClick={() => handleStopTracking(flight.id)}
                      disabled={trackingId === flight.id}
                      className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {trackingId === flight.id
                        ? "Removing..."
                        : "Stop Tracking"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTrack(flight.id)}
                      disabled={trackingId === flight.id}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {trackingId === flight.id
                        ? "Tracking..."
                        : "Track Flight"}
                    </button>
                  )}

                  <button
                    onClick={() => handleSimulate(flight.id)}
                    disabled={simulatingId === flight.id}
                    className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                  >
                    {simulatingId === flight.id
                      ? "Updating..."
                      : "Update Status"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {flights.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">
            No flight status available
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Flight status information will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightTracking;
