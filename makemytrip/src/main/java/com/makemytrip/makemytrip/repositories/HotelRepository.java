package com.makemytrip.makemytrip.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}