package com.leolearn.srs.deck;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotEmpty;

public record Deck(
    @Id
    Integer id,
    @NotEmpty
    String name,
    String description,
    LocalDateTime dateCreated,
    Integer cardsPerDay
) {
} 
