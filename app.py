from flask import Flask, redirect, url_for, render_template, request, session, flash
import requests
import json
import re

app = Flask(__name__)
app.secret_key = "GoUNCbeatDOOOOOK"

def sendToDatabase(json):
    url = "https://lennymenny.azurewebsites.net/api/db-update?code=nx4WB8uAEPnUJvklFRX7r2D4hx_XUvuP44QLJqSWAI20AzFuNgToCg=="

    x = requests.post(url, data=json)
    print(x.text)

def convertJSON() -> json:
    if "name" in session:
        data = {
            "name" : session["name"],
            "number" : session["phone"],
            "dietary" : session["diet"],
            "favorites" : session["food"]
        }
        print(json.dumps(data))
        return json.dumps(data)
    else:
        return redirect(url_for("form"))

def validate_phone():
    if "phone" in session:
        p = re.compile('^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$')
        m = p.match(session["phone"])
        if m == None:
            pass # Flash error saying the form is not accepted
        elif m.group(1) != "1" and m.group(1) != None:
            pass # Flash error saying we can only send to US numbers
        else:
            session["phone"] = "1" + m.group(2) + m.group(3)+ m.group(4)
    else:
        redirect(url_for("form"))

@app.route('/postmethod', methods = ["POST"])
def get_food():
    jsdata = request.form['javascript_data']
    session["food"] = json.loads(jsdata)
    print(session["food"])
    return session["food"]

@app.route("/", methods=["POST","GET"])
@app.route("/home/", methods=["POST","GET"])
@app.route("/form/", methods=["POST","GET"])
def form():
    if request.method == "POST":
        session["name"] = request.form["name"]
        session["diet"] = request.form.getlist("diet")
        session["phone"] = request.form["phone"]
        validate_phone()
        sendToDatabase(convertJSON())
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

@app.route("/unsub/")
def unsub():
    return "Unsubscribe Page"

if __name__ == "__main__":
    app.run(debug=True)