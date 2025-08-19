CREATE TABLE IF NOT EXISTS Flashcard (
    id INT NOT NULL,
    frontText TEXT,
    backText TEXT,
    frontImageUrl VARCHAR(100),
    backImageUrl VARCHAR(100),
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