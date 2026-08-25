package com.makemytrip.makemytrip.repository;

import com.makemytrip.makemytrip.models.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FlightStatusRepository
        extends JpaRepository<FlightStatus, Long> {

    Optional<FlightStatus> findByFlight_Id(Long flightId);
}