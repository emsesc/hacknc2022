from flask import Flask, redirect, url_for, render_template, request, session
import requests

app = Flask(__name__)
app.secret_key = "GoUNCbeatDOOOOOK"

def sendToDatabase(json):
    url = "https://lennymenny.azurewebsites.net/api/db-update?code=nx4WB8uAEPnUJvklFRX7r2D4hx_XUvuP44QLJqSWAI20AzFuNgToCg=="

    x = requests.post(url, json = json)
    print(x.text)


def validate_data():
    if "name" in session:
        pass
    else:
        return redirect(url_for("form"))

@app.route("/")
@app.route("/home/")
def home():
    return render_template("homepage.html")

@app.route("/form/", methods=["POST","GET"])
def form():
    if request.method == "POST":
        session["name"] = request.form["name"]
        print(request.form.getlist("diet"))
        session["food"] = request.form["food"]
        session["phone"] = request.form["phone"]
        return redirect(url_for("confirm"))

    else:
        return render_template("index.html")

@app.route("/confirm/")
def confirm():
    if "name" in session:
        data = [session["name"], "PLACEHOLDER", session["food"], session["phone"]]
        return render_template("confirm.html", data=data)
    else:
        return redirect(url_for("form"))

@app.route("/about/")
def about():
    return "About page!"

@app.route("/unsub/")
def unsub():
    return "Unsubscribe Page"

if __name__ == "__main__":
    app.run(debug=True)