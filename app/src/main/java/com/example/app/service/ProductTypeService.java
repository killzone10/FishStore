package com.example.app.service;

import com.example.app.model.Brand;
import com.example.app.model.ProductType;
import com.example.app.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductTypeService {

    private final ProductTypeRepository productTypeRepository;

    @Autowired
    public ProductTypeService(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    public Optional<ProductType> findByTitle(String title){
        return productTypeRepository.findByTitle(title);

    }

    public List<ProductType> getTypes(){
        return productTypeRepository.findAll();
    }


    public void saveType(ProductType type) {
        Optional<ProductType> brandOptional =  productTypeRepository
                .findByTitle(type.getTitle());

        if (brandOptional.isPresent()){
            throw new IllegalArgumentException("Type name already taken");
        }
        productTypeRepository.save(type);
    }
}
