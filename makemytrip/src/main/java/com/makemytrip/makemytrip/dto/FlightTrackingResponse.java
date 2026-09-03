package com.makemytrip.makemytrip.dto;

import java.time.LocalDateTime;

public class FlightTrackingResponse {

    private Long flightId;
    private String flightNumber;
    private String from;
    private String to;
    private String status;
    private String reason;
    private String departureTime;
    private String arrivalTime;
    private String estimatedArrivalTime;
    private LocalDateTime lastUpdated;

    public FlightTrackingResponse(Long flightId, String flightNumber, String from, String to, String status, String reason, String departureTime, String arrivalTime, String estimatedArrivalTime) {

        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.from = from;
        this.to = to;
        this.status = status;
        this.reason = reason;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.estimatedArrivalTime = estimatedArrivalTime;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getFlightId() {
        return flightId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public String getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public String getEstimatedArrivalTime() {
        return estimatedArrivalTime;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
}