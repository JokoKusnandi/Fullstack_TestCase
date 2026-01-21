Membuat project  dms_backend (Django + SQLite) dan koneksi ke React
Document Management System (DMS) backend–frontend

# 1️⃣ Persiapan Awal
Pastikan sudah terinstall:
1. Python 3.10+
2. Node.js 18+
3. npm
4. Git

bash : 
- python --version
- node --version
- npm --version
- git --version

# 2️⃣ Struktur Folder
Fork github repo :
```text
https://github.com/oktavianusmatthew1010/Fullstack_TestCase
```

Terus bikin repo baru
```text
https://github.com/JokoKusnandi/Fullstack_TestCase
```
Terus Git Clone repo
```text
https://github.com/JokoKusnandi/Fullstack_TestCase
```

---
```text
FULLSTACK_TESTCASE/
│
├── dms_backend/   # Django
└── dms-frontend/  # React
```
---
# 3️⃣ Buat Backend Django (SQLite)
## 3.1 Buat folder & virtual environment

bash:
buka folder FULLSTACK_TESTCASE
buka terminal command prompt/bash kemudian buat folder baru :
```text
mkdir dms_backend
cd dms_backend
python -m venv venv
```

### Pastikan virtualenv AKTIF Windows (Git Bash / PowerShell)
Di folder dms_backend: 
bash : 
```text
source venv/Scripts/activate
```
## 3.2 Install Django & dependencies
bash :
```text
pip install django djangorestframework django-cors-headers
python -m pip install djangorestframework-simplejwt
```
### Install python-dotenv
bash : 
```text
pip install python-dotenv
```
Verifikasi:
```text
bash : pip list | findstr dotenv
```

#### Jalankan ulang migrate
bash : 
```text
python manage.py migrate
```

## 3.3 Create Django Project
bash :
```text
django-admin startproject dms_backend .
```

strktur:
```text
dms_backend/
├── dms_backend/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── venv/
```

## 3.4 Create App (misal: documents)
bash :
```text
python manage.py startapp documents
```

## 3.5 Register App & DRF
Edit dms_backend/dms_backend/settings.py : 
python :
---
```text
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'rest_framework',
    'corsheaders',

    # Local
    'documents',
]
```
---
Tambahkan CORS middleware:
---
```text
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```
---
Tambahkan :
```text
CORS_ALLOW_ALL_ORIGINS = True
```

## 3.6 Database (SQLite default)
---
python :
```text
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```
---

