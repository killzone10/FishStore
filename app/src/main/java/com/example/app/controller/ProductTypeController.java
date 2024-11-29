package com.example.app.controller;
import com.example.app.model.ProductType;
import com.example.app.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/types/")
public class ProductTypeController {

    private final ProductTypeService productTypeService;
    @Autowired
    public ProductTypeController(ProductTypeService productTypeService) {
            this.productTypeService = productTypeService;
        }

        @PostMapping("/create")
        public ResponseEntity<?> registerType(@RequestBody ProductType type) {
            try {
                productTypeService.saveType(type);
                return ResponseEntity.ok("Type saved sucesfully");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }

        @GetMapping("/get")
        public List<ProductType> getStudents(){
            return productTypeService.getTypes();
        }

}





