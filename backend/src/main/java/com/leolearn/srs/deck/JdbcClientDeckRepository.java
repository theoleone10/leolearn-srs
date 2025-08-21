package com.leolearn.srs.deck;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.util.Assert;


public class JdbcClientDeckRepository {
    private static final Logger log = LoggerFactory.getLogger(JdbcClientDeckRepository.class);
    private final JdbcClient jdbcClient;

    public JdbcClientDeckRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Deck> findAll() {
        return jdbcClient.sql("select * from deck")
            .query(Deck.class)
            .list();
    }

    public Optional<Deck> findById(Integer id) {
        return jdbcClient.sql("select * from deck where id = :id")
            .param("id", id)
            .query(Deck.class)
            .optional();
    }

    public void create(Deck deck) {
        var updated = jdbcClient.sql("insert into deck (id,name, description, date_created, cards_per_day) values (coalesce(max(id),0) + 1, ?, ?, ?, ?) from deck")
            .params(List.of(deck.id(),deck.name(), deck.description(), deck.dateCreated(), deck.cardsPerDay()))
            .update();
        
        Assert.state(updated == 1, "Failed to create deck" + deck.name());
    }

    public void update(Deck deck, Integer id) {
        var updated = jdbcClient.sql("update deck set name = ?, description = ?, dateCreated = ?, cards_per_day = ? where id = ?")
        .params(List.of(deck.id(),deck.name(), deck.description(), deck.dateCreated(), deck.cardsPerDay()))
            .update();
        
        Assert.state(updated == 1, "Failed to update deck" + deck.name());
    }

    public void delete(Integer id) {
        var updated = jdbcClient.sql("delete from deck where id = :id")
            .params("id", id)
            .update();
        
        Assert.state(updated == 1, "Failed to delete deck" + id);
    }

    public int count() {
        return jdbcClient.sql("select * from deck")
            .query()
            .listOfRows()
            .size();
    }

    public void saveAll(List<Deck> decks) {
        decks.stream().forEach(this::create);
    }
}
