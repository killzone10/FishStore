package com.example.app.repository;

import com.example.app.model.Product;
import com.example.app.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository <Product, Long> {
    Optional<Product> findProductByName(String name);
    Page<Product> findByType(ProductType type, Pageable pageable);

}
