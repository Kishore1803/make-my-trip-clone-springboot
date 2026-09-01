package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightTracking;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.FlightTrackingRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FlightTrackingService {

    private final FlightTrackingRepository trackingRepository;
    private final FlightRepository flightRepository;

    public FlightTrackingService(FlightTrackingRepository trackingRepository,FlightRepository flightRepository) {
        this.trackingRepository = trackingRepository;
        this.flightRepository = flightRepository;
    }


    public FlightTracking trackFlight(Long flightId, Long userId) {

        Flight flight = flightRepository.findById(flightId)
        		.orElseThrow(() ->new RuntimeException("Flight not found"));

        Optional<FlightTracking> existing = trackingRepository.findByFlightIdAndUserId(flightId,userId);

        if (existing.isPresent()) {
            return existing.get();
        }

        FlightTracking tracking = new FlightTracking();

        tracking.setFlight(flight);
        tracking.setUserId(userId);
        tracking.setTrackedAt(LocalDateTime.now());

        return trackingRepository.save(tracking);
    }

    public void stopTrackingFlight(Long flightId, Long userId) {

        FlightTracking tracking = trackingRepository.findByFlightIdAndUserId(flightId,userId)
                        .orElseThrow(() -> new RuntimeException("Flight is not being tracked"));
        trackingRepository.delete(tracking);
    }


    public List<FlightTracking> getTrackedFlights(Long userId) {
        return trackingRepository.findByUserId(userId);
    }
}