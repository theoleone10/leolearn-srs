package com.leolearn.srs.flashcard;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

enum Difficulty {
    VEASY(4), EASY(3), MEDIUM(2), HARD(1);

    private final int rating;

    Difficulty(int rating) {
        this.rating = rating;
    }

    public int getRating() {
        return rating;
    }
}

record ReviewRequest(
    Difficulty difficulty
) {}


@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    private final FlashcardRepository flashcardRepository;

    public FlashcardController(FlashcardRepository flashcardRepository) {
        this.flashcardRepository = flashcardRepository;
    }
    
    @GetMapping("")
    List<Flashcard> findAll() {
        return flashcardRepository.findAll();
    }

    @GetMapping("/{id}")
    Flashcard findById(@PathVariable Integer id) {

      Optional<Flashcard> flashcard = flashcardRepository.findById(id);
      if (flashcard.isEmpty()) {
        throw new FlashcardNotFoundException();
      }
      return flashcard.get();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    void create(@Valid @RequestBody Flashcard flashcard) {
        flashcardRepository.save(flashcard);
    }

    @PostMapping("/{id}/review")
    Flashcard review(@PathVariable Integer id, @RequestBody ReviewRequest request) {
        Flashcard flashcard = flashcardRepository.findById(id)
            .orElseThrow(FlashcardNotFoundException::new);

        float easeFactor = flashcard.easeFactor();
        int repititions = flashcard.repititions();
        int rating = request.difficulty().getRating();
        float reviewIntervalDays = flashcard.reviewIntervalDays();

        
        if (rating < 3){
            repititions = 0;
            reviewIntervalDays = 1;
        } else {
            if (repititions == 0){
                reviewIntervalDays = 1;
            } else if (repititions == 1) {
                reviewIntervalDays = 6;
            } 
            repititions++;
            reviewIntervalDays = easeFactor * reviewIntervalDays;
        }

        easeFactor = (float) (flashcard.easeFactor() + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
        easeFactor = Math.max(1.3f, easeFactor);
        easeFactor = Math.min(2.9f, easeFactor);

        LocalDateTime lastReviewed = LocalDateTime.now();
        Flashcard updated = new Flashcard(
            flashcard.id(),
            flashcard.frontText(),
            flashcard.backText(),
            flashcard.dateCreated(),
            lastReviewed,
            reviewIntervalDays,
            easeFactor,
            repititions,
            lastReviewed.plusDays((long) reviewIntervalDays)
        );

        flashcardRepository.save(updated);
        return updated;

    }

    // put
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    void update(@Valid @RequestBody Flashcard flashcard, @PathVariable Integer id) {
        flashcardRepository.save(flashcard);
    }

    // delete
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    void delete(@PathVariable Integer id) {
        flashcardRepository.delete(flashcardRepository.findById(id).get());
    }

}
