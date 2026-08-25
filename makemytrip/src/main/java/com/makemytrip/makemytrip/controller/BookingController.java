package com.makemytrip.makemytrip.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.models.User;
import com.makemytrip.makemytrip.service.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/flight")
    public User.Booking bookFlight(@RequestParam Long userId, @RequestParam Long flightId,
                                   @RequestParam int seats, @RequestParam double price) {

        return bookingService.bookFlight(userId, flightId, seats, price);
          
    }

    @PostMapping("/hotel")
    public User.Booking bookHotel(@RequestParam Long userId, @RequestParam Long hotelId,
                                  @RequestParam int rooms, @RequestParam double price) {

        return bookingService.bookHotel(userId, hotelId, rooms, price);
        
    }
}