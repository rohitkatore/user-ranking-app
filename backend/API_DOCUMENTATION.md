# User Ranking App - API Endpoints

## Base URL

http://localhost:5000/api

## Available Endpoints

### 1. Add User

**POST** `/users`

```json
{
  "name": "John Doe"
}
```

### 2. Get All Users

**GET** `/users`

### 3. Claim Points

**POST** `/users/:userId/claim`

### 4. Get Leaderboard

**GET** `/leaderboard`

### 5. Get User Claim History (Bonus)

**GET** `/users/:userId/history`

## Example API Calls (using curl or Postman)

### Create a user:

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'
```

### Claim points (replace USER_ID with actual user ID):

```bash
curl -X POST http://localhost:5000/api/users/USER_ID/claim
```

### Get leaderboard:

```bash
curl http://localhost:5000/api/leaderboard
```

## Features Implemented

✅ **Robust Error Handling**: All endpoints wrapped in try-catch blocks
✅ **Input Validation**: Name validation, ObjectId validation
✅ **Duplicate User Prevention**: MongoDB duplicate key error handling (E11000)
✅ **Atomic Updates**: Using `$inc` operator for point updates
✅ **Optimized Queries**: Using `.select()` for minimal payload
✅ **Professional Structure**: Separated routes, controllers, and models
✅ **Development Environment**: Nodemon for auto-restart
✅ **Timestamps**: Automatic createdAt/updatedAt fields
✅ **Claim History Tracking**: Complete audit trail of all point claims
✅ **Ranked Leaderboard**: Sorted by points with rank numbers

## Database Models

### User Schema

- `name`: String (required, unique, trimmed)
- `totalPoints`: Number (default: 0, minimum: 0)
- `timestamps`: Automatic createdAt/updatedAt

### ClaimHistory Schema

- `userId`: ObjectId reference to User
- `pointsClaimed`: Number (required)
- `timestamp`: Date (default: Date.now)

## Error Response Format

```json
{
  "error": "Error message",
  "message": "Detailed error (development only)"
}
```

## Success Response Format

```json
{
  "message": "Success message",
  "data": {
    /* relevant data */
  }
}
```
