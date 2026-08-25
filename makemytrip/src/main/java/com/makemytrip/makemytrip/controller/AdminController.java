package com.makemytrip.makemytrip.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.User;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;

import com.makemytrip.makemytrip.repository.UserRepository;
import com.makemytrip.makemytrip.repository.FlightRepository;
import com.makemytrip.makemytrip.repository.HotelRepository;

@RestController
@RequestMapping("/admin")

public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    // GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // GET ALL FLIGHTS
    @GetMapping("/flight")
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightRepository.findAll();
        return ResponseEntity.ok(flights);
    }

    // ADD FLIGHT
    @PostMapping("/flight")
    public ResponseEntity<Flight> addFlight(@RequestBody Flight flight) {
        Flight savedFlight = flightRepository.save(flight);
        return ResponseEntity.ok(savedFlight);
    }

    // EDIT FLIGHT
    @PutMapping("/flight/{id}")
    public ResponseEntity<Flight> editFlight(@PathVariable Long id, @RequestBody Flight updatedFlight) {

        Optional<Flight> flightOptional = flightRepository.findById(id);
        
        if (flightOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
            
        }
        
        Flight flight = flightOptional.get();
        flight.setFlightName(updatedFlight.getFlightName());
        flight.setFrom(updatedFlight.getFrom());
        flight.setTo(updatedFlight.getTo());
        flight.setDepartureTime(updatedFlight.getDepartureTime());
        flight.setArrivalTime(updatedFlight.getArrivalTime());
        flight.setPrice(updatedFlight.getPrice());
        flight.setAvailableSeats(updatedFlight.getAvailableSeats());
        
        Flight savedFlight = flightRepository.save(flight);
        return ResponseEntity.ok(savedFlight);
    }

    // DELETE FLIGHT
    @DeleteMapping("/flight/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {

        Optional<Flight> flightOptional = flightRepository.findById(id);

        if (flightOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        flightRepository.delete(flightOptional.get());
        return ResponseEntity.noContent().build();
    }

    // GET ALL HOTELS
    @GetMapping("/hotel")
    public ResponseEntity<List<Hotel>> getAllHotels() {
    	
        List<Hotel> hotels = hotelRepository.findAll();
        return ResponseEntity.ok(hotels);
    }


    // ADD HOTEL
    @PostMapping("/hotel")
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) {

        Hotel savedHotel = hotelRepository.save(hotel);
        return ResponseEntity.ok(savedHotel);
    }


    // EDIT HOTEL
    @PutMapping("/hotel/{id}")
    public ResponseEntity<Hotel> editHotel(@PathVariable Long id, @RequestBody Hotel updatedHotel) {

        Optional<Hotel> hotelOptional = hotelRepository.findById(id);
        
        if (hotelOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
            
        }

        Hotel hotel = hotelOptional.get();
        hotel.setHotelName(updatedHotel.getHotelName());
        hotel.setLocation(updatedHotel.getLocation());
        hotel.setPricePerNight(updatedHotel.getPricePerNight());
        hotel.setAvailableRooms(updatedHotel.getAvailableRooms());
        hotel.setAmenities(updatedHotel.getAmenities());
        
        Hotel savedHotel = hotelRepository.save(hotel);
        return ResponseEntity.ok(savedHotel);
    }


    // DELETE HOTEL
    @DeleteMapping("/hotel/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {

        Optional<Hotel> hotelOptional = hotelRepository.findById(id);
        
        if (hotelOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
            
        }
        
        hotelRepository.delete(hotelOptional.get());
        return ResponseEntity.noContent().build();
    }
}