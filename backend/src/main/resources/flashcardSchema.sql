CREATE TABLE IF NOT EXISTS Flashcard (
    id INT NOT NULL,
    frontText TEXT,
    backText TEXT,
    dateCreated timestamp NOT NULL,
    lastReviewed timestamp,        
    reviewIntervalDays FLOAT NOT NULL,
    easeFactor FLOAT NOT NULL,     
    repetitions INT NOT NULL,   
    nextReviewDate timestamp NOT NULL,
    deckId INT, 
    version INT,
    PRIMARY KEY (id)
);