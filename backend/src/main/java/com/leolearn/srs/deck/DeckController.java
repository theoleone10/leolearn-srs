package com.leolearn.srs.deck;


import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import jakarta.validation.Valid;



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
    void create(@Valid @RequestBody Deck deck) {
        deckRepository.save(deck);
    }

    // put
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/{id}")
    void update(@Valid @RequestBody Deck deck, @PathVariable Integer id) {
        deckRepository.save(deck);
    }

    // delete
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public
    void delete(@PathVariable Integer id) {
        deckRepository.delete(deckRepository.findById(id).get());
    }
}
