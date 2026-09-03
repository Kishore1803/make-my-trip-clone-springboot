"use client";

import { useEffect, useState } from "react";

import {
  getFlightStatusById,
  simulateFlightStatus,
  trackFlight,
  stopTrackingFlight,
  getTrackedFlights,
} from "@/api/flight-status-tracking-api";

interface Flight {
  id: number;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
}

interface FlightStatus {
  id: number;
  flight: Flight;
  status: string;
  delayMinutes: number;
  delayReason: string;
  estimatedDeparture: string;
  estimatedArrival: string;
  updatedAt: string;
}

interface FlightTracking {
  id: number;
  flightId: number;
  flightNumber: string;
  status: string;
  reason: string;
  departureTime: string;
  arrivalTime: string;
  estimatedArrivalTime: string;
  lastUpdated: string;
}

interface FlightTrackingProps {
  userId: number;
}

const availableFlights: Flight[] = [
  {
    id: 1,
    flightName: "IndiGo 6E-201",
    from: "Chennai",
    to: "Delhi",
    departureTime: "06:30",
    arrivalTime: "09:20",
  },
  {
    id: 2,
    flightName: "Air India AI-302",
    from: "Mumbai",
    to: "Delhi",
    departureTime: "08:15",
    arrivalTime: "10:45",
  },
  {
    id: 3,
    flightName: "Vistara UK-820",
    from: "Bengaluru",
    to: "Mumbai",
    departureTime: "10:30",
    arrivalTime: "12:15",
  },
  {
    id: 4,
    flightName: "Emirates EK-543",
    from: "Dubai",
    to: "London",
    departureTime: "11:30",
    arrivalTime: "15:45",
  },
  {
    id: 5,
    flightName: "Qatar Airways QR-528",
    from: "Delhi",
    to: "Doha",
    departureTime: "14:20",
    arrivalTime: "16:40",
  },
  {
    id: 6,
    flightName: "Singapore Airlines SQ-423",
    from: "Chennai",
    to: "Singapore",
    departureTime: "18:10",
    arrivalTime: "00:55",
  },
  {
    id: 7,
    flightName: "Air India AI-984",
    from: "Delhi",
    to: "Dubai",
    departureTime: "21:00",
    arrivalTime: "23:30",
  },
  {
    id: 8,
    flightName: "IndiGo 6E-608",
    from: "Kolkata",
    to: "Chennai",
    departureTime: "07:45",
    arrivalTime: "10:15",
  },
  {
    id: 9,
    flightName: "Akasa Air QP-142",
    from: "Hyderabad",
    to: "Bengaluru",
    departureTime: "12:30",
    arrivalTime: "13:35",
  },
  {
    id: 10,
    flightName: "British Airways BA-142",
    from: "Mumbai",
    to: "London",
    departureTime: "23:10",
    arrivalTime: "05:30",
  },
];

