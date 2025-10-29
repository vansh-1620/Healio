## Setup (Backend)

1. Create a Python virtualenv and install requirements:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Set environment variables (optional)

```bash
export DATABASE_URL="sqlite:///medai.db"  # or a MySQL URL like mysql+pymysql://user:pass@host/db
export SECRET_KEY='yoursecret'
export JWT_SECRET_KEY='jwtsecret'
export OPENAI_API_KEY='sk-...'
```

3. Initialize DB and (optional) load `db_init.sql` sample doctors into your MySQL DB. For SQLite the app creates tables automatically.

4. Run the backend

```bash
python app.py
```

## Setup (Frontend)

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start
```

Now open http://localhost:3000

## Notes & Security
- Passwords are hashed with bcrypt.
- JWT tokens are used for authenticated endpoints.
- The chat uses OpenAI: you must set `OPENAI_API_KEY` on the backend.
- This is a reference implementation. Do not use in production without adding secure password reset, input validation, rate-limiting, HTTPS, and legal disclaimers for medical advice.
```

---

# Final notes

- The rule-based disease model is intentionally simple — replace with a clinical decision support system or a trained model for production.
- Doctor geolocation uses Haversine math.
- The chat proxy intentionally keeps the API key on server side.