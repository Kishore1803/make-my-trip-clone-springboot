"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";

import { getFlights, addflight, editflight, deleteflight } from "@/api";

import Loader from "../Loader";

// =====================================================
// FLIGHT TYPE
// =====================================================

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

// =====================================================
// EMPTY FORM
// =====================================================

const emptyFlight: Flight = {
  flightName: "",
  from: "",
  to: "",
  departureTime: "",
  arrivalTime: "",
  price: 0,
  availableSeats: 0,
};

// =====================================================
// 10 DEFAULT FLIGHTS
// =====================================================

const defaultFlights: Flight[] = [
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
    arrivalTime: "10:30",
    price: 5299,
    availableSeats: 40,
  },
  {
    flightName: "Vistara UK-825",
    from: "Bengaluru",
    to: "Mumbai",
    departureTime: "10:00",
    arrivalTime: "11:45",
    price: 3999,
    availableSeats: 35,
  },
  {
    flightName: "IndiGo 6E-507",
    from: "Hyderabad",
    to: "Chennai",
    departureTime: "12:30",
    arrivalTime: "13:45",
    price: 3299,
    availableSeats: 50,
  },
  {
    flightName: "Air India AI-101",
    from: "Delhi",
    to: "Kolkata",
    departureTime: "14:00",
    arrivalTime: "16:10",
    price: 5799,
    availableSeats: 38,
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
    flightName: "Qatar Airways QR-578",
    from: "Doha",
    to: "Paris",
    departureTime: "13:20",
    arrivalTime: "19:00",
    price: 48999,
    availableSeats: 30,
  },
  {
    flightName: "Singapore Airlines SQ-423",
    from: "Singapore",
    to: "Mumbai",
    departureTime: "09:45",
    arrivalTime: "12:50",
    price: 35999,
    availableSeats: 28,
  },
  {
    flightName: "Lufthansa LH-760",
    from: "Frankfurt",
    to: "Delhi",
    departureTime: "14:30",
    arrivalTime: "02:15",
    price: 62999,
    availableSeats: 22,
  },
  {
    flightName: "British Airways BA-142",
    from: "London",
    to: "Mumbai",
    departureTime: "09:00",
    arrivalTime: "22:30",
    price: 67999,
    availableSeats: 20,
  },
];

// =====================================================
// COMPONENT
// =====================================================

