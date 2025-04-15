import flask as fl

app = fl.Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def index():
    username = None
    if 'username' in fl.session:
        username = fl.session["username"]
    return fl.render_template("index.html",person = username)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if fl.request.method == 'POST':
        fl.session['username'] = fl.request.form['username']
        return fl.redirect(fl.url_for('index'))
    return fl.render_template("login.html")

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    fl.session.pop('username', None)
    return fl.redirect(fl.url_for('index'))