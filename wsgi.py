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


def convertJSON(name, number, dietary, favorites) -> json:
    data = {
        "name" : name,
        "number" : number,
        "dietary" : dietary,
        "favorites" : favorites
    }
    print(json.dumps(data))
    return json.dumps(data)

def validate_phone(number) -> str:
    p = re.compile('^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$')
    m = p.match(number)
    if m == None:
        pass # Flash error saying the form is not accepted
    elif m.group(1) != "1" and m.group(1) != None:
        pass # Flash error saying we can only send to US numbers
    else:
        return "1" + m.group(2) + m.group(3)+ m.group(4)

@app.route("/")
@app.route("/home/")
def redir():
    return redirect(url_for("form"))

@app.route("/form/", methods=("POST","GET"))
def form():
    if request.method == "POST":
        print(request.form)
        name = request.form["name"]
        print(name)
        diet = request.form.getlist("diet")
        phone = validate_phone(request.form["phone"])
        favorites = request.form["favorites"].split(",")[:-1]
        print(favorites)
        sendToDatabase(convertJSON(name, phone, diet, favorites))
        return redirect("/confirm?" + "name=" + name + "&diet=" + json.dumps(diet)+ "&favorites=" + json.dumps(favorites) + "&number=" + phone)

    else:
        return render_template("index.html")

@app.route("/confirm/")
def confirm():
    data = [request.args.get('name'), request.args.get('diet'), request.args.get('favorites'), request.args.get("number")]
    return render_template("confirm.html", data=data)



if __name__ == "__main__":
    app.run()