Buat Frontend React+TypeScript 

# 1. Create React App (Vite – recommended)
buka folder FULLSTACK_TESTCASE terus buka terminal bash :
npm create vite@latest dms-frontend -- --template react
pilih : 
✔ React
✔ TypeScript

cd dms-frontend
npm install
npm run dev

# 2. Install Axios
bash : npm install axios
npm install axios react-router-dom
npm install clsx

# 3. Test Koneksi ke Django
Edit src/App.tesx

# Jalankan Bersamaan
## Backend : 
bash :
cd dms_backend
source venv/Scripts/activate
python manage.py runserver

# Frontend
bash :
cd dms-frontend
npm run dev







