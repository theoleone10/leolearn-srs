package com.leolearn.srs.flashcard;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;


public record Flashcard(
    @Id
    Integer id,
    String frontText,
    String backText,
    LocalDateTime dateCreated,
    LocalDateTime lastReviewed,        
    Float reviewIntervalDays, 
    Float easeFactor,
    Integer repetitions,       
    LocalDateTime nextReviewDate,
    Integer deckId,
    @Version
    Integer version
)
{
    public Flashcard {
        // if(!nextReviewDate.isAfter(lastReviewed)) {
        //     throw new IllegalArgumentException("next Review Date must be after last Reviewed");
        // }
    }
}