package com.example.app.controller;

import com.example.app.model.Brand;
import com.example.app.model.Product;
import com.example.app.model.ProductType;
import com.example.app.service.BrandService;
import com.example.app.service.ProductService;
import com.example.app.service.ProductTypeService;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/product")
public class ProductController {
    private final ProductService productService;
    private final BrandService brandService;
    private final ProductTypeService productTypeService;
    @Autowired
    public ProductController(ProductService productService,
                             BrandService brandService,
                             ProductTypeService productTypeService){
        this.productService = productService;
        this.brandService = brandService;
        this.productTypeService = productTypeService;
    }

    public void savePhoto(MultipartFile photo, String filePath) {
        try {
            Path path = Path.of(filePath);
            Files.createDirectories(path.getParent());
            photo.transferTo(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewProduct(
            @RequestParam("name") String name,
            @RequestParam("price") float price,
            @RequestParam("quantity") int quantity,
            @RequestParam(value = "brandName", required = false) String brandName,
            @RequestParam(value = "typeName", required = false) String typeName,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        try {
            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setQuantity(quantity);
            if (photo != null && !photo.isEmpty()){
                String imagePath = "assets/images/" + photo.getOriginalFilename();
                savePhoto(photo, imagePath);
                product.setPhoto(photo.getOriginalFilename());
            }
            // brand part
            if (brandName != null && !brandName.isEmpty()){
                Optional<Brand> brandOptional = brandService.findByName(brandName);
                if (brandOptional.isEmpty()){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Brand not found");
                }
                product.setBrand(brandOptional.get());
            }
            // type part
            if (typeName != null && !typeName.isEmpty()){
                Optional<ProductType> typeOptional = productTypeService.findByTitle(typeName);
                if (typeOptional.isEmpty()){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Type not found");
                }
                product.setType(typeOptional.get());
            }
            productService.createNewProduct(product);
            return ResponseEntity.ok("Product created sucessfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

//    @GetMapping("all")
//    public ResponseEntity<Page<Product>> getAllProducts() {
//        return ResponseEntity.ok(productService.getAllProducts());
//    }


    @GetMapping("/type/{title}")
    public ResponseEntity<Page<Product>> getProductsByType(
            @PathVariable String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        if ("all".equalsIgnoreCase(title)) {
            Page<Product> allProducts = productService.getAllProducts(PageRequest.of(page,size));
            return ResponseEntity.ok(allProducts);
        }
        Optional<ProductType> productTypeOptional = productTypeService.findByTitle(title);

        if (productTypeOptional.isPresent()){
            ProductType productType = productTypeOptional.get();
            Page<Product> products = productService.getProductsByType(productType, PageRequest.of(page, size));
            return ResponseEntity.ok(products);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Page.empty());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductsById(
            @PathVariable Long id) {
        return productService.findById(id).map(product-> ResponseEntity.ok(product))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());


    }


}

