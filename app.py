from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from datetime import datetime
import os
import sqlite3
import hashlib
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = "your-secret-key-here"


# Database helper functions
def get_db():
    conn = sqlite3.connect("portfolio.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Create tables
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            github_url TEXT,
            live_url TEXT,
            technologies TEXT,
            category TEXT,
            featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            proficiency INTEGER NOT NULL,
            icon TEXT,
            color TEXT
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            read BOOLEAN DEFAULT FALSE
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS experiences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            description TEXT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE,
            current BOOLEAN DEFAULT FALSE,
            technologies_used TEXT
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            degree TEXT NOT NULL,
            institution TEXT NOT NULL,
            description TEXT,
            start_date DATE NOT NULL,
            end_date DATE,
            current BOOLEAN DEFAULT FALSE
        )
    """
    )

    # Create admin user if not exists
    cursor.execute("SELECT * FROM users WHERE username = ?", ("admin",))
    if not cursor.fetchone():
        password_hash = hashlib.sha256("admin123".encode()).hexdigest()
        cursor.execute(
            """
            INSERT INTO users (username, email, password_hash, is_admin)
            VALUES (?, ?, ?, ?)
        """,
            ("admin", "admin@example.com", password_hash, True),
        )

    # Add sample data
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        sample_projects = [
            (
                "E-commerce Platform",
                "Full-stack e-commerce platform with payment integration",
                "https://via.placeholder.com/400x300",
                "https://github.com",
                "https://example.com",
                "Python,Django,React,PostgreSQL",
                "Web Development",
                True,
            ),
            (
                "AI Chatbot",
                "Intelligent chatbot using machine learning",
                "https://via.placeholder.com/400x300",
                "https://github.com",
                "https://example.com",
                "Python,TensorFlow,NLP,Flask",
                "AI/ML",
                True,
            ),
            (
                "Mobile App",
                "Cross-platform mobile application",
                "https://via.placeholder.com/400x300",
                "https://github.com",
                "https://example.com",
                "React Native,JavaScript,Firebase",
                "Mobile Development",
                True,
            ),
        ]
        cursor.executemany(
            """
            INSERT INTO projects (title, description, image_url, github_url, live_url, technologies, category, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
            sample_projects,
        )

    cursor.execute("SELECT COUNT(*) FROM skills")
    if cursor.fetchone()[0] == 0:
        sample_skills = [
            ("Python", "Backend", 90, "fab fa-python", "#3776AB"),
            ("Django", "Backend", 85, "fab fa-python", "#092E20"),
            ("Flask", "Backend", 80, "fab fa-python", "#000000"),
            ("JavaScript", "Frontend", 85, "fab fa-js-square", "#F7DF1E"),
            ("React", "Frontend", 80, "fab fa-react", "#61DAFB"),
            ("PostgreSQL", "Database", 75, "fas fa-database", "#336791"),
            ("Docker", "DevOps", 70, "fab fa-docker", "#2496ED"),
            ("Git", "Version Control", 85, "fab fa-git-alt", "#F05032"),
        ]
        cursor.executemany(
            """
            INSERT INTO skills (name, category, proficiency, icon, color)
            VALUES (?, ?, ?, ?, ?)
        """,
            sample_skills,
        )

    cursor.execute("SELECT COUNT(*) FROM experiences")
    if cursor.fetchone()[0] == 0:
        sample_experiences = [
            (
                "Senior Backend Developer",
                "Tech Company",
                "Led development of scalable backend systems",
                "2022-01-01",
                "2023-12-31",
                False,
                "Python,Django,PostgreSQL,Docker",
            ),
            (
                "Full Stack Developer",
                "Startup",
                "Built complete web applications from scratch",
                "2020-06-01",
                "2021-12-31",
                False,
                "Python,Flask,React,MySQL",
            ),
            (
                "Backend Developer",
                "Software Agency",
                "Developed REST APIs and microservices",
                "2019-01-01",
                "2020-05-31",
                False,
                "Python,FastAPI,PostgreSQL",
            ),
        ]
        cursor.executemany(
            """
            INSERT INTO experiences (title, company, description, start_date, end_date, current, technologies_used)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
            sample_experiences,
        )

    conn.commit()
    conn.close()


# Authentication helper
def check_auth():
    return session.get("user_id") is not None


def check_admin():
    if not check_auth():
        return False
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT is_admin FROM users WHERE id = ?", (session["user_id"],))
    user = cursor.fetchone()
    conn.close()
    return user and user["is_admin"]


# Routes
@app.route("/")
def index():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM projects WHERE featured = 1 LIMIT 6")
    projects = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM skills")
    skills = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM experiences ORDER BY start_date DESC LIMIT 3")
    experiences = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM education ORDER BY start_date DESC LIMIT 2")
    education = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return render_template(
        "index.html",
        projects=projects,
        skills=skills,
        experiences=experiences,
        education=education,
    )


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json()

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO contacts (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    """,
        (data["name"], data["email"], data["subject"], data["message"]),
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Xabar muvaffaqiyatli yuborildi!"})


@app.route("/api/projects")
def get_projects():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects")
    projects = []
    for row in cursor.fetchall():
        project = dict(row)
        project["technologies"] = (
            project["technologies"].split(",") if project["technologies"] else []
        )
        projects.append(project)
    conn.close()
    return jsonify(projects)


@app.route("/api/skills")
def get_skills():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM skills")
    skills = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(skills)


# Admin routes
@app.route("/admin")
def admin():
    if not check_admin():
        return redirect(url_for("index"))

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM contacts ORDER BY created_at DESC")
    contacts = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM projects")
    projects = [dict(row) for row in cursor.fetchall()]

    cursor.execute("SELECT * FROM skills")
    skills = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return render_template(
        "admin.html", contacts=contacts, projects=projects, skills=skills
    )


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        password_hash = hashlib.sha256(password.encode()).hexdigest()

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND password_hash = ?",
            (username, password_hash),
        )
        user = cursor.fetchone()
        conn.close()

        if user and user["is_admin"]:
            session["user_id"] = user["id"]
            return redirect(url_for("admin"))

        return render_template("login.html", error="Noto'g'ri login yoki parol")

    return render_template("login.html")





@app.route("/admin/logout")
def admin_logout():
    session.pop("user_id", None)
    return redirect(url_for("index"))


if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)
