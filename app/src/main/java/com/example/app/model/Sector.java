package com.example.app.model;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "sector")
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer maxCapacity;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @OneToMany(mappedBy = "sector")
    private Set<Worker> workers;

    @OneToMany(mappedBy = "sector")
    private Set<Product> products;
}
