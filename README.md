# Todo App — Integration Testing Assignment

## Project Structure
```
todo-app/
├── backend/
│   ├── app.js          # Express app + API logic (Component 1)
│   └── server.js       # Server ko start karta hai
├── frontend/
│   └── index.html       # UI jo backend API ko call karta hai (Component 2)
├── tests/
│   └── integration.test.js   # Integration test cases
├── package.json
└── jest.config.js
```

## Components Identify Kiye (Assignment ka Step 1)
1. **Frontend Component**: `frontend/index.html` — user input leta hai, `fetch()` se backend ko HTTP requests bhejta hai (GET/POST/PUT/DELETE), aur response ko UI mein render karta hai.
2. **Backend Component**: `backend/app.js` — Express server jo API endpoints expose karta hai (`/api/todos`), data validate karta hai, aur data store/manage karta hai.
3. **Interaction Point**: Dono components `http://localhost:5000/api/todos` API contract ke through interact karte hain — yahi wo jagah hai jaha integration testing zaroori hai.

## Step-by-Step: Kaise Run Karein

### 1. Dependencies install karo
```bash
cd todo-app
npm install
```

### 2. Backend server start karo
```bash
npm start
```
Ye `http://localhost:5000` pe chalega.

### 3. Frontend kholo
`frontend/index.html` file ko browser mein directly open karo (double-click), ya VS Code Live Server extension use karo. Ye backend API ko call karega.

### 4. Integration tests run karo
```bash
npm test
```

## Integration Testing Environment Setup (Assignment ka Step 2)
- **Tool used**: Jest (test runner) + Supertest (HTTP requests simulate karne ke liye, bina real server start kiye)
- **Approach**: Backend ke `app` object ko directly test kiya, jo exactly wahi HTTP calls simulate karta hai jo frontend karega (GET, POST, PUT, DELETE)
- **Isolation**: Har test ke baad (`afterEach`) data reset kiya jata hai taaki tests ek dusre ko affect na karein

## Test Cases Likhe (Assignment ka Step 3)
`tests/integration.test.js` mein 10 test cases hain, jo cover karte hain:

| # | Test Case | Type |
|---|-----------|------|
| 1 | Empty list return ho shuru mein | Positive |
| 2 | Naya todo add ho | Positive |
| 3 | POST ke baad GET sync ho (real integration check) | Positive |
| 4 | Todo complete mark ho | Positive |
| 5 | Todo delete ho | Positive |
| 6 | Empty title pe error | Negative |
| 7 | Missing title pe error | Negative |
| 8 | Non-existent id update pe 404 | Negative (Edge case) |
| 9 | Non-existent id delete pe 404 | Negative (Edge case) |
| 10 | Full workflow: add→complete→delete | Multi-step Integration |

## Assignment Mein Kaise Likhein
1. **Environment Setup**: Explain karo ki Jest + Supertest use kiya, kyun (fast, no real server/port needed), aur test isolation kaise ensure ki.
2. **Components**: Frontend aur Backend ko diagram bana ke dikhao, aur API endpoint ko "interaction point" bolo.
3. **Test Cases**: Upar wali table copy karo aur har test case ka purpose ek line mein likho.
4. **Result**: `npm test` ka output screenshot lo (10 passed) aur assignment mein attach karo.
