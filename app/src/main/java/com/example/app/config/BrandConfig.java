//package com.example.app.config;
//import com.example.app.model.Brand;
//import com.example.app.repository.BrandRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.time.LocalDate;
//import java.time.Month;
//import java.util.List;
//
//@Configuration
//public class BrandConfig {
//    @Bean
//    CommandLineRunner brandDataLoader(BrandRepository repository){
//        return args -> {
//            Brand jaxon  = new Brand(
//                    "Jaxon"
//            );
//            Brand rybolow  = new Brand(
//                    "Rybolow"
//            );
//            Brand jesiotr  = new Brand(
//                    "Jesiotr"
//            );
//            Brand okon = new Brand(
//                    "Okon"
//            );
//
//            Brand szczupak = new Brand(
//                    "Szczupak"
//            );
//
//            repository.saveAll(List.of(jaxon, rybolow, jesiotr, okon, szczupak));
//        };
//    }
//}
