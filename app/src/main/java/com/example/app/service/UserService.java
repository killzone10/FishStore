package com.example.app.service;

import com.example.app.dto.*;
import com.example.app.model.Address;
import com.example.app.model.AppUser;
import com.example.app.model.Cart;
import com.example.app.model.City;
import com.example.app.repository.AddressRepository;
import com.example.app.repository.CityRepository;
import com.example.app.repository.UserRepository;
import com.example.app.util.JwtUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final CityRepository cityRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    public UserService(UserRepository userRepository,
                       AddressRepository addressRepository,
                       CityRepository cityRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cityRepository = cityRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public AppUser registerUser(UserRegistrationRequest userRequest){
        if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (userRequest.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        if (!userRequest.getPassword().equals(userRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        // City part
        City city = cityRepository.findCityByName(userRequest.getCityName())
                .orElseGet(() -> {
                    City newCity = new City();
                    newCity.setName(userRequest.getCityName());
                    return cityRepository.save(newCity);
                });


        // adress part
        Address address = new Address();
        address.setStreet(userRequest.getStreet());
        address.setHouseNr(userRequest.getHouseNr());
        address.setPostalCode(userRequest.getPostalCode());
        address.setCity(city);
        Address savedAddress = addressRepository.save(address);

        AppUser user = new AppUser();
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setEmail(userRequest.getEmail());
        user.setFirstName(userRequest.getFirstName());
        user.setSecondName(userRequest.getSecondName());
        user.setPhone(userRequest.getPhone());
        user.setAddress(savedAddress);
        user.setPhone((Integer.parseInt(userRequest.getPhoneNumber())));
        Cart cart = new Cart(user);
        user.setCart(cart);
        return userRepository.save(user);
    }

    public String authenticateUser(String username, String password) {
        try {
            Authentication authenticationRequest = new UsernamePasswordAuthenticationToken(username, password);
            Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);
            SecurityContextHolder.getContext().setAuthentication(authenticationResponse);
            String result =  jwtUtils.generateJwtToken(authenticationResponse);
            return result;
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Invalid username or password ", e);
        }
    }

    public AppUser findByUsername(String username) {
        Optional<AppUser> userOptional = userRepository.findByUsername(username);
        return userOptional.orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public UserInfoResponse getUserInfo(String userLogin){
        AppUser user = userRepository.findByUsername(userLogin).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));

        Address address = user.getAddress();
        String cityName = (address != null && address.getCity() != null) ? address.getCity().getName() : "";
        String street = (address != null) ? address.getStreet() : "";
        String postalCode = (address != null) ? address.getPostalCode() : "";
        String houseNumber = (address != null) ? address.getHouseNr() : null;
        return new UserInfoResponse(
                user.getFirstName() != null ? user.getFirstName() : "",
                user.getSecondName() != null ? user.getSecondName() : "",
                user.getEmail() != null ? user.getEmail() : "",
                cityName,
                street,
                postalCode,
                user.getPhone(),
                houseNumber
        );

    }

    @Transactional
    public AppUser changeUserBaseInfo(String userLogin, UserInfoChangeRequest userInfoChangeRequest){
        AppUser user = userRepository.findByUsername(userLogin).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));
        user.setFirstName(userInfoChangeRequest.getFirstName());
        user.setSecondName(userInfoChangeRequest.getSecondName());
        user.setEmail(userInfoChangeRequest.getEmail());
        user.setPhone(userInfoChangeRequest.getPhone());

        return userRepository.save(user);

    }

    @Transactional
    public AppUser changeUserAdressInfo(String userLogin, UserAdressChangeRequest userAdressChangeRequest){
        AppUser user = userRepository.findByUsername(userLogin).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));

        City city = cityRepository.findCityByName(userAdressChangeRequest.getCity())
                .orElseGet(() -> {
                    City newCity = new City();
                    newCity.setName(userAdressChangeRequest.getCity());
                    return cityRepository.save(newCity);
                });

        // check if the address exists, or create a new one
        Optional<Address> existingAddress = addressRepository.findByStreetAndHouseNrAndPostalCodeAndCity(
                userAdressChangeRequest.getStreet(),
                userAdressChangeRequest.getHouseNr(),
                userAdressChangeRequest.getPostalCode(),
                city
        );


        Address address = existingAddress.orElseGet(() -> {
            Address newAddress = new Address();
            newAddress.setStreet(userAdressChangeRequest.getStreet());
            newAddress.setHouseNr(userAdressChangeRequest.getHouseNr());
            newAddress.setPostalCode(userAdressChangeRequest.getPostalCode());
            newAddress.setCity(city);
            return addressRepository.save(newAddress);
        });

        user.setAddress(address);
        return userRepository.save(user);
    }


        @Transactional
        public AppUser changeUserPasswordInfo(String userLogin, UserPasswordChangeRequest userPasswordChangeRequest){
            AppUser user = userRepository.findByUsername(userLogin).orElseThrow(
                    () -> new UsernameNotFoundException("User not found"));

            if (!passwordEncoder.matches(userPasswordChangeRequest.getCurrentPassword(), user.getPassword())){
                throw new IllegalArgumentException("Old password is incorrect");
            }
            String encodedNewPassword = passwordEncoder.encode(userPasswordChangeRequest.getNewPassword());
            user.setPassword(encodedNewPassword);
            return userRepository.save(user);
        }

}
