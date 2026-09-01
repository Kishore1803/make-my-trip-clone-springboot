package com.makemytrip.makemytrip.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;

@RestController
public class RootController {
	
	@Autowired
    private FlightRepository flightRepository;
	
	@Autowired
    private HotelRepository hotelRepository;
	
	@GetMapping
	public String name() {
		return "Running on port no 8081";
	}
	
	@GetMapping("/flight")
	public ResponseEntity<List<Flight>> getallFlights(){
		List<Flight> flights = flightRepository.findAll();
		return ResponseEntity.ok(flights);
	};
	
	@GetMapping("/hotel")
	public ResponseEntity<List<Hotel>> getallHotels(){	
		List<Hotel> hotels = hotelRepository.findAll();
		return ResponseEntity.ok(hotels);	
	};
}