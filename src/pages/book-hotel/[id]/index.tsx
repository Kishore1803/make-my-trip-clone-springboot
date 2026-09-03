"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  Hotel as HotelIcon,
  MapPin,
  Calendar,
  Gift,
  CreditCard,
  AlertCircle,
  Info,
  Star,
  BedDouble,
  Check,
} from "lucide-react";

import { getHotels, handlehotelbooking } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setUser } from "@/store";

interface Hotel {
  id: number;
  hotelName: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  amenities: string;
}

const BookHotelPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const { id, checkIn, checkOut } = router.query;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState(1);
  const [open, setOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const data = await getHotels();
        console.log("Hotels from backend:", data);
        console.log("Selected hotel ID:", id);
        const selectedHotel = data.find(
          (item: Hotel) => String(item.id) === String(id),
        );

        if (selectedHotel) {
          console.log("Selected Hotel:", selectedHotel);
          setHotel(selectedHotel);
        } else {
          console.log("Hotel not found");
          setHotel(null);
        }
      } catch (error) {
        console.error("Get Hotel Error:", error);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [router.isReady, id]);

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return "Date not selected";
    }

    try {
      const dateOnly = dateString.split("T")[0];
      const parts = dateOnly.split("-");
      if (parts.length !== 3) {
        return "Date not available";
      }

      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      if (!year || !month || !day) {
        return "Date not available";
      }

      const selectedDate = new Date(year, month - 1, day);
      if (Number.isNaN(selectedDate.getTime())) {
        return "Date not available";
      }

      return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date not available";
    }
  };

  const checkInDate =
    typeof checkIn === "string"
      ? checkIn
      : Array.isArray(checkIn)
        ? checkIn[0]
        : "";

  const checkOutDate =
    typeof checkOut === "string"
      ? checkOut
      : Array.isArray(checkOut)
        ? checkOut[0]
        : "";

  const formattedCheckIn = formatDate(checkInDate);
  const formattedCheckOut = formatDate(checkOutDate);

  if (loading) {
    return <Loader />;
  }

  if (!hotel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-5">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <HotelIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />

          <h2 className="mb-2 text-2xl font-bold text-black">
            Hotel Not Found
          </h2>
          <p className="mb-5 text-gray-600">
            The selected hotel could not be found.
          </p>
          <Button type="button" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const amenities = hotel.amenities
    ? hotel.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const roomPrice = Number(hotel.pricePerNight);
  const roomCharges = roomPrice * rooms;
  const taxes = Math.round(roomCharges * 0.18);
  const serviceFee = 249 * rooms;
  const discount = 250 * rooms;
  const total = roomCharges + taxes + serviceFee - discount;

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) {
      setRooms(1);
      return;
    }

    const newRooms = Math.max(1, Math.min(value, hotel.availableRooms));
    setRooms(newRooms);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!hotel.id) {
      alert("Hotel ID is missing.");
      return;
    }

    try {
      setBookingLoading(true);
      const booking = await handlehotelbooking(user.id, hotel.id, rooms, total);
      console.log("Hotel booking response:", booking);
      const updatedUser = {
        ...user,
        bookings: [...(user.bookings || []), booking],
      };

      dispatch(setUser(updatedUser));
      setOpen(false);
      alert("Hotel booked successfully!");
      router.push("/profile");
    } catch (error: any) {
      console.error("Hotel Booking Error:", error);
      console.error("Server Response:", error?.response?.data);
      alert(error?.response?.data?.message || "Hotel booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const BookingContent = () => {
    return (
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-bold text-black">
            <HotelIcon className="mr-2 h-6 w-6 text-blue-600" />
            Hotel Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Hotel Name</Label>
              <Input value={hotel.hotelName} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={hotel.location} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Input value={formattedCheckIn} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Input value={formattedCheckOut} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Number of Rooms</Label>
              <Input
                type="number"
                min={1}
                max={hotel.availableRooms}
                value={rooms}
                onChange={handleRoomsChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Price Per Night</Label>
              <Input
                value={`₹ ${roomPrice.toLocaleString("en-IN")}`}
                readOnly
              />
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-bold text-black">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="flex items-center rounded-full bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
                >
                  <Check className="mr-1 h-4 w-4 text-green-600" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <h3 className="mb-4 flex items-center text-lg font-bold text-black">
              <CreditCard className="mr-2 h-5 w-5" />
              Fare Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Room Charges</span>
                <span>₹ {roomCharges.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Surcharges</span>
                <span>₹ {taxes.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Other Services</span>
                <span>₹ {serviceFee.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹ {discount.toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-black">
                  <span>Total</span>
                  <span>₹ {total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleBooking}
          disabled={bookingLoading}
          className="mt-4 w-full bg-blue-600 py-6 text-lg text-white hover:bg-blue-700"
        >
          {bookingLoading ? "Booking..." : "Confirm & Book"}
        </Button>
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <span>›</span>
          <span>{hotel.location}</span>
          <span>›</span>
          <span className="font-medium text-black">{hotel.hotelName}</span>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-black">
                      {hotel.hotelName}
                    </h1>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      CANCELLATION FEES APPLY
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}

                    {[1, 2].map((star) => (
                      <Star
                        key={`empty-${star}`}
                        className="h-5 w-5 text-gray-300"
                      />
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {hotel.location}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-blue-600"
                >
                  <Info className="mr-1 h-4 w-4" />
                  View Hotel Rules
                </button>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <HotelIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-black">
                      {hotel.hotelName}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Hotel ID: {hotel.id}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      {hotel.location}
                    </p>
                  </div>
                  <span className="self-start rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                    Standard Room
                  </span>
                </div>
              </div>

              <p className="mt-6 leading-7 ">
                Enjoy a comfortable stay at{" "}
                <span className="font-semibold text-black">
                  {hotel.hotelName}
                </span>{" "}
                in{" "}
                <span className="font-semibold text-black">
                  {hotel.location}
                </span>
                . Choose from the available rooms and enjoy the listed amenities
                during your stay.
              </p>

              <div className="mt-6 border-t pt-6">
                <h2 className="mb-5 text-lg font-bold text-black">Amenities</h2>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <Check className="mr-2 h-5 w-5 text-green-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="flex items-center text-lg font-bold text-black">
                  <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                  Cancellation & Date Change Policy
                </h2>

                <button
                  type="button"
                  className="text-sm font-medium text-blue-600"
                >
                  View Policy
                </button>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-semibold text-black">
                    {hotel.hotelName}
                  </span>

                  <span className="font-bold text-black">
                    ₹ {roomPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Now</span>
                  <span>Cancellation</span>
                  <span>Check-in</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center text-lg font-bold text-black">
                <Gift className="mr-2 h-5 w-5 text-yellow-600" />
                Offers
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <Gift className="mb-3 h-6 w-6 text-red-500" />
                  <p className="font-bold text-black">HOTELFIRST</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Special discount on hotel booking.
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <CreditCard className="mb-3 h-6 w-6 text-blue-500" />
                  <p className="font-bold text-black">PAYNOW</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Instant discount on online payment.
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <Star className="mb-3 h-6 w-6 text-yellow-500" />
                  <p className="font-bold text-black">STAYMORE</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Special offers for hotel stays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-black">Standard Room</h2>
              <p className="mt-2 text-sm text-gray-600">Fits 2 Adults</p>
              <div className="mt-5 space-y-3 border-b pb-5 text-sm text-gray-600">
                <p>• No meals included</p>
                <p>• 10% off on food & beverage services</p>
                <p>• Complimentary welcome drinks on arrival</p>
                <p>• Non-Refundable</p>
              </div>

              <div className="border-b py-5">
                <div className="mb-4 flex justify-between">
                  <span className="font-bold text-black">Price Per Night:</span>
                  <span className="font-semibold text-black">
                    ₹ {roomPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mb-4 flex justify-between">
                  <span className="font-bold text-black">Available Rooms:</span>
                  <span className="font-semibold text-black">
                    {hotel.availableRooms}
                  </span>
                </div>

                <div>
                  <p className="mb-2 font-bold text-black">Amenities:</p>
                  <p className="text-sm leading-6 text-gray-600">
                    {hotel.amenities}
                  </p>
                </div>
              </div>

              <div className="border-b py-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Check-in</p>
                    <p className="mt-1 flex items-start font-semibold text-black">
                      <Calendar className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>{formattedCheckIn}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-gray-500">Rooms</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center font-semibold text-black">
                      <BedDouble className="mr-2 h-4 w-4 text-blue-600" />
                      {rooms} Room
                      {rooms > 1 ? "s" : ""}
                    </div>

                    <Input
                      type="number"
                      min={1}
                      max={hotel.availableRooms}
                      value={rooms}
                      onChange={handleRoomsChange}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <div className="py-5">
                <div className="mb-2 flex justify-between text-sm text-gray-500">
                  <span>Room Charges</span>
                  <span>₹ {roomCharges.toLocaleString("en-IN")}</span>
                </div>

                <div className="mb-2 flex justify-between text-sm text-gray-500">
                  <span>Taxes & Fees</span>
                  <span>₹ {taxes.toLocaleString("en-IN")}</span>
                </div>

                <div className="mb-2 flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- ₹ {discount.toLocaleString("en-IN")}</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-2xl font-bold text-black">
                    ₹ {total.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500">+ taxes & fees</span>
                </div>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  type="button"
                  className="w-full py-3 text-white font-semibold bg-black rounded-md"
                >
                  BOOK THIS NOW
                </DialogTrigger>

                {user ? (
                  <BookingContent />
                ) : (
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-black">
                        Login Required
                      </DialogTitle>
                    </DialogHeader>

                    <p className="text-gray-600">
                      Please log in or sign up to continue with your hotel
                      booking.
                    </p>

                    <SignupDialog
                      trigger={
                        <Button type="button" className="w-full">
                          Log In / Sign Up
                        </Button>
                      }
                    />
                  </DialogContent>
                )}
              </Dialog>

              <button
                type="button"
                className="mt-4 w-full text-center text-sm font-medium text-blue-600"
              >
                14 More Options
              </button>

              <div className="mt-7 rounded-xl bg-[#FFF8E7] p-5">
                <h3 className="mb-4 flex items-center font-bold text-black">
                  <Gift className="mr-2 h-5 w-5 text-yellow-600" />
                  PROMO CODES
                </h3>

                <Input
                  placeholder="Enter promo code"
                  className="mb-4 bg-white"
                />

                <div className="space-y-3">
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="font-bold text-red-600">HOTELFIRST</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Get a special discount on your hotel booking.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="font-bold text-red-600">PAYNOW</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Get an instant discount on online payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookHotelPage;
