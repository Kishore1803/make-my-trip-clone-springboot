import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFlights, addflight, handleflightbooking } from "@/api";

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

interface FlightListProps {
  userId?: number;
}

const defaultFlights = [
  {
    flightName: "IndiGo 6E-101",
    from: "Chennai",
    to: "Bangalore",
    departureTime: "06:00 AM",
    arrivalTime: "07:05 AM",
    price: 3500,
    availableSeats: 30,
  },
  {
    flightName: "Air India AI-202",
    from: "Chennai",
    to: "Mumbai",
    departureTime: "08:30 AM",
    arrivalTime: "10:45 AM",
    price: 5200,
    availableSeats: 25,
  },
  {
    flightName: "IndiGo 6E-303",
    from: "Bangalore",
    to: "Delhi",
    departureTime: "09:15 AM",
    arrivalTime: "12:00 PM",
    price: 6500,
    availableSeats: 35,
  },
  {
    flightName: "Vistara UK-404",
    from: "Mumbai",
    to: "Delhi",
    departureTime: "10:00 AM",
    arrivalTime: "12:05 PM",
    price: 5800,
    availableSeats: 20,
  },
  {
    flightName: "Air India AI-505",
    from: "Bangalore",
    to: "Mumbai",
    departureTime: "11:30 AM",
    arrivalTime: "13:15 PM",
    price: 4500,
    availableSeats: 28,
  },
  {
    flightName: "IndiGo 6E-606",
    from: "Delhi",
    to: "Kolkata",
    departureTime: "01:00 PM",
    arrivalTime: "03:15 PM",
    price: 6200,
    availableSeats: 32,
  },
  {
    flightName: "Vistara UK-707",
    from: "Kolkata",
    to: "Chennai",
    departureTime: "02:30 PM",
    arrivalTime: "05:15 PM",
    price: 5900,
    availableSeats: 22,
  },
  {
    flightName: "IndiGo 6E-808",
    from: "Hyderabad",
    to: "Chennai",
    departureTime: "04:00 PM",
    arrivalTime: "05:20 PM",
    price: 3800,
    availableSeats: 40,
  },
  {
    flightName: "Air India AI-909",
    from: "Delhi",
    to: "Bangalore",
    departureTime: "06:30 PM",
    arrivalTime: "09:15 PM",
    price: 6800,
    availableSeats: 18,
  },
  {
    flightName: "IndiGo 6E-100",
    from: "Chennai",
    to: "Hyderabad",
    departureTime: "08:00 PM",
    arrivalTime: "09:20 PM",
    price: 4100,
    availableSeats: 27,
  },
];

const FlightList = ({ userId }: FlightListProps) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFlights, setCreatingFlights] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null);

  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // LOAD FLIGHTS
  // --------------------------------------------------

  const loadFlights = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await getFlights();

      console.log("Flights from backend:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid flight response from backend");
      }

      // If database already contains flights
      if (data.length > 0) {
        setFlights(data);
        return;
      }

      // --------------------------------------------------
      // DATABASE EMPTY -> CREATE 10 DEFAULT FLIGHTS
      // --------------------------------------------------

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
        } catch (err) {
          console.error("Failed to create flight:", flight.flightName, err);
        }
      }

      setCreatingFlights(false);

      // Get flights again after inserting
      const updatedFlights = await getFlights();

      if (Array.isArray(updatedFlights)) {
        setFlights(updatedFlights);
      } else {
        setFlights([]);
      }
    } catch (err: any) {
      console.error("Failed to load flights:", err);

      console.error("Status:", err?.response?.status);

      console.error("Backend response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load flights from backend.",
      );
    } finally {
      setLoading(false);
      setCreatingFlights(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    loadFlights();
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredFlights = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return flights;
    }

    return flights.filter((flight) => {
      return (
        flight.flightName?.toLowerCase().includes(value) ||
        flight.from?.toLowerCase().includes(value) ||
        flight.to?.toLowerCase().includes(value)
      );
    });
  }, [flights, search]);

  // --------------------------------------------------
  // BOOK FLIGHT
  // --------------------------------------------------

  const bookFlight = async (flight: Flight) => {
    if (!userId) {
      setMessage("Please login before booking a flight.");
      return;
    }

    if (flight.availableSeats <= 0) {
      setMessage("No seats available for this flight.");
      return;
    }

    try {
      setBookingFlightId(flight.id);
      setMessage("");

      await handleflightbooking(userId, flight.id, 1, flight.price);

      setMessage(`${flight.flightName} booked successfully!`);

      // Reload latest seat count
      await loadFlights();
    } catch (err: any) {
      console.error("Flight booking failed:", err);

      setMessage(err?.response?.data?.message || "Flight booking failed.");
    } finally {
      setBookingFlightId(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />

        <p className="mt-3">
          {creatingFlights ? "Creating 10 flights..." : "Loading flights..."}
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5>Failed to load flights</h5>

          <p className="mb-3">{error}</p>

          <button className="btn btn-danger" onClick={loadFlights}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="container py-4">
      {/* HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Available Flights</h2>

          <p className="text-muted mb-0">{flights.length} flights available</p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadFlights}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      {/* MESSAGE */}

      {message && (
        <div
          className={`alert ${
            message.toLowerCase().includes("success")
              ? "alert-success"
              : "alert-warning"
          }`}
        >
          {message}
        </div>
      )}

      {/* SEARCH */}

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by flight, departure city or destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RESULT COUNT */}

      <div className="mb-3">
        <strong>{filteredFlights.length}</strong> flight
        {filteredFlights.length !== 1 ? "s" : ""} found
      </div>

      {/* EMPTY */}

      {filteredFlights.length === 0 ? (
        <div className="text-center py-5 border rounded">
          <h5>No flights found</h5>

          <p className="text-muted">Try another search.</p>

          <button
            className="btn btn-outline-primary"
            onClick={() => setSearch("")}
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* TABLE */

        <div className="border rounded overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>

                <TableHead>Flight</TableHead>

                <TableHead>From</TableHead>

                <TableHead>To</TableHead>

                <TableHead>Departure</TableHead>

                <TableHead>Arrival</TableHead>

                <TableHead>Price</TableHead>

                <TableHead>Seats</TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredFlights.map((flight, index) => (
                <TableRow key={flight.id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <strong>{flight.flightName}</strong>
                  </TableCell>

                  <TableCell>{flight.from}</TableCell>

                  <TableCell>{flight.to}</TableCell>

                  <TableCell>{flight.departureTime}</TableCell>

                  <TableCell>{flight.arrivalTime}</TableCell>

                  <TableCell>
                    ₹{Number(flight.price).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        flight.availableSeats <= 5
                          ? "text-danger fw-bold"
                          : flight.availableSeats <= 10
                            ? "text-warning fw-bold"
                            : "text-success fw-bold"
                      }
                    >
                      {flight.availableSeats}
                    </span>
                  </TableCell>

                  <TableCell>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={
                        flight.availableSeats <= 0 ||
                        bookingFlightId === flight.id
                      }
                      onClick={() => bookFlight(flight)}
                    >
                      {bookingFlightId === flight.id
                        ? "Booking..."
                        : flight.availableSeats <= 0
                          ? "Sold Out"
                          : "Book"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FlightList;
