package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class FlightStatusScheduler {

    private final FlightStatusRepository statusRepository;
    private final FlightStatusService statusService;

    public FlightStatusScheduler(FlightStatusRepository statusRepository, FlightStatusService statusService) {
        this.statusRepository = statusRepository;
        this.statusService = statusService;
    }

    @Scheduled(fixedRate = 60000)
    public void updateFlightStatuses() {
        for (FlightStatus flightStatus : statusRepository.findAll()) {
        	
            if (flightStatus.getFlight() != null) {
            	
                Long flightId = flightStatus.getFlight().getId();

                try {
                	
                    statusService.simulateStatus(flightId);
                    System.out.println("Flight status updated: " + flightId);

                } catch (Exception e) {
                    System.out.println("Unable to update flight: " + flightId);
                }
            }
        }
    }
}