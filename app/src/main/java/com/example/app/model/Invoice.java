package com.example.app.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "invoice")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime data;

    @Column(nullable = false)
    private String seller;

    private Integer identificationNumber;

    @OneToOne
    @JoinColumn(name = "orders_id", unique = true, nullable = false)
    private Order order;
}