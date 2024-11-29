//package com.example.app.config;
//import com.example.app.model.ProductType;
//import com.example.app.repository.ProductTypeRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.List;
//@Configuration
//public class ProductTypeConfig {
//    @Bean
//    CommandLineRunner typesDataLoader(ProductTypeRepository repository) {
//        return args -> {
//            ProductType hooks = new ProductType(
//                    "Hooks"
//            );
//            ProductType rods = new ProductType(
//                    "Rods"
//            );
//            ProductType baits = new ProductType(
//                    "Baits"
//            );
//            ProductType other = new ProductType(
//                    "Others"
//            );
//
//            repository.saveAll(List.of(hooks, rods, baits, other));
//        };
//    }
//}
//
//
//
