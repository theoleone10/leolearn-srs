package com.leolearn.srs.flashcard;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FlashcardNotFoundException extends RuntimeException {
    public FlashcardNotFoundException() {
        super("Flashcard not found");
    }
}
