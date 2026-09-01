package com.makemytrip.makemytrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {
}