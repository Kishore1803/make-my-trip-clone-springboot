"use client";

import { useEffect, useState } from "react";
import {
  Plane,
  Clock,
  MapPin,
  RefreshCw,
  Bell,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

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
  status: string;
  delayMinutes: number;
  delayReason: string;
}

const defaultFlights: Flight[] = [
  {
    id: 1,
    flightName: "IndiGo 6E-201",
    from: "Chennai",
    to: "Delhi",
    departureTime: "06:30",
    arrivalTime: "09:20",
    price: 4899,
    availableSeats: 45,
  },
  {
    id: 2,
    flightName: "Air India AI-302",
    from: "Mumbai",
    to: "Delhi",
    departureTime: "08:15",
    arrivalTime: "10:45",
    price: 5999,
    availableSeats: 40,
  },
  {
    id: 3,
    flightName: "Vistara UK-820",
    from: "Bengaluru",
    to: "Mumbai",
    departureTime: "10:30",
    arrivalTime: "12:15",
    price: 4599,
    availableSeats: 35,
  },
  {
    id: 4,
    flightName: "Emirates EK-543",
    from: "Dubai",
    to: "London",
    departureTime: "11:30",
    arrivalTime: "15:45",
    price: 58999,
    availableSeats: 25,
  },
  {
    id: 5,
    flightName: "Qatar Airways QR-528",
    from: "Delhi",
    to: "Doha",
    departureTime: "14:20",
    arrivalTime: "16:40",
    price: 32999,
    availableSeats: 30,
  },
  {
    id: 6,
    flightName: "Singapore Airlines SQ-423",
    from: "Chennai",
    to: "Singapore",
    departureTime: "18:10",
    arrivalTime: "00:55",
    price: 28999,
    availableSeats: 28,
  },
  {
    id: 7,
    flightName: "Air India AI-984",
    from: "Delhi",
    to: "Dubai",
    departureTime: "21:00",
    arrivalTime: "23:30",
    price: 24999,
    availableSeats: 32,
  },
  {
    id: 8,
    flightName: "IndiGo 6E-608",
    from: "Kolkata",
    to: "Chennai",
    departureTime: "07:45",
    arrivalTime: "10:15",
    price: 5299,
    availableSeats: 42,
  },
  {
    id: 9,
    flightName: "Akasa Air QP-142",
    from: "Hyderabad",
    to: "Bengaluru",
    departureTime: "12:30",
    arrivalTime: "13:35",
    price: 3499,
    availableSeats: 38,
  },
  {
    id: 10,
    flightName: "British Airways BA-142",
    from: "Mumbai",
    to: "London",
    departureTime: "23:10",
    arrivalTime: "05:30",
    price: 64999,
    availableSeats: 20,
  },
];

