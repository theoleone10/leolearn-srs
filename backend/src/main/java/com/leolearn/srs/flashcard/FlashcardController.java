package com.leolearn.srs.flashcard;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.leolearn.srs.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;


record ReviewRequest(
    int rating
) {}


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    private final FlashcardRepository flashcardRepository;
    private final CloudinaryService cloudinaryService;

    // ---- SRS tuning knobs (distinct effects per rating) ----
    private static final float MIN_EASE = 1.3f;
    private static final float MAX_EASE = 2.9f;

    private static final float EASY_BONUS = 1.30f;       // rating=4 multiplier
    private static final float VERY_EASY_BONUS = 1.50f;  // rating=5 multiplier

    private static final float HARD_SAME_DAY = 0.007f;    // rating=1 -> ~10 minutes

    private static final float VERY_HARD_EASE_DROP = 0.40f; // rating=1
    private static final float HARD_EASE_DROP = 0.20f;      // rating=2
    private static final float GOOD_EASE_DELTA = -0.05f;    // rating=3 (counter inflation)
    private static final float EASY_EASE_BOOST = 0.05f;     // rating=4
    private static final float VERY_EASY_EASE_BOOST = 0.15f;// rating=5

    public FlashcardController(FlashcardRepository flashcardRepository, CloudinaryService cloudinaryService) {
        this.flashcardRepository = flashcardRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("")
    public List<Flashcard> findAll() {
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
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Flashcard create(
        @RequestParam(value = "frontText", required = false) String frontText,
        @RequestParam(value = "backText", required = false) String backText,
        @RequestParam("deckId") Integer deckId,
        @RequestPart(value = "frontImage", required = false) MultipartFile frontImage,
        @RequestPart(value = "backImage", required = false) MultipartFile backImage
    ) {
        String frontUrl = cloudinaryService.uploadImage(frontImage);
        String backUrl = cloudinaryService.uploadImage(backImage);
        LocalDateTime now = LocalDateTime.now();
        Flashcard flashcard = new Flashcard(
            null,
            frontText,
            backText,
            frontUrl,
            backUrl,
            now,
            null,
            1.0f,
            2.5f,
            0,
            now,
            deckId,
            null,
            null,
            false,
            null
        );
        return flashcardRepository.save(flashcard);
    }

    @PostMapping("/{id}/review")
    Flashcard review(@PathVariable Integer id, @RequestBody ReviewRequest request) {
        Flashcard flashcard = flashcardRepository.findById(id)
            .orElseThrow(FlashcardNotFoundException::new);

        int rating = request.rating();               // expected 1..5
        float ef = flashcard.easeFactor();           // ease factor
        int reps = flashcard.repetitions();          // correct-in-a-row
        float lastIntervalDays = Math.max(0f, flashcard.reviewIntervalDays());
        float reviewIntervalDays;

        // ---- Distinct early-base intervals by rating ----
        // First two successful repetitions have explicit bases; failures differ too.
        // base1: first interval after this rating
        // base2: second interval after this rating
        switch (rating) {
            case 1: // Very hard / Again: same-day retry, big ease hit, reset reps
                reps = 0;
                reviewIntervalDays = base1(1);
                ef = Math.max(MIN_EASE, ef - VERY_HARD_EASE_DROP);
                break;

            case 2: // Hard: next day, moderate ease drop, reset reps
                reps = 0;
                reviewIntervalDays = base1(2);
                ef = Math.max(MIN_EASE, ef - HARD_EASE_DROP);
                break;

            case 3: // Good: standard growth
                if (reps == 0) {
                    reviewIntervalDays = base1(3);
                } else if (reps == 1) {
                    reviewIntervalDays = base2(3);
                } else {
                    reviewIntervalDays = Math.max(1.0f, ef * Math.max(1.0f, lastIntervalDays));
                }
                reps += 1;
                ef = clamp(ef + GOOD_EASE_DELTA, MIN_EASE, MAX_EASE);
                break;

            case 4: // Easy: bonus multiplier, small ease boost
                if (reps == 0) {
                    reviewIntervalDays = base1(4);
                } else if (reps == 1) {
                    reviewIntervalDays = base2(4);
                } else {
                    reviewIntervalDays = Math.max(1.0f, ef * EASY_BONUS * Math.max(1.0f, lastIntervalDays));
                }
                reps += 1;
                ef = clamp(ef + EASY_EASE_BOOST, MIN_EASE, MAX_EASE);
                break;

            case 5: // Very easy: bigger bonus, extra rep bump, larger ease boost
                if (reps == 0) {
                    reviewIntervalDays = base1(5);
                } else if (reps == 1) {
                    reviewIntervalDays = base2(5);
                } else {
                    reviewIntervalDays = Math.max(1.0f, ef * VERY_EASY_BONUS * Math.max(1.0f, lastIntervalDays));
                }
                reps += 2; // extra bump to further separate from rating=4
                ef = clamp(ef + VERY_EASY_EASE_BOOST, MIN_EASE, MAX_EASE);
                break;

            default: // treat out-of-range as "good"
                if (reps == 0) {
                    reviewIntervalDays = base1(3);
                } else if (reps == 1) {
                    reviewIntervalDays = base2(3);
                } else {
                    reviewIntervalDays = Math.max(1.0f, ef * Math.max(1.0f, lastIntervalDays));
                }
                reps += 1;
                ef = clamp(ef + GOOD_EASE_DELTA, MIN_EASE, MAX_EASE);
                break;
        }

        // Compute next review timestamp; support fractional-day intervals
        LocalDateTime lastReviewed = LocalDateTime.now();
        long minutes = Math.max(1L, Math.round(reviewIntervalDays * 24f * 60f));

        LocalDateTime firstSeenAt = flashcard.firstSeenAt();
        java.time.LocalDate introducedOn = flashcard.introducedOn();
        if (firstSeenAt == null) {
            firstSeenAt = lastReviewed;
            introducedOn = java.time.LocalDate.now();
        }

        Flashcard updated = new Flashcard(
            flashcard.id(),
            flashcard.frontText(),
            flashcard.backText(),
            flashcard.frontImageUrl(),
            flashcard.backImageUrl(),
            flashcard.dateCreated(),
            lastReviewed,
            reviewIntervalDays,
            ef,
            reps,
            lastReviewed.plusMinutes(minutes),
            flashcard.deckId(),
            firstSeenAt,
            introducedOn,
            flashcard.suspended(),
            flashcard.version()
        );

        flashcardRepository.save(updated);
        return updated;
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

    // ---------- helpers ----------

    private static float clamp(float v, float min, float max) {
        return Math.max(min, Math.min(max, v));
    }

    private static float base1(int rate) {
        switch (rate) {
            case 1: return HARD_SAME_DAY; // ~10 minutes
            case 2: return 1.0f;          // next day
            case 3: return 2.0f;          // good
            case 4: return 3.0f;          // easy
            case 5: return 5.0f;          // very easy
            default: return 1.0f;
        }
    }

    private static float base2(int rate) {
        switch (rate) {
            case 1: return HARD_SAME_DAY; // ~12h again
            case 2: return 2.0f;          // 2 days
            case 3: return 6.0f;          // good
            case 4: return 8.0f;          // easy
            case 5: return 12.0f;         // very easy
            default: return 6.0f;
        }
    }
}
