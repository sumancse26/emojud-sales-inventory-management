# JWT Authentication Implementation

This document outlines the plan to implement JWT authentication using
**access tokens** and **refresh tokens** in the Next.js application.

## ⚠️ User Review Required

> **Warning**
>
> This implementation changes the authentication mechanism. Once
> deployed, **all currently logged-in users will be logged out**.
>
> Before deployment, add the following environment variable:
>
> ``` env
> JWT_SECRET=your-secure-secret-here
> ```

## ❓ Open Questions

### 1. Token Refresh Strategy

Currently, the Next.js App Router's `middleware.js` protects
authenticated routes.

Two possible approaches:

#### Option A (Recommended)

-   Middleware verifies the access token.
-   If the access token has expired but the refresh token is still
    valid:
    -   Generate a new access token.
    -   Attach the new token to the response cookies.
    -   Continue the request without interrupting the user.

#### Option B

-   Create a dedicated endpoint:
    -   `/api/auth/refresh`
-   The frontend calls this endpoint whenever it receives a **401
    Unauthorized** response.
-   The endpoint validates the refresh token and issues a new access
    token.

### 2. Session ID Handling

The database currently generates a `session_id`.

Questions:

-   Should the `session_id` be embedded inside the refresh token?
-   Should it continue to be stored as a separate cookie?
-   Or should authentication rely entirely on JWTs?

------------------------------------------------------------------------

# Proposed Changes

## Dependencies

Install the JWT library:

``` bash
npm install jose
```

### Why `jose`?

-   Compatible with the Next.js Edge Runtime
-   Works in Middleware
-   Modern API
-   Better than `jsonwebtoken` for App Router applications

------------------------------------------------------------------------

# Core Utilities

## New File

``` text
src/lib/jwt.js
```

Responsibilities:

-   `getJwtSecretKey()`
    -   Reads the JWT secret from environment variables.
-   `signAccessToken(payload)`
    -   Generates an access token.
    -   Expiration: **15 minutes**
-   `signRefreshToken(payload)`
    -   Generates a refresh token.
    -   Expiration: **7 days**
-   `verifyAuthToken(token)`
    -   Verifies JWT signature.
    -   Returns decoded payload if valid.

------------------------------------------------------------------------

# API Routes

## Modify

``` text
src/app/api/auth/login/route.js
```

### Changes

After successful login:

1.  Generate an **Access Token**
2.  Generate a **Refresh Token**
3.  Store both as **HTTP-only cookies**

Cookie configuration:

  Cookie          Expiration
  --------------- ------------
  access_token    15 minutes
  refresh_token   7 days

------------------------------------------------------------------------

## Modify

``` text
src/app/api/auth/logout/route.js
```

### Changes

Clear the following cookies:

-   access_token
-   refresh_token
-   user_info

------------------------------------------------------------------------

## New Route

``` text
src/app/api/auth/refresh/route.js
```

Responsibilities:

-   Read the refresh token from cookies.
-   Verify the refresh token.
-   Generate a new access token.
-   Set the new access token cookie.
-   Return success.

------------------------------------------------------------------------

# Middleware

## Modify

``` text
src/middleware.js
```

### Responsibilities

1.  Read:

    -   access_token
    -   refresh_token

2.  Verify the access token.

3.  If access token has expired:

    -   Verify refresh token.
    -   Generate a new access token.
    -   Set the new cookie.
    -   Continue the request.

4.  If both tokens are invalid:

    -   Redirect to `/login`

------------------------------------------------------------------------

# Authentication Flow

``` text
User Login
      │
      ▼
Validate Credentials
      │
      ▼
Generate Access Token (15m)
      │
      ▼
Generate Refresh Token (7d)
      │
      ▼
Store Both as HTTP-only Cookies
      │
      ▼
Authenticated Requests
      │
      ▼
Middleware
      │
      ├───────────────┐
      │               │
Access Valid      Access Expired
      │               │
      ▼               ▼
 Continue      Verify Refresh Token
                     │
                     ▼
          Generate New Access Token
                     │
                     ▼
              Continue Request
```

------------------------------------------------------------------------

# Verification Plan

## Manual Testing Checklist

### Login

-   Log in successfully.
-   Verify:
    -   `access_token` cookie exists.
    -   `refresh_token` cookie exists.
    -   Cookies are HTTP-only.

### Automatic Refresh

-   Delete the `access_token` cookie.
-   Refresh the application.
-   Verify the middleware creates a new access token using the refresh
    token.

### Logout

-   Log out.
-   Verify all authentication cookies are removed:
    -   `access_token`
    -   `refresh_token`
    -   `user_info`

------------------------------------------------------------------------

# Recommended Improvements

-   Use separate secrets for **Access** and **Refresh** tokens.
-   Rotate the refresh token every time it is used.
-   Store a **hashed refresh token** in the database.
-   Track active sessions using a `user_sessions` table.
-   Include:
    -   Device
    -   IP Address
    -   User Agent
    -   Login Time
    -   Last Activity
-   Support forced logout by revoking refresh tokens.
-   Use Secure and SameSite cookies in production.
