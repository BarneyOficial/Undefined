import flask as fl

app = fl.Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def index():
    if 'username' in fl.session:
        return f'Logged in as {fl.session["username"]}'
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if fl.request.method == 'POST':
        fl.session['username'] = fl.request.form['username']
        return fl.redirect(fl.url_for('index'))
    return '''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    fl.session.pop('username', None)
    return fl.redirect(fl.url_for('index'))