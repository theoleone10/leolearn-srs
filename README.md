# Leolearn SRS

Leolearn SRS is a full-stack spaced repetition system for managing study decks and flashcards. The backend is a Spring Boot application that exposes REST endpoints for creating decks, reviewing flashcards, and scheduling the next review using a custom algorithm. The frontend is a React + Vite app that consumes these APIs and provides the user interface.

## Tech stack

- **Backend:** Java 24, Spring Boot, PostgreSQL, Cloudinary for image uploads
- **Frontend:** React 19, Vite, Tailwind CSS

## Development setup

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The application expects a PostgreSQL database. A minimal `compose.yml` is provided to start a Postgres container:

```bash
cd backend
docker compose up
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server runs on <http://localhost:5173> and is configured for CORS with the backend.

## Testing

Run backend tests with Maven:

```bash
cd backend
./mvnw test
```

Lint the frontend code:

```bash
cd frontend
npm run lint
```

## License

This project is provided as-is for educational purposes.

