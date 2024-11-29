package com.example.app.dto;

public class ProductOrderDetails {
    private String name;
    private Float price;
    private Integer quantity;
    private Long productId;
    private String photo;
    private Long orderId;
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ProductOrderDetails() {
    }

    public ProductOrderDetails(String name, Float price, Integer quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }


    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public ProductOrderDetails(String name,
                               Float price,
                               Integer quantity,
                               Long productId,
                               String photo,
                               Long orderId) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.productId = productId;
        this.photo = photo;
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
