package com.makemytrip.makemytrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.makemytrip.makemytrip.models.FlightTracking;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightTrackingRepository extends JpaRepository<FlightTracking, Long> {
    Optional<FlightTracking> findByFlightId(Long flightId);
    List<FlightTracking> findAllByFlightIdIn(List<Long> flightIds);
}