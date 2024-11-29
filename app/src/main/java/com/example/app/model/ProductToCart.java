package com.example.app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "product_to_cart")
public class ProductToCart {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "cart_id", nullable = false)
        @JsonIgnore
        private Cart cart;

        @ManyToOne
        @JoinColumn(name = "product_id", nullable = false)
        @JsonIgnore
        private Product product;

        private long quantity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductToCart(Cart cart, Product product, long quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
    }

    public ProductToCart() {
    }

}

