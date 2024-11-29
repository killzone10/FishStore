package com.example.app.service;

import com.example.app.dto.CartItemResponse;
import com.example.app.model.AppUser;
import com.example.app.model.Cart;
import com.example.app.model.Product;
import com.example.app.model.ProductToCart;
import com.example.app.repository.CartRepository;
import com.example.app.repository.ProductRepository;
import com.example.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    @Autowired
    CartService(UserRepository userRepository,
                ProductRepository productRepository,
                CartRepository cartRepository){
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }

    public Cart addProductToCart(String userLogin, Long productId, long quantity){
        AppUser user = userRepository.findByUsername(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = user.getCart();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductToCart existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null){
            if (existingItem.getQuantity() + quantity > product.getQuantity()){
                existingItem.setQuantity(product.getQuantity());
                return cartRepository.save(cart);
            }
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        }
        else{
            ProductToCart newProduct = new ProductToCart(cart, product, quantity);

            cart.getItems().add(newProduct);
        }
        return cartRepository.save(cart);

    }

    public List<CartItemResponse> getCartItems(String userLogin){
        AppUser user = userRepository.findByUsername(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();

        Cart cart =  cartRepository.findByUserId(userId)
                    .orElseThrow(() -> new IllegalArgumentException
                            ("Cart not found for user with ID: " + userId));
        return cart.getItems().stream().map(item-> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getProduct().getPhoto()
                ))
                .toList();
    }

    @Transactional
    public List<CartItemResponse> changeProductInCart(String userLogin, Long productId, long quantity){
        AppUser user = userRepository.findByUsername(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = user.getCart();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductToCart existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem == null){
            throw new RuntimeException("Cart not found");
        }
        if (quantity > product.getQuantity()){
            existingItem.setQuantity(product.getQuantity());
        }
        else {
            existingItem.setQuantity(quantity);
        }
        cartRepository.save(cart);
        return cart.getItems().stream().map(item-> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getProduct().getPhoto()
                ))
                .toList();

    }


    public List<CartItemResponse> deleteProductFromCart(String userLogin, Long productId){
        AppUser user = userRepository.findByUsername(userLogin)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = user.getCart();

        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductToCart existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);


        if (existingItem == null){
            throw new RuntimeException("Cart not found");
        }
        cart.getItems().remove(existingItem);
        cartRepository.save(cart);

        return cart.getItems().stream().map(item-> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getProduct().getPhoto()
                ))
                .toList();

    }


}
