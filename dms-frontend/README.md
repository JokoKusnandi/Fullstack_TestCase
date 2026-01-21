Buat Frontend React+TypeScript 

# 1. Create React App (Vite – recommended)
buka folder FULLSTACK_TESTCASE terus buka terminal bash :
```text
npm create vite@latest dms-frontend -- --template react
```
```text
pilih : 
✔ React
✔ TypeScript
```
```text
cd dms-frontend
npm install
npm run dev
```

# 2. Install Axios
bash : 
```text
npm install axios
npm install axios react-router-dom
npm install clsx
```

# 3. Test Koneksi ke Django
Edit src/App.tesx

# Jalankan Bersamaan
## Backend : 
bash :
```text
cd dms_backend
source venv/Scripts/activate
python manage.py runserver
```
# Frontend
bash :
```text
cd dms-frontend
npm run dev
```

mkdir components pages services hooks context
touch App.jsx

## Create Component
```text
touch components/Loader.tsx
touch components/ErrorState.tsx
touch components/EmptyState.tsx
touch components/ProtectedRoute.tsx
touch components/StatusBadge.tsx
touch components/NavLink.tsx
touch components/DocumentUploadModal.tsx
touch components/DocumentDetail.tsx
```
## Create Pages
```text
touch pages/Dashboard.tsx
touch pages/Documents.tsx
touch pages/AdminApproval.tsx
touch pages/AdminHistory.tsx
touch pages/Auth.tsx
touch pages/Index.tsx
touch pages/NotFound.tsx
```
## Create context
```text
touch context/AuthContext.tsx
```

## Create hooks
```text
touch hooks/use-mobile.tsx
touch hooks/use-toast.ts
```

## Create api interceptor
```text
touch lib/api.ts
touch lib/token.ts
touch lib/utils.ts
```
## Create services
```text
touch services/auth.service.ts
touch services/user.service.ts
touch services/dashboard.service.ts
touch services/document.service.ts
touch services/approval.service.ts
touch services/notification.service.ts
touch services/permission.ts
```

