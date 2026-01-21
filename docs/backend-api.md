# Backend API Details (Frontend)

## Base
- Base URL: http://localhost:5000/api
- JSON only: Content-Type: application/json
- CORS allowed: http://localhost:3000, http://localhost:5173

## Auth flow
- Signup -> receive token -> store (localStorage or memory) -> send Authorization: Bearer <token> for protected routes.
- Token expires in 30d.

## Auth endpoints

### POST /api/auth/signup
Body:
```
{ "name": "Ali", "email": "ali@example.com", "password": "secret123" }
```
Success 201:
```
{ "token": "...", "user": { "id": "...", "name": "Ali", "email": "ali@example.com" } }
```
Errors:
- 400 missing fields
- 400 password too short (min 6)
- 400 email already in use
- 500 signup failed

### POST /api/auth/login
Body:
```
{ "email": "ali@example.com", "password": "secret123" }
```
Success 200:
```
{ "token": "...", "user": { "id": "...", "name": "Ali", "email": "ali@example.com" } }
```
Errors:
- 400 missing fields
- 400 invalid email or password
- 401 invalid email or password
- 500 login failed

### GET /api/auth/me (protected)
Headers:
- Authorization: Bearer <token>
Success 200:
```
{ "id": "...", "name": "Ali", "email": "ali@example.com" }
```
Errors:
- 401 no token / invalid token
- 404 user not found
- 500 failed to fetch user

### POST /api/auth/logout (optional)
Success 200:
```
{ "message": "Logged out" }
```

## Managed users (dashboard users)
All routes are protected, owner-scoped to the logged-in auth user.

### GET /api/users
Headers:
- Authorization: Bearer <token>
Success 200:
```
[
  {
    "_id": "...",
    "ownerId": "...",
    "name": "User 1",
    "houseNumber": "12A",
    "phoneNumber": "03001234567",
    "expiryDate": "2026-02-01T00:00:00.000Z",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```
Errors:
- 401
- 500

### POST /api/users
Body (all required):
```
{
  "name": "User 1",
  "houseNumber": "12A",
  "phoneNumber": "03001234567",
  "expiryDate": "2026-02-01"
}
```
Success 201: returns created managed user document
Errors:
- 400 missing fields
- 400 invalid expiryDate
- 401
- 500

### PUT /api/users/:id
Body (any subset):
```
{ "phoneNumber": "03009998888", "expiryDate": "2026-03-01" }
```
Success 200: returns updated managed user document
Errors:
- 400 no fields
- 400 invalid expiryDate or invalid id
- 404 not found (wrong id or not owned)
- 401
- 500

### DELETE /api/users/:id
Success 200:
```
{ "message": "Managed user deleted" }
```
Errors:
- 400 invalid id
- 404 not found (wrong id or not owned)
- 401
- 500

## Validation rules
Auth:
- email required, unique, stored lowercase
- password min length 6

Managed user:
- name, houseNumber, phoneNumber, expiryDate required
- expiryDate must be parseable as Date (use ISO string or YYYY-MM-DD)

## Frontend integration checklist
- Store JWT from signup/login and attach to all /api/users + /api/auth/me requests.
- Handle 401 by redirecting to login and clearing token.
- Use ISO date string when sending expiryDate.
