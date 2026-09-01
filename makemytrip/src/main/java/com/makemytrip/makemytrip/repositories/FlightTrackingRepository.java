package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.FlightTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightTrackingRepository extends JpaRepository<FlightTracking, Long> {
    Optional<FlightTracking> findByFlightIdAndUserId(Long flightId, Long userId);
    List<FlightTracking> findByUserId(Long userId);
    void deleteByFlightIdAndUserId(Long flightId,Long userId);
}