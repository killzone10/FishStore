package com.example.app.config;
import com.example.app.model.Role;
import com.example.app.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Configuration
public class RoleConfig {
    @Bean
    CommandLineRunner roleDataLoader(RoleRepository repository){
        return args -> {
            Role worker  = new Role(
                    "worker"
            );
            Role manager  = new Role(
                    "manager"
            );

            repository.saveAll(List.of(worker, manager));
        };
    }
}
