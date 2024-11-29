package com.example.app.model;
import jakarta.persistence.*;

import java.util.Set;


@Entity
@Table(name = "warehouse")
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer maxCapacity;

    @OneToMany(mappedBy = "warehouse")
    private Set<Sector> sectors;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
}
