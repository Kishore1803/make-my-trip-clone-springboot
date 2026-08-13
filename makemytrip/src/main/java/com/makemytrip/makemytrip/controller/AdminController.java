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
@CrossOrigin(origins = "https://make-my-trip-clone-springboot-1-x8h4.onrender.com")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/flight")
    public ResponseEntity<Flight> addFlight(
            @RequestBody Flight flight) {
        Flight savedFlight = flightRepository.save(flight);
        return ResponseEntity.ok(savedFlight);
    }

    @PutMapping("/flight/{id}")
    public ResponseEntity<Flight> editFlight(
            @PathVariable Long id,
            @RequestBody Flight updatedFlight) {

        Optional<Flight> flightOptional =
                flightRepository.findById(id);

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

        Flight savedFlight =
                flightRepository.save(flight);
        return ResponseEntity.ok(savedFlight);
    }

    @DeleteMapping("/flight/{id}")
    public ResponseEntity<Void> deleteFlight(
            @PathVariable Long id) {

        Optional<Flight> flightOptional =
                flightRepository.findById(id);

        if (flightOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        flightRepository.delete(flightOptional.get());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/hotel")
    public ResponseEntity<Hotel> addHotel(
            @RequestBody Hotel hotel) {
        Hotel savedHotel =
                hotelRepository.save(hotel);
        return ResponseEntity.ok(savedHotel);
    }


    @PutMapping("/hotel/{id}")
    public ResponseEntity<Hotel> editHotel(
            @PathVariable Long id,
            @RequestBody Hotel updatedHotel) {

        Optional<Hotel> hotelOptional =
                hotelRepository.findById(id);

        if (hotelOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Hotel hotel = hotelOptional.get();
        hotel.setHotelName(updatedHotel.getHotelName());
        hotel.setLocation(updatedHotel.getLocation());
        hotel.setAvailableRooms(updatedHotel.getAvailableRooms());
        hotel.setPricePerNight(updatedHotel.getPricePerNight());
        hotel.setAmenities(updatedHotel.getAmenities());

        Hotel savedHotel =
                hotelRepository.save(hotel);
        return ResponseEntity.ok(savedHotel);
    }

    @DeleteMapping("/hotel/{id}")
    public ResponseEntity<Void> deleteHotel(
            @PathVariable Long id) {

        Optional<Hotel> hotelOptional =
                hotelRepository.findById(id);

        if (hotelOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        hotelRepository.delete(hotelOptional.get());
        return ResponseEntity.noContent().build();
    }
}