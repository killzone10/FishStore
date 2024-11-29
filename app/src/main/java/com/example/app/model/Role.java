package com.example.app.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "role")
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    public String getAuthority() {
        return name;
    }

    public Role(String name) {
        this.name = name;
    }

    public Role() {
    }
}
