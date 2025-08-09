package com.leolearn.srs.flashcard;

import java.util.List;

import org.springframework.data.repository.ListCrudRepository;

public interface FlashcardRepository extends ListCrudRepository<Flashcard, Integer> {
    
   
    List<Flashcard> findAllByLocation(String location); 
    

} 
