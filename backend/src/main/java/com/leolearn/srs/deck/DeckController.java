package com.leolearn.srs.deck;


import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/decks")
public class DeckController {
    private final DeckRepository deckRepository;

    public DeckController(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }
    
    @GetMapping("")
    List<Deck> findAll() {
        return deckRepository.findAll();
    }

    @GetMapping("/{id}")
    Deck findById(@PathVariable Integer id) {

      Optional<Deck> deck = deckRepository.findById(id);
      if (deck.isEmpty()) {
        throw new DeckNotFoundException();
      }
      return deck.get();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    Deck create(@Valid @RequestBody Deck deck) {
        return deckRepository.save(deck);
    }

    // put
    @PutMapping("/{id}")
    Deck update(@Valid @RequestBody Deck deck, @PathVariable Integer id) {
        Deck existing = deckRepository.findById(id)
            .orElseThrow(DeckNotFoundException::new);

        Deck updatedDeck = new Deck(
            id,
            deck.name(),
            deck.description(),
            existing.dateCreated(),
            deck.cardsPerDay()
        );

        return deckRepository.save(updatedDeck);
    }

    // delete
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public
    void delete(@PathVariable Integer id) {
        deckRepository.delete(deckRepository.findById(id).get());
    }
}