const FlightTracking = ({ userId }: FlightTrackingProps) => {

  const [flights, setFlights] = useState<FlightStatus[]>([]);
  const [trackedFlights, setTrackedFlights] = useState<FlightTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState<number | null>(null);
  const [simulatingId, setSimulatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadFlights = async () => {
    try {
      setError("");

      const results = await Promise.all(
        availableFlights.map(async (flight) => {

          try {
            const statusResponse = await getFlightStatusById(flight.id);

            return {
              id: flight.id,
              flight,
              status: statusResponse.status || "ON_TIME",
              delayMinutes: statusResponse.delayMinutes || 0,
              delayReason: statusResponse.delayReason || "",
              estimatedDeparture: statusResponse.departureTime || flight.departureTime || "",
              estimatedArrival: statusResponse.arrivalTime || flight.arrivalTime || "",
              updatedAt: statusResponse.lastUpdated || new Date().toISOString(),
            };
          } catch (error) {

            console.error(`Failed to load status for flight ${flight.id}:`,error);

            return {
              id: flight.id,
              flight,
              status: "ON_TIME",
              delayMinutes: 0,
              delayReason: "",
              estimatedDeparture: flight.departureTime,
              estimatedArrival: flight.arrivalTime,
              updatedAt: new Date().toISOString(),
            };
          }
        })
      );

      setFlights(results);

    } catch (error) {
      console.error("Failed to load flight statuses:", error);
      setFlights([]);
      setError("Unable to load flight status.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrackedFlights = async () => {
    try {
      const data = await getTrackedFlights();

      if (Array.isArray(data)) {
        setTrackedFlights(data);
      } else {
        console.error("Tracked flights response is not an array:", data);
        setTrackedFlights([]);
      }
    } catch (error) {
      console.error("Failed to load tracked flights:", error);
      setTrackedFlights([]);
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
      (tracked) => tracked.flightId === flightId
    );
  };

  const handleTrack = async (flightId: number) => {
    try {
      setTrackingId(flightId);
      const selectedFlight = flights.find(
        (item) => item.flight.id === flightId
      );

      const status = selectedFlight?.status || "ON_TIME";
      await trackFlight(flightId, status);
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
      await stopTrackingFlight(flightId);
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
    switch (status?.toUpperCase()) {
      case "ON_TIME":
      case "ON TIME":
        return "On Time";

      case "DELAYED":
        return "Delayed";

      case "BOARDING":
        return "Boarding";

      case "CANCELLED":
        return "Cancelled";

      case "DEPARTED":
        return "Departed";

      case "ARRIVED":
        return "Arrived";

      default:
        return status || "Unknown";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ON_TIME":
      case "ON TIME":
        return "bg-green-100 text-green-700";

      case "DELAYED":
        return "bg-red-100 text-red-700";

      case "BOARDING":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700";

      case "DEPARTED":
        return "bg-purple-100 text-purple-700";

      case "ARRIVED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">
          Loading flight status...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <p className="text-center text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center">
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
            {trackedFlights.map((tracked) => {
              const flight = availableFlights.find(
                (item) => item.id === tracked.flightId
              );

              return (
                <div
                  key={tracked.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {flight?.flightName ||
                          tracked.flightNumber ||
                          "Flight"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {flight?.from || ""} → {flight?.to || ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        tracked.status
                      )}`}
                    >
                      {getStatusText(tracked.status)}
                    </span>
                  </div>

                  {tracked.status?.toUpperCase() === "DELAYED" && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3">
                      <p className="font-semibold text-red-700">
                        Flight Delayed
                      </p>
                      <p className="mt-1 text-sm text-red-600">
                        {tracked.reason || "Delay information unavailable"}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Departure
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {tracked.departureTime || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Estimated Arrival
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {tracked.estimatedArrivalTime || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-400">
                      Last updated:{" "}
                      {formatDateTime(tracked.lastUpdated)}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleStopTracking(tracked.flightId)}
                      disabled={trackingId === tracked.flightId}
                      className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {trackingId === tracked.flightId
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
          <h2 className="text-xl font-bold text-gray-800">
            Available Flights
          </h2>
          <p className="text-sm text-gray-500">
            Select a flight to start tracking it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {Array.isArray(flights) &&
            flights.map((status) => {
              const flight = status.flight;
              if (!flight) {
                return null;
              }

              const tracked = isTracked(flight.id);

              return (
                <div
                  key={flight.id}
                  className="rounded-xl bg-white p-5 shadow-md"
                >
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
                        status.status
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
                        Reason:{" "}
                        {status.delayReason ||
                          "Delay reason unavailable"}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-gray-500">
                        Departure
                      </p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {status.estimatedDeparture ||
                          flight.departureTime}
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-gray-500">
                        Arrival
                      </p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {status.estimatedArrival ||
                          flight.arrivalTime}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    Last updated:{" "}
                    {formatDateTime(status.updatedAt)}
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