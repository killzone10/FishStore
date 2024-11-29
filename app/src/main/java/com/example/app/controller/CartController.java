        package com.example.app.controller;

        import com.example.app.dto.CartItemResponse;
        import com.example.app.model.Cart;
        import com.example.app.service.CartService;
        import jakarta.transaction.Transactional;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.http.HttpStatus;
        import org.springframework.http.ResponseEntity;

        import org.springframework.web.bind.annotation.*;

        import java.util.Collections;
        import java.util.List;

        @RestController
        @RequestMapping("/api/cart")
        public class CartController {

            final private CartService cartService;

            @Autowired
            CartController(CartService cartService){
                this.cartService = cartService;
            }

            @PostMapping("/{userLogin}/add/{productId}/{quantity}")
            public ResponseEntity<?> addProductToCart(
                    @PathVariable String userLogin,
                    @PathVariable Long productId,
                    @PathVariable Long quantity
            ){
                try{
                    Cart updatedCart = cartService.addProductToCart(userLogin, productId, quantity);
                    return ResponseEntity.ok(updatedCart);
                }
                catch(RuntimeException e){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
                }
            }

            @GetMapping("/{userLogin}")
            public ResponseEntity<List<CartItemResponse>> getCartItems(@PathVariable String userLogin) {
                try {
                    List<CartItemResponse> cartItems = cartService.getCartItems(userLogin);
                    return ResponseEntity.ok(cartItems);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
                }
            }

//          @Transactional
            @PutMapping("/{userLogin}/update/{productId}/{quantity}")
            public ResponseEntity<?> changeProductInCart(
                    @PathVariable String userLogin,
                    @PathVariable Long productId,
                    @PathVariable Long quantity){
                try{
//                    Cart updatedCart = cartService.changeProductInCart(userLogin, productId, quantity);
                    List<CartItemResponse> cartItems = cartService.changeProductInCart(userLogin, productId, quantity);

                    return ResponseEntity.ok(cartItems);

                }
                catch(RuntimeException e){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
                }

            }
        @DeleteMapping("/{userLogin}/remove/{productId}")
        public ResponseEntity<?> deleteProductFromCart(
                @PathVariable String userLogin,
                @PathVariable Long productId){
            try{
                List<CartItemResponse> cartItems = cartService.deleteProductFromCart(userLogin, productId);
                return ResponseEntity.ok(cartItems);

            }
            catch(RuntimeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }

        }
        }

