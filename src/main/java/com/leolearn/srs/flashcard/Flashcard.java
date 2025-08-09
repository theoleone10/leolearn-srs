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
    Float reviewIntervalDays, 
    Float easeFactor,
    Integer repititions,       
    LocalDateTime nextReviewDate

)
{
    public Flashcard {
        if(!nextReviewDate.isAfter(lastReviewed)) {
            throw new IllegalArgumentException("nex tReview Date must be after last Reviewed");
        }
    }
}