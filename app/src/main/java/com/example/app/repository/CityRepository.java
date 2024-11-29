package com.example.app.repository;

import com.example.app.model.City;
import com.example.app.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findCityByName(String name);

}
