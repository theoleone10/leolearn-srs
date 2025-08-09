package com.leolearn.srs.flashcard;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

public record Flashcard(
    @Id
    Integer id,
    String frontText,
    String backText,
    LocalDateTime dateCreated,
    LocalDateTime lastReviewed,        
    Integer reviewIntervalDays,        
    LocalDateTime nextReviewDate

)
{
    // public Flashcard {
    //     if(!completedOn.isAfter(startedOn)) {
    //         throw new IllegalArgumentException("Completed On must be after Started On");
    //     }
    // }
}