# SDA Metadata Registry Portal

A prototype of the **State Data Authority (SDA) of Uttar Pradesh** Metadata Registry Platform — built as part of the Bharti Institute of Public Policy assignment.

The platform has two interfaces:

1. **Dataset Discovery Portal** — search and filter datasets registered by UP departments
2. **Dataset Registration Form** — submit new dataset entries for review

---

## Running Locally

### Prerequisites

- Node.js 18+

### 1. Backend (Express)

```bash
cd backend
npm install
npm start
```

The API will be available at `http://localhost:8001`.

For development with auto-reload:

```bash
npm run dev
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Project Structure

```
sda-metadata-portal/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── components/
│   │   └── pages/
│   ├── .env
│   ├── .env.example
│   └── package.json
├── data/
│   └── seed_datasets.json
└── README.md
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/datasets` | List datasets. Params: `sector`, `classification`, `status`, `search` |
| GET | `/api/datasets/:id` | Get a single dataset by ID |
| POST | `/api/datasets` | Register a new dataset |
| GET | `/api/sectors` | List distinct sectors |
| GET | `/api/departments` | List distinct departments |

### GET /api/datasets — example

```
GET /api/datasets?sector=Health&classification=Public
```

Response:
```json
{
  "total": 1,
  "datasets": [{ "id": "UP-HEA-003", "title": "Health Facility Registry – HMIS UP", ... }]
}
```

### POST /api/datasets — required fields

```json
{
  "title": "My Dataset",
  "department": "Revenue Department",
  "sector": "Land & Revenue",
  "formats": ["CSV"],
  "update_frequency": "Monthly",
  "description": "Dataset description here.",
  "classification": "Public"
}
```

Returns `201` on success, `422` with error details if required fields are missing or blank.

---

## Design Decisions

**No external UI library.** Plain CSS keeps the bundle small and the styling easy to reason about — no need to learn a component library's override system for a prototype of this size.

**Slide-over panel for detail view.** Clicking a dataset opens a panel from the right rather than navigating away, so the user's filter state is preserved.

**Debounced search.** The search input waits 250ms before hitting the API, avoiding a request on every keystroke.

**Axios with a service layer.** All API calls go through `src/services/api.js`. The base URL comes from `.env` so switching environments is a one-line change.

**In-memory data store.** The seed JSON is loaded into an array at startup. New POST entries are appended immediately and are queryable for the duration of the session. Acceptable for a prototype; a real deployment would use a database.

---

## What I Would Add With More Time

- Pagination for the dataset list
- A proper database (SQLite would be fine at this scale)
- Sort options on the discovery portal — by last updated, record count, etc.
- An admin view to approve or reject pending submissions
- Authentication on the registration form
- Export to CSV from the discovery view
