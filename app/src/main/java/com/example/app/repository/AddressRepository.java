package com.example.app.repository;

import com.example.app.model.Address;
import com.example.app.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByStreetAndHouseNrAndPostalCodeAndCity(String street, String houseNr, String postalCode, City city);

}
