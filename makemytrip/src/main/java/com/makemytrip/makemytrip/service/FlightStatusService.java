package com.makemytrip.makemytrip.service;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repository.FlightRepository;
import com.makemytrip.makemytrip.repository.FlightStatusRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class FlightStatusService {

    private final FlightStatusRepository flightStatusRepository;
    private final FlightRepository flightRepository;

    private final Random random = new Random();

    public FlightStatusService(
            FlightStatusRepository flightStatusRepository,
            FlightRepository flightRepository
    ) {
        this.flightStatusRepository = flightStatusRepository;
        this.flightRepository = flightRepository;
    }

    // =========================================================
    // GET ALL FLIGHT STATUSES
    // Automatically creates status for flights without status
    // =========================================================

    public List<FlightStatus> getAllStatuses() {

        List<Flight> flights = flightRepository.findAll();

        return flights.stream()
                .map(flight ->
                        flightStatusRepository
                                .findByFlight_Id(flight.getId())
                                .orElseGet(() ->
                                        createStatus(flight.getId())
                                )
                )
                .toList();
    }

    // =========================================================
    // GET STATUS BY FLIGHT ID
    // =========================================================

    public Optional<FlightStatus> getStatusByFlightId(
            Long flightId
    ) {
        return flightStatusRepository
                .findByFlight_Id(flightId);
    }

    // =========================================================
    // CREATE INITIAL STATUS
    // =========================================================

    public FlightStatus createStatus(Long flightId) {

        Flight flight = flightRepository
                .findById(flightId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with id: " + flightId
                        )
                );

        // Don't create duplicate status
        Optional<FlightStatus> existing =
                flightStatusRepository
                        .findByFlight_Id(flightId);

        if (existing.isPresent()) {
            return existing.get();
        }

        FlightStatus status = new FlightStatus();

        status.setFlight(flight);

        status.setStatus("On Time");

        status.setDelayMinutes(0);

        status.setDelayReason(
                "Flight is operating as scheduled."
        );

        LocalDateTime departure =
                convertToDateTime(
                        flight.getDepartureDate(),
                        flight.getDepartureTime()
                );

        LocalDateTime arrival =
                calculateArrival(
                        flight.getDepartureDate(),
                        flight.getDepartureTime(),
                        flight.getArrivalTime()
                );

        status.setEstimatedDeparture(departure);

        status.setEstimatedArrival(arrival);

        status.setUpdatedAt(LocalDateTime.now());

        return flightStatusRepository.save(status);
    }

    // =========================================================
    // SIMULATE LIVE FLIGHT STATUS
    // =========================================================

    public FlightStatus simulateStatus(Long flightId) {

        FlightStatus flightStatus =
                flightStatusRepository
                        .findByFlight_Id(flightId)
                        .orElseGet(() ->
                                createStatus(flightId)
                        );

        Flight flight =
                flightStatus.getFlight();

        int randomNumber =
                random.nextInt(3);

        // -----------------------------------------------------
        // ON TIME
        // -----------------------------------------------------

        if (randomNumber == 0) {

            flightStatus.setStatus("On Time");

            flightStatus.setDelayMinutes(0);

            flightStatus.setDelayReason(
                    "Flight is operating as scheduled."
            );

            LocalDateTime departure =
                    convertToDateTime(
                            flight.getDepartureDate(),
                            flight.getDepartureTime()
                    );

            LocalDateTime arrival =
                    calculateArrival(
                            flight.getDepartureDate(),
                            flight.getDepartureTime(),
                            flight.getArrivalTime()
                    );

            flightStatus.setEstimatedDeparture(
                    departure
            );

            flightStatus.setEstimatedArrival(
                    arrival
            );
        }

        // -----------------------------------------------------
        // DELAYED BY 1 HOUR
        // -----------------------------------------------------

        else if (randomNumber == 1) {

            flightStatus.setStatus(
                    "Delayed by 1h"
            );

            flightStatus.setDelayMinutes(60);

            flightStatus.setDelayReason(
                    "Late arrival of incoming aircraft."
            );

            LocalDateTime departure =
                    convertToDateTime(
                            flight.getDepartureDate(),
                            flight.getDepartureTime()
                    );

            LocalDateTime arrival =
                    calculateArrival(
                            flight.getDepartureDate(),
                            flight.getDepartureTime(),
                            flight.getArrivalTime()
                    );

            flightStatus.setEstimatedDeparture(
                    departure.plusHours(1)
            );

            flightStatus.setEstimatedArrival(
                    arrival.plusHours(1)
            );
        }

        // -----------------------------------------------------
        // BOARDING
        // -----------------------------------------------------

        else {

            flightStatus.setStatus("Boarding");

            flightStatus.setDelayMinutes(0);

            flightStatus.setDelayReason(
                    "Passengers are currently boarding."
            );

            LocalDateTime departure =
                    convertToDateTime(
                            flight.getDepartureDate(),
                            flight.getDepartureTime()
                    );

            LocalDateTime arrival =
                    calculateArrival(
                            flight.getDepartureDate(),
                            flight.getDepartureTime(),
                            flight.getArrivalTime()
                    );

            flightStatus.setEstimatedDeparture(
                    departure
            );

            flightStatus.setEstimatedArrival(
                    arrival
            );
        }

        flightStatus.setUpdatedAt(
                LocalDateTime.now()
        );

        return flightStatusRepository.save(
                flightStatus
        );
    }

    // =========================================================
    // CONVERT DATE + TIME TO LOCALDATETIME
    //
    // Supports:
    //
    // 2026-08-20 + 06:30
    // 2026-08-20 + 06:30 AM
    // 2026-08-20 + 6:30 PM
    // =========================================================

    private LocalDateTime convertToDateTime(
            String date,
            String time
    ) {

        String cleanDate =
                date == null
                        ? ""
                        : date.trim();

        String cleanTime =
                time == null
                        ? ""
                        : time.trim()
                              .replaceAll(
                                      "\\s+",
                                      " "
                              )
                              .toUpperCase();

        if (cleanDate.isEmpty()) {
            throw new IllegalArgumentException(
                    "Departure date cannot be empty."
            );
        }

        if (cleanTime.isEmpty()) {
            throw new IllegalArgumentException(
                    "Flight time cannot be empty."
            );
        }

        // -----------------------------------------------------
        // AM / PM FORMAT
        // Example: 06:30 PM
        // -----------------------------------------------------

        if (
                cleanTime.endsWith("AM") ||
                cleanTime.endsWith("PM")
        ) {

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern(
                            "yyyy-MM-dd h:mm a"
                    );

            try {

                return LocalDateTime.parse(
                        cleanDate
                                + " "
                                + cleanTime,
                        formatter
                );

            } catch (DateTimeParseException e) {

                throw new IllegalArgumentException(
                        "Invalid date/time: "
                                + cleanDate
                                + " "
                                + cleanTime
                                + ". Expected format like 2026-08-20 6:30 PM.",
                        e
                );
            }
        }

        // -----------------------------------------------------
        // 24-HOUR FORMAT
        // Example: 06:30
        // -----------------------------------------------------

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern(
                        "yyyy-MM-dd H:mm"
                );

        try {

            return LocalDateTime.parse(
                    cleanDate
                            + " "
                            + cleanTime,
                    formatter
            );

        } catch (DateTimeParseException e) {

            throw new IllegalArgumentException(
                    "Invalid date/time: "
                            + cleanDate
                            + " "
                            + cleanTime
                            + ". Expected format like 2026-08-20 06:30.",
                    e
            );
        }
    }

    // =========================================================
    // CALCULATE ARRIVAL
    //
    // Handles overnight flights:
    //
    // 18:10 → 00:55
    //
    // Result:
    // August 20 6:10 PM
    // →
    // August 21 12:55 AM
    // =========================================================

    private LocalDateTime calculateArrival(
            String departureDate,
            String departureTime,
            String arrivalTime
    ) {

        LocalDateTime departure =
                convertToDateTime(
                        departureDate,
                        departureTime
                );

        LocalTime arrival =
                parseTime(arrivalTime);

        LocalDate arrivalDate =
                departure.toLocalDate();

        LocalDateTime arrivalDateTime =
                LocalDateTime.of(
                        arrivalDate,
                        arrival
                );

        // If arrival time is before/equal to departure
        // time, flight arrives next day.
        if (
                !arrivalDateTime.isAfter(departure)
        ) {
            arrivalDateTime =
                    arrivalDateTime.plusDays(1);
        }

        return arrivalDateTime;
    }

    // =========================================================
    // PARSE TIME
    //
    // Supports:
    //
    // 06:30
    // 6:30 PM
    // 06:30 PM
    // =========================================================

    private LocalTime parseTime(
            String time
    ) {

        String cleanTime =
                time == null
                        ? ""
                        : time.trim()
                              .replaceAll(
                                      "\\s+",
                                      " "
                              )
                              .toUpperCase();

        if (cleanTime.isEmpty()) {
            throw new IllegalArgumentException(
                    "Arrival time cannot be empty."
            );
        }

        // -----------------------------------------------------
        // AM / PM
        // -----------------------------------------------------

        if (
                cleanTime.endsWith("AM") ||
                cleanTime.endsWith("PM")
        ) {

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern(
                            "h:mm a"
                    );

            try {

                return LocalTime.parse(
                        cleanTime,
                        formatter
                );

            } catch (DateTimeParseException e) {

                throw new IllegalArgumentException(
                        "Invalid time: "
                                + cleanTime
                                + ". Expected format like 6:30 PM.",
                        e
                );
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("H:mm");

        try {
            return LocalTime.parse(cleanTime, formatter);

        } catch (DateTimeParseException e) {

            throw new IllegalArgumentException("Invalid time: " + cleanTime + ". Expected format like 06:30.", e);
        }
    }
}