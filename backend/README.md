# Spring Boot Auth Backend (MySQL)

## Overview
This is a minimal Spring Boot backend for registration and login using MySQL.
It stores users and writes a login record when a user successfully logs in.
Session-based simple check for `/home` is included.

## Setup
1. Install MySQL and create a database, e.g. `authdb`.
2. Update `src/main/resources/application.properties` with your DB credentials.
3. Build & run:
   ```bash
   mvn clean package
   mvn spring-boot:run
   ```
4. Endpoints:
   - POST /api/auth/register  (JSON: { username, password, fullName })
   - POST /api/auth/login     (JSON: { username, password })
   - GET  /home               (redirects to a rough home page if logged in)

