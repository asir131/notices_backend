# Notices

## Project overview

Notices is a two-part application for creating, managing, and publishing employee notices. The backend provides REST APIs for notice CRUD, status updates, and file uploads, while the frontend (Next.js) offers a dashboard UI for creating, viewing, filtering, and publishing notices.

## Tech stack

Backend:

- Node.js + Express
- MongoDB (Mongoose)
- Multer (file uploads)

Frontend:

- Next.js (App Router)
- React
- Tailwind CSS
- Radix UI

## Installation steps

1. Backend setup

- Open a terminal in `notices_backend`.
- Install dependencies:
  - `npm install`
- Create `notices_backend/.env` (see ENV instructions below).
- Start the backend:
  - `npm start`

2. Frontend setup

- Open a terminal in `notices_frontend`.
- Install dependencies:
  - `npm install`
- Create `notices_frontend/.env` (see ENV instructions below).
- Start the frontend:
  - `npm run dev`

## ENV variable instructions

Backend (`notices_backend/.env`):

- `MONGODB_URI` (required): MongoDB connection string.
- `PORT` (optional): Port for the API server. Defaults to 5000.

Example:
MONGODB_URI=mongodb+srv://afaysal220:Faysal20122@blinkit.typzf.mongodb.net/notice
PORT=5000

Frontend (`notices_frontend/.env`):

- `NEXT_PUBLIC_BASE_URL` (required): Base URL for the backend API.

Example:
NEXT_PUBLIC_BASE_URL=http://localhost:5000

## API reference

Base URL: `${NEXT_PUBLIC_BASE_URL}`

1. Health check

- `GET /api/health`
- Response: `{ "status": "ok" }`

2. Create notice (published/unpublished or draft)

- `POST /api/notices`
- Content-Type: `multipart/form-data`
- Body fields:
  - `target` (string)
  - `title` (string)
  - `employeeId` (string)
  - `employeeName` (string)
  - `position` (string, optional)
  - `noticeType` (string)
  - `publishDate` (string, ISO date)
  - `noticeBody` (string)
  - `status` (string, optional) Use `Draft` to save as draft.
  - `attachment` (file, optional) PDF upload.
- Behavior:
  - If `status` is `Draft`, required fields are not enforced.
  - Otherwise, required fields must be present and status becomes `Unpublished`.

3. List notices

- `GET /api/notices`
- Optional query:
  - `status=Draft|Published|Unpublished`
- Behavior:
  - Automatically updates notices from `Unpublished` to `Published` when `publishDate <= now`.

4. Get notice by ID

- `GET /api/notices/:id`

5. Update notice by ID

- `PUT /api/notices/:id`
- Content-Type: `multipart/form-data`
- Required fields (all):
  - `target`, `title`, `employeeId`, `employeeName`, `noticeType`, `publishDate`, `noticeBody`
- Optional fields:
  - `position`, `attachment` (file)
- Behavior:
  - Status is reset to `Unpublished` on update.

6. Update notice status

- `PATCH /api/notices/:id/status`
- Content-Type: `application/json`
- Body:
  - `{ "status": "Published" | "Unpublished" }`

## File uploads

Uploaded files are stored in `notices_backend/uploads` and served at:

- `GET /uploads/<filename>`
