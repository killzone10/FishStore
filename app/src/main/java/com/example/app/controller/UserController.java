package com.example.app.controller;

import com.example.app.dto.*;
import com.example.app.model.AppUser;
import com.example.app.model.Role;
import com.example.app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;

    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AppUser user) {
        try {
            String jwt = userService.authenticateUser(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(jwt);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/roles")
    public ResponseEntity<Set<String>> getUserRoles(Principal principal){
        try{
            AppUser user = userService.findByUsername(principal.getName());
            Set<String> roles = user.getRoles().stream().map(Role::getAuthority)
                    .collect(Collectors.toSet());
            return ResponseEntity.ok(roles);
        }
        catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptySet());
        }

    }

    @GetMapping("/{userLogin}/info")
    public ResponseEntity<?> getUserInfo(@PathVariable String userLogin) {
        try{

            UserInfoResponse userInfo = userService.getUserInfo(userLogin);
            return ResponseEntity.ok(userInfo);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }

    }

    @PutMapping("/{userLogin}/changeBaseInfo")
    public ResponseEntity<?> changeUserBaseInfo(@PathVariable String userLogin,
                                         @Valid @RequestBody UserInfoChangeRequest userInfoChangeRequest) {
        try{
            AppUser updatedUserInfo = userService.changeUserBaseInfo(userLogin, userInfoChangeRequest);
            return ResponseEntity.ok(updatedUserInfo);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }

    }

    @PutMapping("/{userLogin}/changeAdressInfo")
    public ResponseEntity<?> changeUserAdressInfo(@PathVariable String userLogin,
                                                  @RequestBody UserAdressChangeRequest userAdressChangeRequest) {
        try {
            AppUser updatedUserInfo = userService.changeUserAdressInfo(userLogin, userAdressChangeRequest);
            return ResponseEntity.ok(updatedUserInfo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }


    }
        @PutMapping("/{userLogin}/changePassword")
        public ResponseEntity<?> changePassword(@PathVariable String userLogin,
                @Valid @RequestBody UserPasswordChangeRequest userPasswordChangeRequest) {
            try{
                AppUser updatedUserInfo = userService.changeUserPasswordInfo(userLogin, userPasswordChangeRequest);
                return ResponseEntity.ok(updatedUserInfo);
            }
            catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error:" + e);
            }
            catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
            }

        }


}
