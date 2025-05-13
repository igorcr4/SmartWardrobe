package com.example.smartwardrobe.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;

import java.util.HashSet;
import java.util.Set;

import static org.hibernate.annotations.OnDeleteAction.CASCADE;

@Entity
@Table(name = "garments")
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Garment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;

    @Column(name = "garment_type")
    private String type;
    private String imageUrl;

    @ManyToMany(mappedBy = "garments", fetch = FetchType.EAGER,
            cascade = {CascadeType.MERGE , CascadeType.PERSIST/*, CascadeType.DETACH, CascadeType.REFRESH*/})
    @JsonBackReference
    private Set<Outfit> outfits = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
