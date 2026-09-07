package com.makemytrip.makemytrip.services;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.User;
import com.makemytrip.makemytrip.models.User.Booking;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;

@Service
public class BookingService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private HotelRepository hotelRepository;
	
	@Autowired
	private FlightRepository flightRepository;
	
	public Booking bookFlight(Long userId, Long flightId, int seats, double price) {
		
		Optional<User> userOptional = userRepository.findById(userId);
		Optional<Flight> flightOptional = flightRepository.findById(flightId);
		
		if(userOptional.isPresent() && flightOptional.isPresent()) {
			
			User user = userOptional.get();
			Flight flight = flightOptional.get();
			
			if(flight.getAvailableSeats() >= seats) {
				
				flight.setAvailableSeats(flight.getAvailableSeats()-seats);
				flightRepository.save(flight);
				
				Booking booking  = new Booking();
				booking.setType("Flight");
				booking.setBookingId(flightId);
				booking.setDate(LocalDate.now().toString());
				booking.setTotalPrice(price);
				
				user.getBookings().add(booking);
				userRepository.save(user);
				return booking;
				
			} else {
				throw new RuntimeException("Not Enough Seats Avaliable");
			}
			
		}
		throw new RuntimeException("Users or Flight Not Found");
	}
	
public Booking bookHotel(Long userId, Long hotelId, int rooms, double price) {
		
		Optional<User> userOptional = userRepository.findById(userId);
		Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
		
		if(userOptional.isPresent() && hotelOptional.isPresent()) {
			
			User user = userOptional.get();
			Hotel hotel = hotelOptional.get();
			
			if(hotel.getAvailableRooms() >= rooms) {
				
				hotel.setAvailableRooms(hotel.getAvailableRooms()-rooms);
				hotelRepository.save(hotel);
				
				Booking booking  = new Booking();
				booking.setType("Hotel");
				booking.setBookingId(hotelId);
				booking.setDate(LocalDate.now().toString());
				booking.setTotalPrice(price);
				
				user.getBookings().add(booking);
				userRepository.save(user);
				return booking;
				
			} else {
				throw new RuntimeException("Not Enough Rooms Avaliable");
			}
			
		}
		throw new RuntimeException("Users or Hotels Not Found");
		}
}