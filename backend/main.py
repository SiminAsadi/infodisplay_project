from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import sqlite3
from datetime import date
import os
from pydantic import BaseModel
from typing import Optional

app = FastAPI()
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect("data.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def init_db():
    db = get_db()
    db.execute('''CREATE TABLE IF NOT EXISTS menu (
        dato TEXT PRIMARY KEY,
        breakfast TEXT,
        lunch TEXT,
        dinner TEXT
    )''')
    db.execute('''CREATE TABLE IF NOT EXISTS activities (
        dato TEXT,
        time TEXT,
        name TEXT
    )''')
    db.commit()

@app.get("/admin", response_class=HTMLResponse)
def admin_page(request: Request):
    return templates.TemplateResponse("admin_form.html", {"request": request, "date": str(date.today())})

@app.post("/admin", response_class=HTMLResponse)
async def admin_post(
    request: Request,
    dato: str = Form(...),
    breakfast: str = Form(...),
    lunch: str = Form(...),
    dinner: str = Form(...),
    activity1: str = Form(...),
    activity2: str = Form(...),
    activity3: str = Form(...),
    activity4: str = Form(...),
):
    db = get_db()
    # Gem menu
    db.execute(
        "INSERT OR REPLACE INTO menu (dato, breakfast, lunch, dinner) VALUES (?, ?, ?, ?)",
        (dato, breakfast, lunch, dinner)
    )
    # Gem aktiviteter
    db.execute("DELETE FROM activities WHERE dato = ?", (dato,))
    db.execute(
        "INSERT INTO activities (dato, time, name) VALUES (?, ?, ?)",
        (dato, "09:00", activity1)
    )
    db.execute(
        "INSERT INTO activities (dato, time, name) VALUES (?, ?, ?)",
        (dato, "11:00", activity2)
    )
    db.execute(
        "INSERT INTO activities (dato, time, name) VALUES (?, ?, ?)",
        (dato, "13:00", activity3)
    )
    db.execute(
        "INSERT INTO activities (dato, time, name) VALUES (?, ?, ?)",
        (dato, "15:00", activity4)
    )
    db.commit()
    return RedirectResponse("/admin", status_code=303)

@app.get("/api/menu")
def get_menu(dato: str = str(date.today())):
    db = get_db()
    result = db.execute("SELECT * FROM menu WHERE dato = ?", (dato,)).fetchone()
    if result:
        return dict(result)
    return {"breakfast": "Ukendt", "lunch": "Ukendt", "dinner": "Ukendt"}

@app.get("/api/activities")
def get_activities(dato: str = str(date.today())):
    db = get_db()
    results = db.execute("SELECT time, name FROM activities WHERE dato = ?", (dato,)).fetchall()
    return [dict(row) for row in results]

@app.get("/api/weather")
def get_weather():
    return {"forecast": "Solrigt, 22°C"}

@app.get("/", response_class=FileResponse)
def read_index():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(base_dir, "frontend", "index.html")
    return FileResponse(index_path)

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frontend_dir = os.path.join(base_dir, "frontend")
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")

class InfoData(BaseModel):
    dato: str
    breakfast: str
    lunch: str
    dinner: str
    activity1: str
    activity2: str
    activity3: Optional[str] = None
    activity4: Optional[str] = None
