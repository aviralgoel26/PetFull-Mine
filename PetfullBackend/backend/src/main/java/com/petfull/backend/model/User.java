package com.petfull.backend.model;
import jakarta.persistence.*;
import org.springframework.aot.generate.GeneratedTypeReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String fullName;
    @Column(unique = true)
    private String email;
    @JsonIgnore
    private String password;
    private String role; /// DONOR, RECIPIENT, ADMIN
    @Column(nullable = false)
    private String donorStatus="UNVERIFIED";
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;

    public User(){}
    public User(String fullName, String email, String password, String role, String phone, String address, String city, String state, String pincode)
    {
        this.fullName=fullName;
        this.email=email;
        this.password=password;
        this.role=role;
        this.donorStatus = "UNVERIFIED";
        this.phone=phone;
        this.address=address;
        this.city=city;
        this.state=state;
        this.pincode=pincode;
    }
     /// ---Getters and Setters---///
     public Long getId() { return id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getDonorStatus() { return donorStatus; }
    public void setDonorStatus(String donorStatus) { this.donorStatus = donorStatus; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}

