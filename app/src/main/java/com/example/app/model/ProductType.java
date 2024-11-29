package com.example.app.model;
import jakarta.persistence.*;


@Entity
@Table(name = "product_type")
public class ProductType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private ProductType parent;



    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ProductType getParent() {
        return parent;
    }

    public void setParent(ProductType parent) {
        this.parent = parent;
    }
    @Override
    public String toString() {
        return "ProductType{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", parent=" + parent +
                '}';
    }

    public ProductType() {
    }

    public ProductType(String title) {
        this.title = title;
    }
}
