CREATE TABLE IF NOT EXISTS Flashcard (
    id INT NOT NULL,
    frontText varchar(250) NOT NULL,
    frontText varchar(250) NOT NULL,
    dateCreated timestamp NOT NULL,
    lastReviewed timestamp,        
    reviewIntervalDays INT NOT NULL,        
    nextReviewDate timestamp NOT NULL
    PRIMARY KEY (id)
);