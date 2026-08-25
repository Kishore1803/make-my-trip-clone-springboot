"use client";

import { useEffect, useState } from "react";
import { Plane, AlertTriangle, CheckCircle, Bell } from "lucide-react";

interface Flight {
  id?: number;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

interface FlightStatusProps {
  flights: Flight[];
}

const FlightStatus = ({ flights }: FlightStatusProps) => {

  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [trackedFlights, setTrackedFlights] = useState<number[]>([]);

  useEffect(() => {

    const initialStatuses: Record<number, string> = {};
    flights.forEach((flight) => {
      if (flight.id) {
        initialStatuses[flight.id] = "On Time";
      }
    });

    setStatuses(initialStatuses);
  }, [flights]);

  const updateFlightStatus = (flightId: number) => {

    const statusList = ["On Time", "Delayed by 1h", "Boarding"];
    const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];

    setStatuses((previous) => ({
      ...previous,
      [flightId]: randomStatus,
    }));
  };

  const trackFlight = (flightId: number) => {
    setTrackedFlights((previous) =>
      previous.includes(flightId) ? previous : [...previous, flightId],
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      flights.forEach((flight) => {
        if (flight.id) {
          updateFlightStatus(flight.id);
        }
      });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [flights]);

  return (
    <div className="space-y-5">
      {flights.map((flight) => {

        const status = flight.id ? statuses[flight.id] : "On Time";
        const isDelayed = status === "Delayed by 1h";
        const isBoarding = status === "Boarding";

        return (
          <div key={flight.id} className="rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Plane className="h-6 w-6 text-blue-600" />

                <div>
                  <h2 className="font-bold text-lg text-black">
                    {flight.flightName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {flight.from} → {flight.to}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${
                  isDelayed
                    ? "bg-red-100 text-red-700"
                    : isBoarding
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {isDelayed ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : isBoarding ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}

                {status}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="font-bold text-xl text-black">
                  {flight.departureTime}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Arrival</p>
                <p className="font-bold text-xl text-black">
                  {flight.arrivalTime}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Flight Status</p>
                <p className="font-medium text-black">
                  {isDelayed
                    ? "Estimated arrival changed"
                    : isBoarding
                      ? "Passengers are boarding"
                      : "Flight is operating on time"}
                </p>
              </div>
            </div>

            {isDelayed && (
              <div className="mt-5 rounded-lg bg-red-50 p-4">
                <p className="font-semibold text-red-700">Delay Information</p>
                <p className="mt-1 text-sm text-gray-600">
                  This flight is delayed by 1 hour due to the late arrival of
                  the incoming aircraft.
                </p>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => flight.id && trackFlight(flight.id)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {flight.id && trackedFlights.includes(flight.id)
                  ? "Tracking"
                  : "Track Flight"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightStatus;
