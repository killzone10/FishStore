package com.example.app.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name ="product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length  = 100)
    private String photo;
    @Column(length =  60)
    private String name;
    private Float price;


    private Integer quantity;
    @Column(length  = 200)
    private String description;

    // relations
    @ManyToMany
    @JoinTable(
            name = "product_is_favourite",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns =  @JoinColumn(name = "users_id")
    )
    private List<AppUser> favourite;

    @OneToMany(mappedBy = "product")
    private List<Comment> comments;
//    @ManyToMany
//    @JoinTable(
//            name = "product_has_cart",
//            joinColumns = @JoinColumn(name = "product_id"),
//            inverseJoinColumns = @JoinColumn(name = "cart_id")
//    )
//    private Set<Cart> hasCart = new HashSet<>();
    @OneToMany(mappedBy = "product")
    private Set<ProductToCart> cartItems = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = true)
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = true)
    private ProductType type;

//    @ManyToMany
//    @JoinTable(
//            name = "product_has_order",
//            joinColumns = @JoinColumn(name = "product_id"),
//            inverseJoinColumns = @JoinColumn(name = "orders_id")
//    )
//    private Set<Order> hasOrder = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderProduct> orderProducts = new HashSet<>();

    public Set<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(Set<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

    @ManyToOne
    @JoinColumn(name = "sector_id", nullable = true)
    private Sector sector;

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<AppUser> getFavourite() {
        return favourite;
    }

    public void setFavourite(List<AppUser> favourite) {
        this.favourite = favourite;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

//    public Set<Cart> getHasCart() {
//        return hasCart;
//    }
//
//    public void setHasCart(Set<Cart> hasCart) {
//        this.hasCart = hasCart;
//    }


    public Set<ProductToCart> getCartItems() {
        return cartItems;
    }

    public void setCartItems(Set<ProductToCart> cartItems) {
        this.cartItems = cartItems;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public ProductType getType() {
        return type;
    }

    public void setType(ProductType type) {
        this.type = type;
    }

//    public Set<Order> getHasOrder() {
//        return hasOrder;
//    }
//
//    public void setHasOrder(Set<Order> hasOrder) {
//        this.hasOrder = hasOrder;
//    }

    public Sector getSector() {
        return sector;
    }

    public void setSector(Sector sector) {
        this.sector = sector;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }
    public Long getId() {
        return id;
    }


    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = true)
    private Warehouse warehouse;

    public Product() {
    }

    public Product(String name, Float price, Integer quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public Product(String name, Float price, String photo, Integer quantity, Brand brand) {
        this.name = name;
        this.price = price;
        this.photo = photo;
        this.quantity = quantity;
        this.brand = brand;
    }

    public Product(String photo, String name, Float price, Integer quantity, String description, Brand brand, ProductType type) {
        this.photo = photo;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.brand = brand;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Product{" +
                "name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                '}';
    }

}
