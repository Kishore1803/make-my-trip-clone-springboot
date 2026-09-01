package com.makemytrip.makemytrip.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "flight_tracking",uniqueConstraints = {@UniqueConstraint(columnNames = {"flight_id", "user_id"})})
public class FlightTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "flight_id",nullable = false)
    private Flight flight;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime trackedAt;

    public FlightTracking() {
    }

    public FlightTracking(Long id, Flight flight, Long userId, LocalDateTime trackedAt) {
        this.id = id;
        this.flight = flight;
        this.userId = userId;
        this.trackedAt = trackedAt;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getTrackedAt() {
        return trackedAt;
    }

    public void setTrackedAt(LocalDateTime trackedAt) {
        this.trackedAt = trackedAt;
    }
}