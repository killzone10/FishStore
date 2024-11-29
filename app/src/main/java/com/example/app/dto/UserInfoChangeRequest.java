package com.example.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserInfoChangeRequest {
    private String firstName;
    private String secondName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address.")
    private String email;
    private Integer phone;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getSecondName() {
        return secondName;
    }

    public void setSecondName(String secondName) {
        this.secondName = secondName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getPhone() {
        return phone;
    }

    public void setPhone(Integer phone) {
        this.phone = phone;
    }

    public UserInfoChangeRequest(Integer phone, String email, String secondName, String firstName) {
        this.phone = phone;
        this.email = email;
        this.secondName = secondName;
        this.firstName = firstName;
    }

    public UserInfoChangeRequest() {
    }
}
