package com.example.app.controller;
import com.example.app.model.Brand;
import com.example.app.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/")
public class BrandController {
    private final BrandService brandService;
    @Autowired
    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PostMapping("/brand/create")
    public ResponseEntity<?> registerBrand(@RequestBody Brand brand) {
        try {
            brandService.saveBrand(brand);
            return ResponseEntity.ok("Brand saved sucesfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/brand/get")
    public List<Brand> getStudents(){
        return brandService.getBrands();
    }
}



