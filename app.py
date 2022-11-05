from flask import Flask, redirect, url_for, render_template, request, session

app = Flask(__name__)
app.secret_key = "GoUNCbeatDOOOOOK"


@app.route("/")
@app.route("/home/")
def home():
    return render_template("homepage.html")

@app.route("/form/", methods=["POST","GET"])
def form():
    if request.method == "POST":
        session["name"] = request.form["name"]
        session["diet"] = request.form["diet"]
        session["food"] = request.form["food"]
        session["phone"] = request.form["phone"]
        return redirect(url_for("confirm"))
    else:
        return render_template("index.html")

@app.route("/confirm/")
def confirm():
    if "name" in session:
        data = [session["name"], session["diet"], session["food"], session["phone"]]
        return render_template("confirm.html", data=data)
    else:
        return redirect(url_for("form"))

@app.route("/about/")
def about():
    return "About page!"


if __name__ == "__main__":
    app.run(debug=True)