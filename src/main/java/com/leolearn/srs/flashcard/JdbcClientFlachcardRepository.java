package com.leolearn.srs.flashcard;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import jakarta.annotation.PostConstruct;

@Repository
public class JdbcClientFlachcardRepository {
    
	private static final Logger log = LoggerFactory.getLogger(JdbcClientFlachcardRepository.class);
    private final JdbcClient jdbcClient;

    public JdbcClientFlachcardRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Flashcard> findAll() {
        return jdbcClient.sql("select * from flashcard")
            .query(Flashcard.class)
            .list();
    }

    public Optional<Flashcard> findById(Integer id) {
        return jdbcClient.sql("select * from flashcard where id = :id")
            .param("id", id)
            .query(Flashcard.class)
            .optional();
    }

    public void create(Flashcard flashcard) {
        var updated = jdbcClient.sql("insert into flashcard (id,frontText, backText, dateCreated, lastReviewed, reviewIntervalDays, easefactor, nextReviewDate) values (?, ?, ?, ?, ?, ?, ?)")
            .params(List.of(flashcard.id(),flashcard.frontText(), flashcard.backText(), flashcard.dateCreated(), flashcard.lastReviewed(), flashcard.reviewIntervalDays(), flashcard.nextReviewDate()))
            .update();
        
        Assert.state(updated == 1, "Failed to create flashcard" + flashcard.frontText());
    }

    public void update(Flashcard flashcard, Integer id) {
        var updated = jdbcClient.sql("update flashcard set frontText = ?, backText = ?, dateCreated = ?, lastReviewed = ?, reviewIntervalDays = ?, easefactor = ?, nextReviewDate = ? where id = ?")
        .params(List.of(flashcard.id(),flashcard.frontText(), flashcard.backText(), flashcard.dateCreated(), flashcard.lastReviewed(), flashcard.reviewIntervalDays(), flashcard.nextReviewDate()))
            .update();
        
        Assert.state(updated == 1, "Failed to update flashcard" + flashcard.frontText());
    }

    public void delete(Integer id) {
        var updated = jdbcClient.sql("delete from flashcard where id = :id")
            .params("id", id)
            .update();
        
        Assert.state(updated == 1, "Failed to delete flashcard" + id);
    }

    public int count() {
        return jdbcClient.sql("select * from flashcard")
            .query()
            .listOfRows()
            .size();
    }

    public void saveAll(List<Flashcard> flashcards) {
        flashcards.stream().forEach(this::create);
    }

}
