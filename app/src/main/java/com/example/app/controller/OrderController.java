package com.example.app.controller;

import com.example.app.dto.OrderRequest;
import com.example.app.dto.ProductOrderDetails;
import com.example.app.model.Order;
import com.example.app.model.Product;
import com.example.app.service.OrderService;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("api/orders")
@Validated
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService){
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        try {
            orderService.createOrder(orderRequest);
            return ResponseEntity.ok("Order placed successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("{userLogin}")
    public ResponseEntity<?> getOrder(@PathVariable String userLogin){
        try {
            List<Order> orders = orderService.getUserOrders(userLogin);
            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(orders);
        }
         catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
//    @GetMapping("/{orderId}")
//    public ResponseEntity<?> getProductsFromOrder(@PathVariable String userLogin){
//        try {
//            List<Order> orders = orderService.getUserOrders(userLogin);
//            if (orders.isEmpty()) {
//                return ResponseEntity.noContent().build();
//            }
//            return ResponseEntity.ok(orders);
//        }
//        catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

    @GetMapping("/{orderId}/product")
    public ResponseEntity<?> getProductsFromOrder(@PathVariable Long orderId){
        try {
            List<ProductOrderDetails> products = orderService.getProductsFromOrder(orderId);
            if (products.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(products);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
