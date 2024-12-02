import os, sqlite3, logging
from flask import Flask, request, redirect, render_template, jsonify, abort
from flask import current_app as app
from sqlalchemy import desc
from application.data.models import User, Role, Movie, Theatre, Screening, Booking
from application.data.database import db
from application.config import LocalDevelopmentConfig
from application.jobs import tasks
# from werkzeug.utils import secure_filename
from flask_security import login_required, roles_accepted, auth_required, roles_required, current_user
from werkzeug.utils import secure_filename
from datetime import datetime


logging.basicConfig(filename="debug.log", level=logging.DEBUG, 
                    format=f"%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s")




@app.route("/", methods=["GET", "POST"])
def landing_page():
    return redirect('/ticketshow/login_page')


@app.route("/ticketshow/login_page", methods=["GET", "POST"])
def login_page():
    return render_template("login_page.html")


@app.route("/ticketshow/register_page", methods=["GET", "POST"])
def register_page():
    return render_template("register_page.html")

'''

@app.route("/ticketshow", methods=["GET", "POST"])
@login_required
def ticketshow():
    if current_user.has_role('admin'):
        return render_template("admin.html")
    else:
        return render_template("user.html")


'''

'''
@app.route("/ticketshow/", methods=["GET", "POST"])
def ticketshow():
    if current_user.has_role('admin'):
        return redirect("/ticketshow/admin/")
    else:
        return redirect("/ticketshow/user/")
'''

@app.route("/ticketshow/", methods=["GET", "POST"])
def ticketshow():
    if current_user.has_role('admin'):
        return redirect("/ticketshow/admin/")
    else:
        return redirect("/ticketshow/" + current_user.email + "/")


@app.route("/ticketshow/admin/", methods=["GET", "POST"])
@roles_required('admin')
def admin():
    return render_template("admin.html")


@app.route("/ticketshow/<email>/", methods=["GET", "POST"])
@roles_required('user')
def user(email):
    if current_user.email == email:
        return render_template("user.html")
    else:
        abort(403, "You cannot access this page")


@app.route("/api/check_movie/<title>", methods=["GET"])
def check_movie_title(title):
    existing_movie = Movie.query.filter_by(title=title).first()
    if existing_movie:
        return jsonify({"exists": True})
    else:
        return jsonify({"exists": False})

@app.route("/api/check_theatre/<name>", methods=["GET"])
def check_theatre_name(name):
    existing_theatre = Theatre.query.filter_by(name=name).first()
    if existing_theatre:
        return jsonify({"exists": True})
    else:
        return jsonify({"exists": False})



@app.route("/hello/<email>", methods=["GET", "POST"])
def hello(email):
    job = tasks.just_say_hello.delay(email)
    result = job.wait()
    return str(result), 200


@app.route("/date_time", methods=["GET", "POST"])
def date_time():
    now = datetime.now()
    print("now in flask = ", now)
    dt_string = now.strftime("%d/%m/%y %H:%M:%S")
    print("date and time = ", dt_string)

    job = tasks.print_current_time_job.apply_async(countdown=10)
    #job = tasks.print_current_time_job.apply_async(countdown=60, expires=120)
    #job = tasks.print_current_time_job.apply_async(eta = now + timedelta(seconds=10))

    result = job.wait()
    return str(result), 200



@roles_required('admin')
@auth_required('token')
@app.route('/export_theatre_csv/<int:theatre_id>')
def export_theatre_csv(theatre_id):
    job = tasks.generate_theatre_csv.apply_async(args=[theatre_id])
    result = job.wait()
    return str(result), 200

