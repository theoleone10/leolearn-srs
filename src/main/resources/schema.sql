CREATE TABLE IF NOT EXISTS Flashcard (
    id INT NOT NULL,
    frontText varchar(250) NOT NULL,
    backText varchar(250) NOT NULL,
    dateCreated timestamp NOT NULL,
    lastReviewed timestamp,        
    reviewIntervalDays FLOAT NOT NULL,
    easeFactor FLOAT NOT NULL,     
    repetition INT NOT NULL,   
    nextReviewDate timestamp NOT NULL
    PRIMARY KEY (id)
);