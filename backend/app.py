from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # biar React bisa connect


def get_db():
    return sqlite3.connect("users.db")

@app.route("/")
def home():
    return "Backend jalan bro 🚀"
# =========================
# SIGNUP
# =========================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    code = data.get("code", "")

    if not username or not password:
        return jsonify({"error": "Data tidak lengkap"})

    hashed_password = generate_password_hash(password)

    # role logic
    role = "admin" if code == "admin123" else "customer"

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, ?)
        """, (username, email, hashed_password, role))
        db.commit()

        return jsonify({
            "message": f"Signup berhasil sebagai {role}"
        })

    except:
        return jsonify({"error": "Username sudah digunakan"})


# =========================
# LOGIN
# =========================
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    SELECT * FROM users 
    WHERE username=? OR email=?
""", (username, username))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Username tidak ditemukan"})

    if not check_password_hash(user[3], password):
        return jsonify({"error": "Password salah"})

    role = user[4]

    # redirect logic
    if role == "admin":
        return jsonify({
            "message": "Login berhasil sebagai admin",
            "redirect": "/dashboard"
        })
    else:
        return jsonify({
            "message": "Login berhasil sebagai customer",
            "redirect": "/"
        })


if __name__ == "__main__":
    app.run(debug=True)