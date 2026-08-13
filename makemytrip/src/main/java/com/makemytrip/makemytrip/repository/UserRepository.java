package com.makemytrip.makemytrip.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.makemytrip.makemytrip.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
	Optional<User> findByPhoneNumber(String phoneNumber);
}