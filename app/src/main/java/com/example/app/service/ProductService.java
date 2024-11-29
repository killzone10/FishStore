package com.example.app.service;

import com.example.app.model.Brand;
import com.example.app.model.Product;
import com.example.app.model.ProductType;
import com.example.app.repository.BrandRepository;
import com.example.app.repository.ProductRepository;
import com.example.app.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void createNewProduct(Product product){
        Optional<Product> productOptional =  productRepository
                .findProductByName(product.getName());
        if (productOptional.isPresent()){
            throw new IllegalArgumentException("product name already taken");
        }
        productRepository.save(product);
    }


    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Page<Product> getProductsByType(ProductType type, Pageable pageable){
        return productRepository.findByType(type, pageable);
    }

    public Optional<Product> findById(Long id){
        return productRepository.findById(id);
    }
}
