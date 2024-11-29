package com.example.app.service;

import com.example.app.model.Brand;
import com.example.app.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    private final BrandRepository brandRepository;

    @Autowired
    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public List<Brand>getBrands(){
        return brandRepository.findAll();
    }

    public Optional<Brand> findByName(String name){
        return brandRepository.findByName(name);
    }

    public void saveBrand(Brand brand) {
        Optional<Brand> brandOptional =  brandRepository
                .findByName(brand.getName());

        if (brandOptional.isPresent()){
            throw new IllegalArgumentException("brand name already taken");
        }
        brandRepository.save(brand);
    }

}
