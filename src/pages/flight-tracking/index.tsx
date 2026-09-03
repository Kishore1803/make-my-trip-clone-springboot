"use client";

import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import FlightTracking from "@/components/FlightTracking/FlightTracking";

const FlightTrackingPage = () => {
  const user = useSelector((state: any) => state.user.user);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">Login Required</h1>
            <p className="mt-2 text-gray-500">
              Please login to track your flights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <FlightTracking userId={user.id} />
        </div>
      </main>
    </div>
  );
};

export default FlightTrackingPage;
