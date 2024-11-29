package com.example.app.dto;

public class UserAdressChangeRequest {
    private String postalCode;
    private String city;
    private String street;
    private String houseNr;

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getHouseNr() {
        return houseNr;
    }

    public void setHouseNr(String houseNr) {
        this.houseNr = houseNr;
    }

    public UserAdressChangeRequest(String postalCode, String city, String street, String houseNr) {
        this.postalCode = postalCode;
        this.city = city;
        this.street = street;
        this.houseNr = houseNr;
    }

    public UserAdressChangeRequest() {
    }
}
