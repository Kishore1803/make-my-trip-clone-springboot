package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@Service
public class FlightStatusService {

    private final FlightStatusRepository statusRepository;
    private final FlightRepository flightRepository;

    private final Random random = new Random();

    public FlightStatusService(FlightStatusRepository statusRepository, FlightRepository flightRepository) {
        this.statusRepository = statusRepository;
        this.flightRepository = flightRepository;
    }

    // Get all flight statuses
    public List<FlightStatus> getAllStatuses() {
        return statusRepository.findAll();
    }

    // Get status for one flight
    public FlightStatus getStatusByFlightId(Long flightId) {
        return statusRepository.findByFlight_Id(flightId)
                .orElseThrow(() -> new RuntimeException("Flight status not found"));
    }

    // Simulate flight status
    public FlightStatus simulateStatus(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        FlightStatus flightStatus = statusRepository.findByFlight_Id(flightId)
                        .orElseGet(() -> {
                            FlightStatus newStatus = new FlightStatus();
                            newStatus.setFlight(flight);
                            return newStatus;
                        });

        LocalDateTime departureTime = getDateTime(flight.getDepartureDate(), flight.getDepartureTime());
        LocalDateTime arrivalTime = getDateTime(flight.getDepartureDate(), flight.getArrivalTime());
        int option = random.nextInt(3);

        if (option == 0) {

            // ON TIME
            flightStatus.setStatus("ON_TIME");
            flightStatus.setDelayMinutes(0);
            flightStatus.setDelayReason("No delay");
            flightStatus.setEstimatedDeparture(departureTime);
            flightStatus.setEstimatedArrival(arrivalTime);

        } else if (option == 1) {

            // BOARDING
            flightStatus.setStatus("BOARDING");
            flightStatus.setDelayMinutes(0);
            flightStatus.setDelayReason("Flight is boarding");
            flightStatus.setEstimatedDeparture(departureTime);
            flightStatus.setEstimatedArrival(arrivalTime);

        } else {

            // DELAYED
            int delayMinutes = (random.nextInt(4) + 1) * 30;
            String[] reasons = {"Weather conditions", "Technical issue", "Air traffic congestion", "Late arrival of aircraft"};
            String delayReason = reasons[random.nextInt(reasons.length)];
            flightStatus.setStatus("DELAYED");
            flightStatus.setDelayMinutes(delayMinutes);
            flightStatus.setDelayReason(delayReason);
            flightStatus.setEstimatedDeparture(departureTime.plusMinutes(delayMinutes));
            flightStatus.setEstimatedArrival(arrivalTime.plusMinutes(delayMinutes));
        }
        flightStatus.setUpdatedAt(LocalDateTime.now());
        return statusRepository.save(flightStatus);
    }

    // Convert date and time from Flight into LocalDateTime
    private LocalDateTime getDateTime(String date, String time) {
        LocalDate localDate =LocalDate.parse(date);
        LocalTime localTime = LocalTime.parse(time);
        return LocalDateTime.of(localDate,localTime);
    }
}