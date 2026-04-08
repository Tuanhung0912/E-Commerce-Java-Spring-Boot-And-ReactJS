package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @NotBlank
    @Size(min = 5, message = "Street name must be atleast 5 characters")
    private String street;

    @NotBlank
    @Size(min = 5, message = "Building Name name must be atleast 5 characters")
    private String buildingName;

    @NotBlank
    @Size(min = 5, message = "City Name name must be atleast 5 characters")
    private String city;

    @NotBlank
    @Size(min = 2, message = "State Name name must be atleast 5 characters")
    private String state;

    @NotBlank
    @Size(min = 2, message = "Country Name name must be atleast 5 characters")
    private String country;

    @NotBlank
    @Size(min = 5, message = "PinCode Name name must be atleast 5 characters")
    private String pinCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Address(String country, String buildingName, String city, String pinCode, String state, String street) {
        this.country = country;
        this.buildingName = buildingName;
        this.city = city;
        this.pinCode = pinCode;
        this.state = state;
        this.street = street;
    }
}
