package com.example.app.config;

import com.example.app.model.AppUser;
import com.example.app.repository.UserRepository;
import com.example.app.util.JwtAuthTokenFilter;
import com.example.app.util.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final UserRepository userRepository; // Add this field
    private final JwtUtils jwtUtils;

    public SecurityConfig(UserRepository userRepository, JwtUtils jwtUtils) { // Inject UserRepository via constructor
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf().disable() // Disable CSRF for testing; consider enabling it in production
                .authorizeRequests(authorize -> authorize
                        .requestMatchers("/api/v1/student/**").permitAll()
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/roles").authenticated()
                        .requestMatchers("/api/brand/create").authenticated()
                        .requestMatchers("/api/brand/get").permitAll()
                        .requestMatchers("/images/**").permitAll()

                        .requestMatchers("/api/product/create").authenticated()
                        .requestMatchers("/api/product/**").permitAll() // Allow access
                        .requestMatchers("/api/types/create").authenticated()
                        .requestMatchers("/api/types/get").permitAll()

                        .requestMatchers("api/cart").authenticated()
                        .requestMatchers("api/order").authenticated()

                        .anyRequest().authenticated() // Require authentication for other requests
                )
                .addFilterBefore(jwtAuthTokenFilter(), UsernamePasswordAuthenticationFilter.class); // Add JWT filter before UsernamePasswordAuthenticationFilter

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                AppUser user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                return User.builder()
                        .username(user.getUsername())
                        .password(user.getPassword()) // this is the encoded password
                        .build();
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // apply CORS settings to all paths
        return source;
    }

    @Bean
    public JwtAuthTokenFilter jwtAuthTokenFilter() {
        return new JwtAuthTokenFilter(jwtUtils, userDetailsService()); // pass in JwtUtils and UserDetailsService
    }
}
