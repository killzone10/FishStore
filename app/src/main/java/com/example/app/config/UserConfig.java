package com.example.app.config;
import com.example.app.model.AppUser;
import com.example.app.model.Cart;
import com.example.app.model.Role;
import com.example.app.repository.RoleRepository;
import com.example.app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

@Configuration
public class UserConfig {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository; // Inject RoleRepository

    public UserConfig(PasswordEncoder passwordEncoder, RoleRepository roleRepository) {

        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Bean
    CommandLineRunner userDataLoader(UserRepository repository){
        return args -> {
            AppUser admin  = new AppUser(
                    "1",
                    passwordEncoder.encode("1"),
                    "1@1.wp.pl"
            );
            AppUser user  = new AppUser(
                    "2",
                    passwordEncoder.encode("2"),
                    "2@1.wp.pl"
            );
            Cart adminCart = new Cart(admin);
            Cart userCart = new Cart(user);
            admin.setCart(adminCart);
            user.setCart(userCart);

            Role userRole  = new Role(
                    "user"
            );
            Role adminRole  = new Role(
                    "admin"
            );
            user.setRoles(Set.of(userRole));
            admin.setRoles(Set.of(userRole, adminRole));
            roleRepository.saveAll(List.of(userRole, adminRole));

            repository.saveAll(List.of(admin, user));
        };
    }
}
