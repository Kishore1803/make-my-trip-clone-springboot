package com.makemytrip.makemytrip.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_status")
public class FlightStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "flight_id", referencedColumnName = "id", nullable = false, unique = true)
    private Flight flight;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer delayMinutes;

    @Column(nullable = false)
    private String delayReason;

    @Column(nullable = false)
    private LocalDateTime estimatedDeparture;

    @Column(nullable = false)
    private LocalDateTime estimatedArrival;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public FlightStatus() {
    }

    public FlightStatus(Long id, Flight flight, String status, Integer delayMinutes, String delayReason,
                        LocalDateTime estimatedDeparture, LocalDateTime estimatedArrival, LocalDateTime updatedAt) {
        this.id = id;
        this.flight = flight;
        this.status = status;
        this.delayMinutes = delayMinutes;
        this.delayReason = delayReason;
        this.estimatedDeparture = estimatedDeparture;
        this.estimatedArrival = estimatedArrival;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDelayMinutes() {
        return delayMinutes;
    }

    public void setDelayMinutes(Integer delayMinutes) {
        this.delayMinutes = delayMinutes;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public LocalDateTime getEstimatedDeparture() {
        return estimatedDeparture;
    }

    public void setEstimatedDeparture(LocalDateTime estimatedDeparture) {
        this.estimatedDeparture = estimatedDeparture;
    }

    public LocalDateTime getEstimatedArrival() {
        return estimatedArrival;
    }

    public void setEstimatedArrival(LocalDateTime estimatedArrival) {
        this.estimatedArrival = estimatedArrival;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}