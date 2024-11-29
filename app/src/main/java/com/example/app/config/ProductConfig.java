package com.example.app.config;

import com.example.app.model.Brand;
import com.example.app.model.Product;
import com.example.app.model.ProductType;
import com.example.app.repository.BrandRepository;
import com.example.app.repository.ProductRepository;
import com.example.app.repository.ProductTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ProductConfig {
    @Bean
    CommandLineRunner productDataLoader(
            ProductRepository productRepository,
            BrandRepository brandRepository,
            ProductTypeRepository productTypeRepository) {
        return args -> {

            Brand szczupak = new Brand("Szczupak");
            Brand jesiotr = new Brand("Jesiotr");
            Brand jaxon = new Brand("Jaxon");
            Brand okon = new Brand("Okon");
            Brand rybolow = new Brand("Rybolow");

            brandRepository.saveAll(List.of(szczupak, jesiotr, jaxon, okon, rybolow));

            ProductType hooks = new ProductType("Hooks");
            ProductType rods = new ProductType("Rods");
            ProductType baits = new ProductType("Baits");
            ProductType others = new ProductType("Others");

            productTypeRepository.saveAll(List.of(hooks, rods, baits, others));



            Product exampleProduct = new Product(
                    "bass.jpg",
                    "Example Product",
                    100.0f,
                    20,
                    "This is an example product",
                    jaxon,
                    others
            );

            Product haczyk1 = new Product(
                    "haczyk1.jpg",
                    "Haczyk 1",
                    10.5f,
                    100,
                    "Giga haczyk",
                    szczupak,
                    hooks
            );

            Product haczyk2 = new Product(
                    "haczyk2.jpg",
                    "Haczyk 2",
                    15.0f,
                    80,
                    "Powerful haczyk",
                    jesiotr,
                    hooks
            );

            Product haczyk3 = new Product(
                    "haczyk3.jpg",
                    "Haczyk 3",
                    12.0f,
                    90,
                    "Advanced haczyk",
                    rybolow,
                    hooks
            );

            Product przyneta1 = new Product(
                    "przyneta1.jpg",
                    "Przynęta 1",
                    5.5f,
                    500,
                    "Universal bait",
                    jaxon,
                    baits
            );

            Product przyneta2 = new Product(
                    "przyneta2.jpg",
                    "Przynęta 2",
                    6.5f,
                    400,
                    "Special bait",
                    szczupak,
                    baits
            );

            Product robaki = new Product(
                    "robaki.jpg",
                    "Robaki",
                    4.0f,
                    300,
                    "Earthworms",
                    okon,
                    baits
            );

            Product robaki2 = new Product(
                    "robaki2.jpg",
                    "Robaki 2",
                    4.5f,
                    350,
                    "Special earthworms",
                    rybolow,
                    baits
            );

            Product wedka1 = new Product(
                    "wedka1.jpg",
                    "Wędka 1",
                    200.0f,
                    50,
                    "Standard rod",
                    jesiotr,
                    rods
            );

            Product wedka2 = new Product(
                    "wedka2.jpg",
                    "Wędka 2",
                    250.0f,
                    40,
                    "Premium rod",
                    szczupak,
                    rods
            );

            Product wedka3 = new Product(
                    "wedka3.jpg",
                    "Wędka 3",
                    300.0f,
                    30,
                    "Professional rod",
                    rybolow,
                    rods
            );

            Product key = new Product(
                    "key.webp",
                    "Key",
                    1.0f,
                    1000,
                    "Small accessory",
                    null,
                    others
            );

            // save all products
            productRepository.saveAll(List.of(
                    exampleProduct, haczyk1, haczyk2, haczyk3,
                    przyneta1, przyneta2, robaki, robaki2,
                    wedka1, wedka2, wedka3, key
            ));
        };
    }
}
