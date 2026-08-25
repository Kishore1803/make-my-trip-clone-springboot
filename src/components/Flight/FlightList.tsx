"use client";

import { useEffect, useState } from "react";
import { getFlights, addflight, deleteflight } from "@/api";

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

interface FlightListProps {
  onAdd?: () => void;
  onEdit?: (flight: Flight) => void;
}

const defaultFlights: Omit<Flight, "id">[] = [
  {
    flightName: "IndiGo 6E-201",
    from: "Chennai",
    to: "Delhi",
    departureTime: "06:30",
    arrivalTime: "09:20",
    price: 4899,
    availableSeats: 45,
  },
  {
    flightName: "Air India AI-302",
    from: "Mumbai",
    to: "Delhi",
    departureTime: "08:15",
    arrivalTime: "10:45",
    price: 5999,
    availableSeats: 40,
  },
  {
    flightName: "Vistara UK-820",
    from: "Bengaluru",
    to: "Mumbai",
    departureTime: "10:30",
    arrivalTime: "12:15",
    price: 4599,
    availableSeats: 35,
  },
  {
    flightName: "Emirates EK-543",
    from: "Dubai",
    to: "London",
    departureTime: "11:30",
    arrivalTime: "15:45",
    price: 58999,
    availableSeats: 25,
  },
  {
    flightName: "Qatar Airways QR-528",
    from: "Delhi",
    to: "Doha",
    departureTime: "14:20",
    arrivalTime: "16:40",
    price: 32999,
    availableSeats: 30,
  },
  {
    flightName: "Singapore Airlines SQ-423",
    from: "Chennai",
    to: "Singapore",
    departureTime: "18:10",
    arrivalTime: "00:55",
    price: 28999,
    availableSeats: 28,
  },
  {
    flightName: "Air India AI-984",
    from: "Delhi",
    to: "Dubai",
    departureTime: "21:00",
    arrivalTime: "23:30",
    price: 24999,
    availableSeats: 32,
  },
  {
    flightName: "IndiGo 6E-608",
    from: "Kolkata",
    to: "Chennai",
    departureTime: "07:45",
    arrivalTime: "10:15",
    price: 5299,
    availableSeats: 42,
  },
  {
    flightName: "Akasa Air QP-142",
    from: "Hyderabad",
    to: "Bengaluru",
    departureTime: "12:30",
    arrivalTime: "13:35",
    price: 3499,
    availableSeats: 38,
  },
  {
    flightName: "British Airways BA-142",
    from: "Mumbai",
    to: "London",
    departureTime: "23:10",
    arrivalTime: "05:30",
    price: 64999,
    availableSeats: 20,
  },
];

const FlightList = ({ onAdd, onEdit }: FlightListProps) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFlights, setCreatingFlights] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadFlights = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFlights();
      console.log("Flights from backend:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid flight response from backend");
      }

      if (data.length > 0) {
        setFlights(data);
        return;
      }

      setCreatingFlights(true);
      console.log("No flights found. Creating 10 default flights...");

      for (const flight of defaultFlights) {
        try {
          await addflight(
            flight.flightName,
            flight.from,
            flight.to,
            flight.departureTime,
            flight.arrivalTime,
            flight.price,
            flight.availableSeats,
          );
        } catch (error) {
          console.error("Failed to create flight:", flight.flightName, error);
        }
      }

      const updatedFlights = await getFlights();

      if (Array.isArray(updatedFlights)) {
        setFlights(updatedFlights);
      } else {
        setFlights([]);
      }
    } catch (error: any) {
      console.error("Failed to load flights:", error);
      console.error("Status:", error?.response?.status);
      console.error("Backend response:", error?.response?.data);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load flights.",
      );
    } finally {
      setLoading(false);
      setCreatingFlights(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this flight?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteflight(id);
      setFlights((previousFlights) =>
        previousFlights.filter((flight) => flight.id !== id),
      );

      alert("Flight deleted successfully!");
    } catch (error: any) {
      console.error("Delete flight error:", error);
      alert(error?.response?.data?.message || "Failed to delete flight.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-xl bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-500">
            {creatingFlights ? "Creating 10 flights..." : "Loading flights..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-xl font-bold text-red-600">
          Failed to load flights
        </h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>

        <button
          type="button"
          onClick={loadFlights}
          className="mt-5 bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-lg md:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Flight List</h2>
          <p className="mt-1 text-xs text-gray-500">Flights stored in MySQL</p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="bg-blue-600 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700"
        >
          + ADD FLIGHT
        </button>
      </div>

      {flights.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-10 text-center">
          <h3 className="font-semibold text-gray-700">No Flights Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Add a new flight to the system.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  Flight Name
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  From
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  To
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  Departure
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  Arrival
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  Price / Ticket
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase text-gray-700">
                  Seats
                </th>
                <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr
                  key={flight.id ?? `${flight.flightName}-${index}`}
                  className="border-b border-gray-200 transition hover:bg-gray-50"
                >
                  <td className="px-3 py-3 text-xs font-semibold text-gray-800">
                    {flight.flightName}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700">
                    {flight.from}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700">
                    {flight.to}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700">
                    {flight.departureTime}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700">
                    {flight.arrivalTime}
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-gray-800">
                    ₹{Number(flight.price).toLocaleString("en-IN")}
                  </td>

                  <td className="px-3 py-3 text-xs font-semibold">
                    <span
                      className={
                        flight.availableSeats <= 5
                          ? "text-red-600"
                          : flight.availableSeats <= 10
                            ? "text-orange-500"
                            : "text-gray-800"
                      }
                    >
                      {flight.availableSeats}
                    </span>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(flight)}
                        className="bg-blue-600 px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-700"
                      >
                        EDIT
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          flight.id !== undefined && handleDelete(flight.id)
                        }
                        disabled={deletingId === flight.id}
                        className="bg-red-600 px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === flight.id ? "..." : "DELETE"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 text-xs font-semibold text-gray-700">
        Total Flights: {flights.length}
      </div>
    </div>
  );
};

export default FlightList;
