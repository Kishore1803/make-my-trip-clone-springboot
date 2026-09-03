package com.makemytrip.makemytrip.dto;

public class FlightTrackingRequest {

    private Long flightId;
    private String status;

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}