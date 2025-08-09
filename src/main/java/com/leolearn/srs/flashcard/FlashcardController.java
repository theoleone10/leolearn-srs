package com.leolearn.srs.flashcard;

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
