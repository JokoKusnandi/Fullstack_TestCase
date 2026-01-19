Senior Fullstack Developer – Technical Test Case
##Case Title

Document Management System (DMS) – Mini Fullstack Platform

##Objective

Build a small fullstack application that allows users to:

Register & login

Upload documents

View, search, replace, and delete documents

Request permission before replacing/deleting

Receive notifications

This simulates a real enterprise system (API, database, auth, UI, and workflow).

##Tech Stack (example – can be flexible)

Backend

Node.js (NestJS / Express) or Python (FastAPI / Django)

REST API

JWT authentication

MySQL or PostgreSQL

Optional: Redis, S3/MinIO, Docker

Frontend

React / Next.js / Vue

Clean UI, form validation, API integration

#Core Features
1. Authentication

Register

Login

JWT protected APIs

Role support: USER, ADMIN

2. Document Management

Upload document

List documents (pagination + search)

View document detail

Replace document

Delete document

Document fields:

id
title
description
documentType
fileUrl
version
status (ACTIVE, PENDING_DELETE, PENDING_REPLACE)
createdBy
createdAt

3. Permission Workflow

When user wants to:

Replace document

Delete document

System must:

Create permission request

Notify admin

Lock the document until approved

Admin can:

Approve

Reject

4. Notification System

Store notifications in DB

Show list of notifications in UI

Mark as read

5. Frontend Requirements

Login page

Dashboard

Document list + search + filter

Upload modal/form

Replace/Delete with confirmation

Admin approval page

#Mandatory Test Scenarios
Backend

1. JWT middleware

2. Role-based access

3. Validation & error handling

4. Pagination & filtering

5. Transaction-safe replace/delete

6 Clean architecture (service, repo, controller)

Frontend

1. Auth guard

2. API error handling

3. Responsive layout

4. Reusable components

5 Loading & empty states

##System Design Questions (must be answered)

How to handle large file uploads?

How to avoid lost updates when replacing documents?

How to design notification system for scalability?

How to secure file access?

How to structure services for microservice migration?


## Answered System Design Questions

---

# 1️⃣ How to handle large file uploads?

###  Problem

* Upload file besar (PDF, DOC, IMG)
* Risiko: memory overload, timeout, request gagal
* Backend Django **tidak cocok** menampung file besar di RAM

---

##  SOLUSI ARSITEKTUR (Recommended)

### A. **Direct-to-Storage Upload (BEST PRACTICE)**

Frontend **langsung upload ke object storage**
Backend hanya generate **signed URL**

```
[Browser]
   │
   │ 1. Request signed URL
   ▼
[Backend API]
   │
   │ 2. Signed URL
   ▼
[Browser] ── upload ──▶ [S3 / GCS / MinIO]
```

### Implementasi:

* Storage: **AWS S3 / GCS / MinIO**
* Backend:

```python
POST /documents/upload-url/
→ return presigned_url
```

### Keuntungan:

✅ Tidak membebani backend
✅ Aman
✅ Bisa upload file > 1GB

---

### B. **Chunked Upload (Fallback)**

Jika harus lewat backend:

* Upload per chunk (5–10MB)
* Resume jika gagal

Tools:

* `django-chunked-upload`
* `tus.io`

---

### C. Server Configuration

* Nginx:

```nginx
client_max_body_size 500M;
```

* Django:

```python
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
```

---

# 2️ How to avoid lost updates when replacing documents?

###  Problem

* User A & User B request replace bersamaan
* Admin approve → overwrite data lama
* Update **hilang tanpa disadari**

---

##  SOLUSI 1: **Optimistic Locking (RECOMMENDED)**

Gunakan **version field** 

```python
version = models.IntegerField(default=1)
```

### Saat replace:

```python
if request.data["version"] != doc.version:
    return 409 Conflict
```

### Saat approve:

```python
doc.version += 1
doc.save()
```

📌 Jika version berubah → **tolak replace**

---

##  SOLUSI 2: **Immutable Document Versioning**

JANGAN overwrite file lama

```text
Document
 ├── id
 ├── parent_document
 ├── version
 ├── file
 ├── status
```

➡️ Setiap replace = **row baru**

### Keuntungan:

✅ Audit trail
✅ Rollback
✅ Legal compliance

---

## ❌ JANGAN

* Update file langsung tanpa version
* `doc.file = new_file` tanpa lock

---

# 3️⃣ How to design notification system for scalability?

### 🎯 Problem

* Banyak user request
* Banyak admin
* Notifikasi synchronous = bottleneck

---

##  EVENT-DRIVEN ARCHITECTURE

### Flow:

```text
User Request
   ↓
PermissionRequest Created
   ↓
Event Published
   ↓
Message Queue
   ↓
Notification Service
```

---

## Tools (Production Ready)

| Layer   | Tool                           |
| ------- | ------------------------------ |
| Event   | Django signals / Domain events |
| Queue   | RabbitMQ / Kafka / Redis       |
| Worker  | Celery                         |
| Channel | Email / WebSocket / Push       |

---

## Example (Celery):

```python
@shared_task
def notify_admin_task(permission_id):
    ...
```

Triggered in service:

```python
notify_admin_task.delay(permission.id)
```

---

## Scaling Benefit

✅ Horizontal scaling
✅ Retry mechanism
✅ Non-blocking API

---

# 4️⃣ How to secure file access?

###  Problem

* File URL bisa di-copy
* User bisa akses dokumen orang lain

---

##  SOLUSI 1: **Private Storage + Signed URL**

* File **tidak public**
* Backend generate URL sementara

```python
generate_signed_url(file, expires=5min)
```

➡️ URL **expired otomatis**

---

##  SOLUSI 2: **Access Control Middleware**

File access lewat API:

```http
GET /documents/{id}/download/
```

Backend:

```python
if request.user != doc.createdBy and not is_admin:
    return 403
```

---

##  SOLUSI 3: **Encryption-at-Rest**

* S3 SSE
* Encrypted disk

---

##  JANGAN

* Expose `/media/documents/` langsung
* Hardcode URL file

---

# 5️⃣ How to structure services for microservice migration?

###  Problem

Monolith sekarang, tapi ingin scalable & future-proof

---

##  CURRENT (Monolith Modular – BEST STEP)

```
documents/
permissions/
notifications/
users/
```

➡️ Ini **SUDAH BENAR** 👏

---

## ✅ SERVICE BOUNDARIES (Future Microservices)

| Service              | Responsibility    |
| -------------------- | ----------------- |
| Document Service     | File + metadata   |
| Permission Service   | Approval workflow |
| User Service         | Auth & roles      |
| Notification Service | Email / WS        |

---

##  MIGRATION STRATEGY (SAFE)

### Step 1 – Internal Services

```python
documents/services/
permissions/services/
```

### Step 2 – Async communication

* Celery / MQ

### Step 3 – Extract Service

* Separate DB
* API contract (OpenAPI)

---

## Example API Contract

```http
POST /permissions/{id}/approve
→ emits: DOCUMENT_APPROVED
```

---

# 🧠 INTERVIEW GOLD SUMMARY (1 PARAGRAPH)

> This system uses direct-to-storage uploads for large files, optimistic locking and immutable versioning to prevent lost updates, event-driven notifications with message queues for scalability, signed URLs and role-based access control for file security, and a modular monolith structure that allows seamless migration to microservices.

---
