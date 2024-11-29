package com.example.app.service;

import com.example.app.dto.*;
import com.example.app.model.*;
import com.example.app.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final CityRepository cityRepository;
    private final CartRepository cartRepository;
    private final OrderProductRepository orderProductRepository;

    @Autowired
    public OrderService(UserRepository userRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository,
                        AddressRepository addressRepository,
                        CityRepository cityRepository,
                        CartRepository cartRepository,
                        OrderProductRepository orderProductRepository){
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.cityRepository = cityRepository;
        this.cartRepository = cartRepository;
        this.orderProductRepository = orderProductRepository;
    }

    @Transactional
    public void createOrder(OrderRequest orderRequest) {
        AppUser user = userRepository.findByUsername(orderRequest.getUserLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // check if items are avaible
        for (OrderItemRequest item : orderRequest.getItems()){
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName() + "\nPlease remove it from your cart");
            }
        }
        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDateTime.now());

        order.setEmail(orderRequest.getEmail());
        order.setStatus(0);
        order.setTotalPrice(orderRequest.getTotalPrice());
        // City and address part
        String cityName = orderRequest.getCity();
        City city = cityRepository.findCityByName(cityName)
                .orElseGet(() ->{
                    City newCity = new City();
                    newCity.setName(cityName);
                    return cityRepository.save(newCity);
                });

        String street = orderRequest.getStreet();
        String houseNr = orderRequest.getHouseNr();
        String postalCode = orderRequest.getPostalCode();

        // adress part if it doesnt exist create new
        Address existingAddress = addressRepository.findByStreetAndHouseNrAndPostalCodeAndCity(
                street, houseNr, postalCode, city)
                .orElseGet(()->{
                    Address newAddress = new Address();
                    newAddress.setStreet(street);
                    newAddress.setHouseNr(houseNr);
                    newAddress.setPostalCode(postalCode);
                    newAddress.setCity(city);
                    return addressRepository.save(newAddress);
                });

        order.setAddress(existingAddress);


        Set<OrderProduct> orderProducts = orderRequest.getItems().stream().map(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setProduct(product);
            orderProduct.setOrder(order);
            orderProduct.setQuantity(item.getQuantity());

            return orderProduct;
        }).collect(Collectors.toSet());


        order.setOrderProducts(orderProducts);

        orderProducts.forEach(orderProduct -> orderProduct.setOrder(order));

        try {
            for (OrderItemRequest item : orderRequest.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);
            }
            orderRepository.save(order);
            Cart userCart = cartRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Cart not found for user"));

            userCart.getItems().clear();
            cartRepository.save(userCart);


        } catch (Exception e) {
            System.out.println("Error while saving order: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<Order>getUserOrders(String userLogin){
        AppUser user = userRepository.findByUsername(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findAllByUserId(user.getId());


    }

    public List<Product> getProductsFromOrderId(Long orderId) {
        List<OrderProduct> orderProducts = orderProductRepository.findAllByOrderId(orderId);
        if (orderProducts.isEmpty()) {
            throw new RuntimeException("No products found for this order.");
        }
        return orderProducts.stream()
                .map(orderProduct -> productRepository.findById(orderProduct.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found for ID: " + orderProduct.getProduct().getId())))
                .toList();
    }

    public List<ProductOrderDetails> getProductsFromOrder(Long orderId) {
        List<OrderProduct> orderProducts = orderProductRepository.findAllByOrderId(orderId);
        if (orderProducts.isEmpty()) {
            throw new RuntimeException("No products found for this order.");
        }

        return orderProducts.stream()
                .map(orderProduct -> {
                    Product product = orderProduct.getProduct();

                    return new ProductOrderDetails(product.getName(),
                            product.getPrice(),
                            orderProduct.getQuantity(),
                            orderProduct.getId(),
                            product.getPhoto(),
                            orderId);
                })
                .collect(Collectors.toList());
    }
}
