package com.petfull.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.petfull.backend.model.User;

@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

   // private String donorName;

    @Column(length = 500)
    private String description;

    private double quantity;

    private String unit; // kg, g, packets, etc.
    private LocalDateTime manufacturedDateTime;

    private LocalDateTime expiryDateTime;

    private String city;
    private String state;
    private String pincode;

    private String status; // AVAILABLE, CLAIMED, EXPIRED
    private String imagePath;   // food cover image
private String videoPath;   // optional video

    // 🔗 Later we will connect this to User
   // private Long userId;
   @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "donor_id", nullable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
private User donor;


    // ---------- Constructors ----------
    public Donation() {}

    // ---------- Getters & Setters ----------

    public Long getId() {
        return id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    // public String getDonorName() {
        // return donorName;
    // }

    // public void setDonorName(String donorName) {
        // this.donorName = donorName;
    // }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getExpiryDateTime() {
        return expiryDateTime;
    }

    public void setExpiryDateTime(LocalDateTime expiryDateTime) {
        this.expiryDateTime = expiryDateTime;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

   // public Long getUserId() {
     //   return userId;
    //}

 //   public void setUserId(Long userId) {
   //     this.userId = userId;
    //}
    public LocalDateTime getManufacturedDateTime() {
    return manufacturedDateTime;
}

public void setManufacturedDateTime(LocalDateTime manufacturedDateTime) {
    this.manufacturedDateTime = manufacturedDateTime;
}

public String getImagePath() {
    return imagePath;
}

public void setImagePath(String imagePath) {
    this.imagePath = imagePath;
}

public String getVideoPath() {
    return videoPath;
}

public void setVideoPath(String videoPath) {
    this.videoPath = videoPath;
}
public User getDonor() {
    return donor;
}

public void setDonor(User donor) {
    this.donor = donor;
}


}
