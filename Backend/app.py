from flask import Flask, session, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
db.init_app(app)

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    username = None
    if 'username' in session:
        username = session["username"]
        return render_template("index.html",person = username)
    else:
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return render_template("login.html")

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))