const FlightStatusPage = () => {
  const [flights] = useState<Flight[]>(defaultFlights);
  const [statuses, setStatuses] = useState<Record<number, FlightStatusData>>({
    1: {
      status: "Delayed by 1h",
      delayMinutes: 60,
      delayReason: "Late arrival of incoming aircraft.",
    },
  });

  const [trackedFlights, setTrackedFlights] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getCurrentStatus = (flightId: number): FlightStatusData => {
    return (
      statuses[flightId] || {
        status: "On Time",
        delayMinutes: 0,
        delayReason: "Flight is operating as scheduled.",
      }
    );
  };

  const updateFlightStatus = (flightId: number) => {
  const statusList = ["On Time", "Delayed by 1h", "Boarding"];
  const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];

    let newStatus: FlightStatusData;

    if (randomStatus === "Delayed by 1h") {
      newStatus = {
        status: "Delayed by 1h",
        delayMinutes: 60,
        delayReason: "Late arrival of incoming aircraft.",
      };
    } else if (randomStatus === "Boarding") {
      newStatus = {
        status: "Boarding",
        delayMinutes: 0,
        delayReason: "Passengers are currently boarding.",
      };
    } else {
      newStatus = {
        status: "On Time",
        delayMinutes: 0,
        delayReason: "Flight is operating as scheduled.",
      };
    }

    setStatuses((previous) => ({
      ...previous,
      [flightId]: newStatus,
    }));

    if (trackedFlights.includes(flightId)) {
      const flight = flights.find((item) => item.id === flightId);

      if (flight) {
        setNotifications((previous) => [
          `${flight.flightName} - ${newStatus.status}`,
          ...previous,
        ]);
      }
    }
  };

  const refreshStatuses = () => {
    setRefreshing(true);

    flights.forEach((flight) => {
      updateFlightStatus(flight.id);
    });

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      flights.forEach((flight) => {
        updateFlightStatus(flight.id);
      });
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [flights, trackedFlights]);


  const trackFlight = (flightId: number) => {
    const flight = flights.find((item) => item.id === flightId);

    if (trackedFlights.includes(flightId)) {
      setTrackedFlights((previous) => previous.filter((id) => id !== flightId));
      return;
    }

    setTrackedFlights((previous) => [...previous, flightId]);

    if (flight) {
      setNotifications((previous) => [
        `${flight.flightName} is now being tracked.`,
        ...previous,
      ]);
    }
  };

  const format12Hour = (time: string) => {
    const [hoursString, minutesString] = time.split(":");
    let hours = Number(hoursString);
    const minutes = Number(minutesString);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatTime = (time: string, delayMinutes: number) => {
    const [hoursString, minutesString] = time.split(":");
    let totalMinutes = Number(hoursString) * 60 + Number(minutesString);
    totalMinutes += delayMinutes;
    totalMinutes = totalMinutes % (24 * 60);
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    let hours12 = hours24 % 12;

    if (hours12 === 0) {
      hours12 = 12;
    }
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getStatusStyle = (status: string) => {
    if (status === "Delayed by 1h") {
      return "bg-red-100 text-red-700";
    }
    if (status === "Boarding") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-green-100 text-green-700";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Delayed by 1h") {
      return <AlertTriangle className="h-4 w-4" />;
    }
    if (status === "Boarding") {
      return <Bell className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  const delayedFlights = flights.filter((flight) => {
    const status = getCurrentStatus(flight.id);
    return status.status === "Delayed by 1h";
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Live Flight Status
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Track your flights and get live updates
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={refreshStatuses}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Status
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Flights</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {flights.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Delayed Flights</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {delayedFlights}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tracked Flights</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {trackedFlights.length}
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Bell className="h-5 w-5 text-blue-600" />
                Notifications
              </h2>

              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={`${notification}-${index}`}
                  className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700"
                >
                  {notification}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {flights.map((flight) => {

            const flightStatus = getCurrentStatus(flight.id);
            const isDelayed = flightStatus.status === "Delayed by 1h";
            const isBoarding = flightStatus.status === "Boarding";
            const isTracked = trackedFlights.includes(flight.id);
            const departureTime = formatTime( flight.departureTime, flightStatus.delayMinutes);
            const arrivalTime = formatTime(flight.arrivalTime, flightStatus.delayMinutes);

            return (
              <div
                key={flight.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Plane className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {flight.flightName}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {flight.from} → {flight.to}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                      flightStatus.status,
                    )}`}
                  >
                    {getStatusIcon(flightStatus.status)}

                    {flightStatus.status}
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {departureTime}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {flight.from}
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Scheduled: {format12Hour(flight.departureTime)}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <Plane className="h-7 w-7 rotate-90 text-blue-600" />

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      Live Status
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-gray-500">Estimated Arrival</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {arrivalTime}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600 md:justify-end">
                      <MapPin className="h-4 w-4" />
                      {flight.to}
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Scheduled: {format12Hour(flight.arrivalTime)}
                    </p>
                  </div>
                </div>

                {isDelayed && (
                  <div className="mt-6 rounded-lg bg-red-50 p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />

                      <div>
                        <p className="font-semibold text-red-700">
                          Flight Delayed
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {flightStatus.delayReason}
                        </p>

                        <p className="mt-2 text-sm font-medium text-red-700">
                          Revised departure: {departureTime}
                        </p>

                        <p className="text-sm font-medium text-red-700">
                          Revised arrival: {arrivalTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isBoarding && (
                  <div className="mt-6 rounded-lg bg-yellow-50 p-4">
                    <div className="flex gap-3">
                      <Bell className="h-5 w-5 text-yellow-600" />

                      <div>
                        <p className="font-semibold text-yellow-700">
                          Boarding Now
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Passengers are currently boarding this flight.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Flight ID</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {flight.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="mt-1 font-medium text-gray-900">
                        ₹{flight.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Available Seats</p>
                      <p className="mt-1 font-medium text-gray-900">
                        {flight.availableSeats}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => trackFlight(flight.id)}
                    className={`rounded-lg px-5 py-3 text-sm font-medium ${
                      isTracked
                        ? "bg-gray-600 text-white hover:bg-gray-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isTracked ? "Tracking" : "Track Flight"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((previous) => [
                        `${flight.flightName}: ${flightStatus.status}`,
                        ...previous,
                      ])
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Bell className="h-4 w-4" />
                    Get Updates
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FlightStatusPage;