const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // null = Add mode
  // flight object = Edit mode
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Flight>(emptyFlight);

  const initialized = useRef(false);

  // =====================================================
  // GET FLIGHTS
  // =====================================================

  const fetchFlights = async () => {
    try {
      setError("");

      let data = await getFlights();

      console.log("Flights from MySQL:", data);

      // =================================================
      // INSERT 10 FLIGHTS IF TABLE EMPTY
      // =================================================

      if (!data || data.length === 0) {
        console.log("Flight table is empty. Adding 10 flights...");

        for (const item of defaultFlights) {
          try {
            const saved = await addflight(
              item.flightName,
              item.from,
              item.to,
              item.departureTime,
              item.arrivalTime,
              item.price,
              item.availableSeats,
            );

            console.log("Flight added:", saved);
          } catch (error) {
            console.error(`Error adding ${item.flightName}:`, error);
          }
        }

        // Get actual records from MySQL
        data = await getFlights();

        console.log("Flights after insertion:", data);
      }

      setFlights(data || []);
    } catch (error) {
      console.error("Failed to load flights:", error);

      setError("Failed to load flights from backend.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    fetchFlights();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" || name === "availableSeats" ? Number(value) : value,
    }));
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAdd = () => {
    setSelectedFlight(null);

    setFormData({
      ...emptyFlight,
    });

    setShowForm(true);

    setError("");
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (flight: Flight) => {
    setSelectedFlight(flight);

    setFormData({
      id: flight.id,
      flightName: flight.flightName || "",
      from: flight.from || "",
      to: flight.to || "",
      departureTime: flight.departureTime || "",
      arrivalTime: flight.arrivalTime || "",
      price: flight.price || 0,
      availableSeats: flight.availableSeats || 0,
    });

    setShowForm(true);

    setError("");
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCancel = () => {
    setShowForm(false);

    setSelectedFlight(null);

    setFormData({
      ...emptyFlight,
    });

    setError("");
  };

  // =====================================================
  // ADD / EDIT SUBMIT
  // =====================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // =================================================
      // EDIT EXISTING FLIGHT
      // =================================================

      if (selectedFlight && selectedFlight.id) {
        const updatedFlight = await editflight(
          selectedFlight.id,
          formData.flightName,
          formData.from,
          formData.to,
          formData.departureTime,
          formData.arrivalTime,
          formData.price,
          formData.availableSeats,
        );

        console.log("Updated flight:", updatedFlight);

        setFlights((previous) =>
          previous.map((item) =>
            item.id === selectedFlight.id ? updatedFlight : item,
          ),
        );

        alert("Flight updated successfully.");
      }

      // =================================================
      // ADD NEW FLIGHT
      // =================================================
      else {
        const newFlight = await addflight(
          formData.flightName,
          formData.from,
          formData.to,
          formData.departureTime,
          formData.arrivalTime,
          formData.price,
          formData.availableSeats,
        );

        console.log("New flight:", newFlight);

        setFlights((previous) => [...previous, newFlight]);

        alert("Flight added successfully.");
      }

      handleCancel();
    } catch (error) {
      console.error("Flight save error:", error);

      setError("Failed to save flight. Check your backend.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id?: number) => {
    if (!id) {
      alert("Flight ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this flight?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteflight(id);
      setFlights((previous) => previous.filter((flight) => flight.id !== id));
      alert("Flight deleted successfully.");
    } catch (error) {
      console.error("Delete Flight Error:", error);
      alert("Failed to delete flight.");
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredFlights = flights.filter((flight) => {
    const text = search.toLowerCase().trim();

    if (!text) {
      return true;
    }

    return (
      flight.flightName?.toLowerCase().includes(text) ||
      flight.from?.toLowerCase().includes(text) ||
      flight.to?.toLowerCase().includes(text)
    );
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Loader />;
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="w-full space-y-6">
      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">
                {selectedFlight ? "Edit Flight" : "Add Flight"}
              </h2>

              <p className="mt-1 text-sm text-black">
                {selectedFlight
                  ? "Update the flight details"
                  : "Add a new flight"}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Close
            </Button>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* FLIGHT NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Flight Name
                </label>

                <input
                  type="text"
                  name="flightName"
                  value={formData.flightName}
                  onChange={handleChange}
                  placeholder="IndiGo 6E-201"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* FROM */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  From
                </label>

                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="Chennai"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* TO */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  To
                </label>

                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="Delhi"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* DEPARTURE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Departure Time
                </label>

                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* ARRIVAL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Arrival Time
                </label>

                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* AVAILABLE SEATS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Available Seats
                </label>

                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* FORM BUTTONS */}

            <div className="flex justify-end gap-3 border-t pt-5">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className={
                  selectedFlight
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              >
                {saving
                  ? "Saving..."
                  : selectedFlight
                    ? "Update Flight"
                    : "Add Flight"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          FLIGHT LIST
      ================================================= */}

      <div className="rounded-xl bg-white p-6 shadow-lg">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-black">Flight List</h3>

            <p className="mt-1 text-sm text-black">
              Domestic and international flights
            </p>
          </div>

          <Button
            type="button"
            onClick={handleAdd}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add Flight
          </Button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SEARCH */}

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by flight name, from or destination..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-black">Flight Name</TableHead>

                <TableHead className="text-black">From</TableHead>

                <TableHead className="text-black">To</TableHead>

                <TableHead className="text-black">Departure</TableHead>

                <TableHead className="text-black">Arrival</TableHead>

                <TableHead className="text-black">Price</TableHead>

                <TableHead className="text-black">Seats</TableHead>

                <TableHead className="text-center text-black">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredFlights.length > 0 ? (
                filteredFlights.map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-black hover:bg-gray-50"
                  >
                    <TableCell className="font-medium text-black">
                      {item.flightName}
                    </TableCell>

                    <TableCell className="text-black">{item.from}</TableCell>

                    <TableCell className="text-black">{item.to}</TableCell>

                    <TableCell className="text-black">
                      {item.departureTime}
                    </TableCell>

                    <TableCell className="text-black">
                      {item.arrivalTime}
                    </TableCell>

                    <TableCell className="text-black">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell className="text-black">
                      {item.availableSeats}
                    </TableCell>

                    {/* ACTION */}

                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {/* EDIT */}

                        <Button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Edit
                        </Button>

                        {/* DELETE */}

                        <Button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 text-white"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-black"
                  >
                    {search ? "No flights found." : "No flights available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* FOOTER */}

        <div className="mt-4 flex justify-between text-sm text-black">
          <span>
            Total Flights:{" "}
            <strong className="text-black">{flights.length}</strong>
          </span>

          {search && (
            <span>
              Showing:{" "}
              <strong className="text-black">{filteredFlights.length}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightList;