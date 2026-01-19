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


