package com.example.app.repository;

import com.example.app.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand,Long> {
    Optional<Brand> findByName(String name);
}