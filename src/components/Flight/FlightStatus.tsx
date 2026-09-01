"use client";

import { useEffect, useState } from "react";
import {
  Plane,
  AlertTriangle,
  CheckCircle,
  Bell,
  Clock,
} from "lucide-react";

import { getFlightStatus, simulateFlightStatus, trackFlight as trackFlightApi, stopTrackingFlight } from "@/api/flight-status-api";

interface Flight {
  id: number;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

interface FlightStatusData {
  id: number;
  status: string;
  delayMinutes: number;
  delayReason: string;
  estimatedDeparture: string;
  estimatedArrival: string;
  updatedAt: string;
  flight: Flight;
}

interface FlightStatusProps {flights?: Flight[];}

const FlightStatus = ({flights: initialFlights = [],}: FlightStatusProps) => {
  const [flights, setFlights] = useState<Flight[]>(
    initialFlights
  );

  const [statuses, setStatuses] = useState<Record<number, FlightStatusData>>({});
  const [trackedFlights, setTrackedFlights] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingFlight, setUpdatingFlight] = useState<number | null>(null);
  const [error, setError] = useState("");
  const userId = 1;
  const loadFlightStatuses = async () => {

    try {
      setLoading(true);
      setError("");
      const data = await getFlightStatus();
      if (!Array.isArray(data)) {
        return;
      }
      const statusMap: Record<number,FlightStatusData> = {};
      const flightList: Flight[] = [];
      data.forEach((item: FlightStatusData) => {
        if (!item.flight) {
          return;
        }
        statusMap[item.flight.id] = item;
        flightList.push(item.flight);
      });
      setStatuses(statusMap);
      setFlights(flightList);
    } catch (error) {
      console.error(
        "Unable to load flight statuses:",
        error
      );
      setError(
        "Unable to load flight status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlightStatuses();
  }, []);

  const getCurrentStatus = (
    flightId: number
  ): FlightStatusData | null => {
    return statuses[flightId] || null;
  };

  const updateFlightStatus = async (flightId: number) => {
    try {
      setUpdatingFlight(flightId);
      const updatedStatus =
        await simulateFlightStatus(flightId);
      setStatuses((previous) => ({
        ...previous,
        [flightId]: updatedStatus,
      }));
    } catch (error) {
      console.error(
        "Flight status update failed:",
        error
      );
    } finally {
      setUpdatingFlight(null);
    }
  };

  const trackFlight = async (flightId: number) => {
    try {
      if (trackedFlights.includes(flightId)) {
        await stopTrackingFlight(
          flightId,
          userId
        );
        setTrackedFlights((previous) =>
          previous.filter(
            (id) => id !== flightId
          )
        );

        return;
      }
      await trackFlightApi(
        flightId,
        userId
      );
      setTrackedFlights((previous) => [
        ...previous,
        flightId,
      ]);
    } catch (error) {
      console.error(
        "Unable to track flight:",
        error
      );
    }
  };

  const formatDateTime = (value: string | undefined) => {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusStyle = (status: string) => {
    if (
      status === "Delayed" ||
      status === "Delayed by 1h"
    ) {
      return "bg-red-100 text-red-700";
    }
    if (status === "Boarding") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-green-100 text-green-700";
  };

  const getStatusIcon = (status: string) => {
    if (
      status === "Delayed" ||
      status === "Delayed by 1h"
    ) {
      return (
        <AlertTriangle className="h-4 w-4" />
      );
    }

    if (status === "Boarding") {
      return (
        <Bell className="h-4 w-4" />
      );
    }

    return (
      <CheckCircle className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <p className="text-gray-600">
          Loading flight status...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <p className="text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={loadFlightStatuses}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {flights.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="text-gray-500">
            No flights available.
          </p>
        </div>
      )}

      {flights.map((flight) => {

        const flightStatus = getCurrentStatus(flight.id);
        const status = flightStatus?.status || "On Time";
        const delayMinutes = flightStatus?.delayMinutes || 0;
        const delayReason = flightStatus?.delayReason || "Flight is operating as scheduled.";
        const isDelayed = status === "Delayed" || status === "Delayed by 1h";
        const isBoarding = status === "Boarding";
        const isTracked = trackedFlights.includes(flight.id);

        return (
          <div
            key={flight.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Plane className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-black">
                    {flight.flightName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {flight.from} → {flight.to}
                  </p>
                </div>
              </div>

              <div
                className={`flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${getStatusStyle(
                  status
                )}`}
              >
                {getStatusIcon(status)}
                {isDelayed
                  ? `Delayed by ${delayMinutes / 60}h`
                  : status}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">
                  Departure
                </p>
                <p className="mt-1 text-xl font-bold text-black">
                  {flightStatus ? formatDateTime(flightStatus.estimatedDeparture): flight.departureTime}
                </p>
                {isDelayed && (
                  <p className="mt-1 text-xs text-gray-400">
                    Scheduled:{" "}
                    {flight.departureTime}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Arrival
                </p>
                <p className="mt-1 text-xl font-bold text-black">
                  {flightStatus? formatDateTime(flightStatus.estimatedArrival): flight.arrivalTime}
                </p>

                {isDelayed && (
                  <p className="mt-1 text-xs text-gray-400">
                    Scheduled:{" "}
                    {flight.arrivalTime}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Flight Status
                </p>

                <p className="mt-1 font-medium text-black">
                  {isDelayed
                    ? "Estimated arrival changed"
                    : isBoarding
                      ? "Passengers are boarding"
                      : "Flight is operating on time"}
                </p>

                {flightStatus && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    Updated{" "}
                    {formatDateTime(
                      flightStatus.updatedAt
                    )}
                  </p>
                )}
              </div>
            </div>

            {isDelayed && (
              <div className="mt-5 rounded-lg bg-red-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-700">
                      Delay Information
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {delayReason}
                    </p>
                    <p className="mt-2 text-sm font-medium text-red-700">
                      Delay: {delayMinutes} minutes
                    </p>
                    {flightStatus && (
                      <>
                        <p className="text-sm font-medium text-red-700">
                          Revised departure:{" "}
                          {formatDateTime(
                            flightStatus.estimatedDeparture
                          )}
                        </p>
                        <p className="text-sm font-medium text-red-700">
                          Revised arrival:{" "}
                          {formatDateTime(
                            flightStatus.estimatedArrival
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isBoarding && (
              <div className="mt-5 rounded-lg bg-yellow-50 p-4">
                <div className="flex gap-3">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-700">
                      Boarding Now
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Passengers are currently
                      boarding this flight.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Flight ID
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {flight.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Price
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    ₹
                    {flight.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Available Seats
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {flight.availableSeats}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  trackFlight(flight.id)
                }
                className={`rounded-lg px-5 py-2 text-sm font-medium ${
                  isTracked
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isTracked
                  ? "Tracking"
                  : "Track Flight"}
              </button>

              <button
                type="button"
                onClick={() =>
                  updateFlightStatus(
                    flight.id
                  )
                }
                disabled={
                  updatingFlight === flight.id
                }
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {updatingFlight === flight.id
                  ? "Updating..."
                  : "Simulate Update"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightStatus;