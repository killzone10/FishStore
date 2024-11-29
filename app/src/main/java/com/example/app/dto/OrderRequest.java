package com.example.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class OrderRequest {
    private String userLogin;

    @NotNull(message = "Items cannot be null.")
    private List<OrderItemRequest> items;
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address.")
    private String email;
    private String street;
    @NotBlank(message = "House number is required")
    private String houseNr;
    @NotBlank(message = "City is required.")

    private String city;
    @NotBlank(message = "Postal code is required.")

    private String postalCode;

    private Float totalPrice;

    public Float getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public OrderRequest() {
    }

    public OrderRequest(String userLogin, List<OrderItemRequest> items) {
        this.userLogin = userLogin;
        this.items = items;
    }

    public OrderRequest(String userLogin,
                        List<OrderItemRequest> items,
                        String email,
                        String street,
                        String houseNr,
                        String city,
                        String postalCode) {
        this.userLogin = userLogin;
        this.items = items;
        this.email = email;
        this.street = street;
        this.houseNr = houseNr;
        this.city = city;
        this.postalCode = postalCode;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getHouseNr() {
        return houseNr;
    }

    public void setHouseNr(String houseNr) {
        this.houseNr = houseNr;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }
}

