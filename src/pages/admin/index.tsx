"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FlightList from "@/components/Flight/FlightList";
import HotelList, { Hotel } from "@/components/Hotel/HotelList";
import AddEditHotel from "@/components/Hotel/AddEditHotel";
import UserList, { User } from "@/components/User/UserList";

const index = () => {
  
  const [activeTab, setActiveTab] = useState("flights");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showHotelForm, setShowHotelForm] = useState(false);

  const handleSelectHotel = (hotel: Hotel) => {
    console.log("Selected hotel:", hotel);
    setSelectedHotel(hotel);
    setShowHotelForm(true);
  };

  const handleAddHotel = () => {
    console.log("Add hotel clicked");
    setSelectedHotel(null);
    setShowHotelForm(true);
  };

  const handleCloseHotel = () => {
    setSelectedHotel(null);
    setShowHotelForm(false);
  };

  const handleHotelSaved = (hotel: Hotel) => {
    console.log("Hotel saved:", hotel);
    setSelectedHotel(null);
    setShowHotelForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex w-full rounded-lg bg-black p-1">
            <TabsTrigger
              value="flights"
              className="flex-1 rounded-md py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Flights
            </TabsTrigger>

            <TabsTrigger
              value="hotels"
              className="flex-1 rounded-md py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Hotels
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="flex-1 rounded-md py-2 text-white data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flights">
            <FlightList />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelList onSelect={handleSelectHotel} onAdd={handleAddHotel} />

            {showHotelForm && (
              <AddEditHotel
                hotel={selectedHotel}
                onClose={handleCloseHotel}
                onSaved={handleHotelSaved}
              />
            )}
          </TabsContent>

          <TabsContent value="users">
            <UserList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default index;