## 3.7 Migration & Run Server
bash :
```text
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Test:
```text
http://127.0.0.1:8000
```

# 4️⃣ Buat API Sederhana (Test Koneksi React)
```text
python manage.py runserver
```
## 4.1 Model Document
bash : 
```text
touch documents/models.py
```
## 4.2 Serializer
bash : 
```text
touch documents/serializers.py
```
## 4.3 View (API)
bash : 
```text
touch documents/views.py
```
## 4.4 URL Routing
bash : 
```text
dms_backend/urls.py
```
## 4.5 Migrate
bash :
```text
python manage.py makemigrations
python manage.py migrate
```
Test API postman :
```text
GET http://127.0.0.1:8000/api/documents/
```

# API ENDPOINT

## Authentication & Authorization JWT (simplejwt Bearer Token)

| Method    | Endpoint             | Description        |  Role      | 
| ----------|----------------------| -------------------| -----------|
| POST      | /api/auth/register/  | Register New User  | User&Admin | 
| POST      | /api/auth/login/     | Login & get JWT    | User&Admin |
| GET       | /api/auth/me/        | Get Currrent User  | User&Admin |

### Login & get JWT 
POST : http://127.0.0.1:8000/api/auth/login/

```text
{
    "username": "joko",
    "password": "123456"
}
```


### Register New User  
POST : http://127.0.0.1:8000/api/auth/register/

```text
{
  "username": "hailkal",
  "password": "123456",
  "email": "hailkal@mail.com"
}
```


### Get Currrent User (User&Admin)

GET : 
```text
http://127.0.0.1:8000/api/auth/me/
```
Authorization Bearer Token : {dari login
}

## Documents

| Method    | Endpoint                          | Description                      |  Role      | 
| ----------|-----------------------------------| ---------------------------------| -----------|
| POST      | /api/documents                    | Upload Document                  | USER       | 
| GET       | /api/documents                    | List Document (Pagination&Search)| USER&ADMIN |
| GET       | /api/documents/{id}               | Document Details                 | USER&ADMIN |
| POST      | /api/documents/8/request-replace/ | Request Replace                  | USER       | 
| POST      | /api/documents/3/request-delete/  | Request Delete                   | USER       |

---
Query Params :
- Page & Size
- Search (Title & Description)
- status
---

### List Document (Pagination&Search)(User&Admin)
GET : 
```text
http://127.0.0.1:8000/api/documents?page=1&size=10
```
Authorization Bearer Token : {dari login}

### Upload Document (User)
POST : 
```text
http://127.0.0.1:8000/api/documents/
```
Authorization Bearer Token : {dari login}
Body : 
form-data :

| Key                   | Value               |                             
|-----------------------|---------------------|
| title        | TEXT   | fjafjlak            |
| description  | TEXT   | fjkahfkjahkj        |
| documentType | TEXT   | lkdal               |
| file         | FILE   | [PDF/DOC/IMG/OTHER] |

### Document Details
GET : 
```text
http://127.0.0.1:8000/api/documents/2
```          
Authorization Bearer Token : {dari login}
### Request Delete
POST : 
```text
http://127.0.0.1:8000/api/documents/3/request-delete/
```
Authorization Bearer Token : {dari login}
### Request Replace 
POST : 
```text
http://127.0.0.1:8000/api/documents/8/request-replace/
```
Authorization Bearer Token : {dari login}
Body : 
form-data :

| Key                   | Value               |                             
|-----------------------|---------------------|
| title        | TEXT   | fjafjlakjjjj        |
| description  | TEXT   | fjkahfkjahkj        |
| documentType | TEXT   | lkdalihahhi         |
| file         | FILE   | [PDF/DOC/IMG/OTHER] |

## Permissions Request (Admin)

| Method    | Endpoint                          | Description                       |  Role    | 
| ----------|-----------------------------------| ----------------------------------| ---------| 
| GET       | /api/permissions                  | List Pending Request              | ADMIN    |
| POST      | /api/permissions/{id}/approve/    | Approve Request                   | ADMIN    | 
| POST      | /api/permissions/{id}/reject/     | Reject Request                    | ADMIN    |
| GET       | /api/permissions/admin/history/   | List Approved & Rejected          | ADMIN    |

### List Pending Request 
GET : 
```text
http://127.0.0.1:8000/api/permissions/
```
Authorization Bearer Token : {dari login ADMIN}

### Approve Request
POST : 
```text
http://127.0.0.1:8000/api/permissions/1/approve/
```
Authorization Bearer Token : {dari login ADMIN}

### Reject Request
POST : 
```text
http://127.0.0.1:8000/api/permissions/2/reject/
```
Authorization Bearer Token : {dari login ADMIN}

## Notifications 

| Method    | Endpoint                       | Description         |  Role    | 
| ----------|--------------------------------| --------------------| ---------| 
| GET       | /api/notifiactions             | List Notifications  | ADMIN    |
| POST      | /api/notifiactions/{id}/read/  | Mark Read           | ADMIN    | 

### List Notifications
GET : 
```text
http://127.0.0.1:8000/api/notifications/
```
Authorization Bearer Token : {dari login ADMIN /USER}

### Mark Read Notifications
POST : 
```text
http://127.0.0.1:8000/api/notifications/1/read/
```
Authorization Bearer Token : {dari login ADMIN /USER}

