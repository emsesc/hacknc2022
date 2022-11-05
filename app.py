from flask import Flask, redirect, url_for, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("homepage.html")

@app.route("/form/")
def form():
    return render_template("index.html")

@app.route("/about/")
def about():
    return "About page!"

# Redirects
@app.route("/home/")
def home_rdr():
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)