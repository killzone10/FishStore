package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserPasswordChangeRequest {
    @NotBlank(message = "Old password cannot be blank")
    private String currentPassword;
    @NotBlank(message = "New password cannot be blank")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String newPassword;

    public UserPasswordChangeRequest(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public UserPasswordChangeRequest() {
    }


    public @NotBlank(message = "Old password cannot be blank") String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(@NotBlank(message = "Old password cannot be blank") String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
