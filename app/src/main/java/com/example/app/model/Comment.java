package com.example.app.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime dataPosted;

    private Integer starAmount;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private AppUser author;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
