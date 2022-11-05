from flask import Flask, redirect, url_for, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("homepage.html")

@app.route("/form/", methods=["POST","GET"])
def form():
    if request.method == "post":
        name = request.form["name"]
        diet = request.form["diet"]
        items = request.form["items"]
        phone = request.form["phone"]
        return f"<h1>Submission<h1><p>Name: {name}<br>Diet: {diet}<br>Items: {items}<br>Phone: {phone}</p>"
    else:
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