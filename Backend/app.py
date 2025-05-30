from flask import Flask, session, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import uuid
import hashlib


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
db.init_app(app)

class User(db.Model):  
    id: Mapped[str] = mapped_column(String(32),primary_key=True)
    email: Mapped[str] = mapped_column(String(64),unique=True)
    password: Mapped[str] = mapped_column(String(64))
    name: Mapped[str] = mapped_column(String(32))
    lastname: Mapped[str] = mapped_column(String(32))
    phone_number: Mapped[str] = mapped_column(String(16))
    account_type: Mapped[str] = mapped_column(String(8))

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    if 'id' in session:
        try:
            user = db.session.execute(db.select(User).filter_by(id=session['id'])).scalar_one()
        except:
            session.pop('id', None)
            return redirect(url_for('login'))
        else:
            return render_template("index.html",person = user.name)
    else:
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            user = db.session.execute(db.select(User).filter_by(email=request.form['email'])).scalar_one()
        except:
            return render_template("login.html", message = "Usuario o Contraseña Inválidos")
        else:
            password = hashlib.sha256(request.form['password'].encode("utf-8")).hexdigest()
            if password == user.password:
                session["id"] = user.id
                return redirect(url_for('index'))
            else:
                return render_template("login.html", message = "Usuario o Contraseña Inválidos")
    return render_template("login.html", message = None)

@app.route('/logout')
def logout():
    session.pop('id', None)
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user = User()
        user.id = str(uuid.uuid4())
        user.email = request.form['email']
        user.password = hashlib.sha256(request.form['password'].encode("utf-8")).hexdigest()
        user.name = request.form['name']
        user.lastname = request.form['lastname']
        user.phone_number = request.form['phone_number']
        user.account_type = "master"
        db.session.add(user)
        db.session.commit()
        return render_template("register.html",message = "SUCCESS")
    return render_template("register.html", message = None)