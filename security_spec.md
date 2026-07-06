# Security Specification: World College of Medical

## 1. Data Invariants
- Anyone can read statistics, courses, departments, faculty, and notices to browse college information.
- Anyone can submit admissions requests and contact messages.
- Admin mode operates with custom local authentication, meaning Firebase JS SDK calls are technically unauthenticated (anonymous client-side). Therefore, read/write permissions on core entities are accessible to client-side JS SDK.
- The server-side synchronization state (`app_state`) allows read and write permissions to enable multi-device and Vercel syncing.

## 2. The "Dirty Dozen" Payloads
To check for boundaries and security, we identify key payloads that shouldn't crash the server or violate data models:
1. Empty statistical records.
2. Negative seating intake for courses.
3. Empty title/content notices.
4. Extremely large payload messages (Denial of Wallet).
5. SQL Injection/NoSQL Injection inputs in search strings.
6. Malformed document IDs.
7. Overly long string inputs (e.g. 1MB in text fields).
8. Missing required properties on admissions.
9. Invalid categories for notices.
10. Attempt to overwrite state revision with a string.
11. Missing email formats.
12. Attempt to write to arbitrary unmapped paths.

## 3. The Validation Architecture
Since this application operates on a local client-side authentication model, the client-side calls are evaluated directly against basic schema validations.
Our security rules will enforce:
- Exact path matching.
- Default-deny for any collections not explicitly defined.
