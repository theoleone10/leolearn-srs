package com.leolearn.srs.user;

public record User(
    Integer id,
    String username,
    String email,
    Address address,
    String phone,
    String website,
    Company company
) {
} 
