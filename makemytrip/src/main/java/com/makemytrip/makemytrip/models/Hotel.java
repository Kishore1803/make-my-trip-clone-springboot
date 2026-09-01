package com.makemytrip.makemytrip.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name="hotel")
public class Hotel {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(nullable=false)
	private String hotelName;
	
	@Column(nullable=false)
	private String location;
	
	@Column(nullable=false)
	private Double pricePerNight;
	
	@Column(nullable=false)
	private int availableRooms;
	
	@Column(nullable=false, length=1000)
	private String amenities;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHotelName() {
		return hotelName;
	}

	public void setHotelName(String hotelName) {
		this.hotelName = hotelName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Double getPricePerNight() {
		return pricePerNight;
	}

	public void setPricePerNight(Double pricePerNight) {
		this.pricePerNight = pricePerNight;
	}

	public int getAvailableRooms() {
		return availableRooms;
	}

	public void setAvailableRooms(int availableRooms) {
		this.availableRooms = availableRooms;
	}

	public String getAmenities() {
		return amenities;
	}

	public void setAmenities(String amenities) {
		this.amenities = amenities;
	}
	
	public Hotel() {
	}

	public Hotel(Long id, String hotelName, String location, Double pricePerNight, int availableRooms, String amenities) {
		this.id = id;
		this.hotelName = hotelName;
		this.location = location;
		this.pricePerNight = pricePerNight;
		this.availableRooms = availableRooms;
		this.amenities = amenities;
	}
}