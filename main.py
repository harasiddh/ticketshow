import os
from flask import Flask
from flask_restful import Resource, Api
from application import config
from application.jobs import workers
from application.config import LocalDevelopmentConfig #,TestingConfig
from application.data.database import db
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_security import utils, Security, SQLAlchemySessionUserDatastore #SQLAlchemyUserDataStore, 
from flask_login import LoginManager
from application.data.models import User, Role
# from flask_migrate import Migrate
#from flask_caching import Cache
from common import cache

app = None
api = None
celery = None
#cache = None

def create_app():
    app = Flask(__name__, template_folder="templates")
    if os.getenv('ENV', 'development') == 'production':
        app.logger.info("Currently no production environment is setup")
        raise Exception("Currently no production environment is setup")
    #elif os.getenv('ENV', 'development') == 'testing':
        #app.logger.info("Starting testing")
        #print("Starting testing")
        #app.config.from_object(TestingConfig)
    else:
        app.logger.info("Starting Local Development")
        print("Starting Local Development")
        app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    app.app_context().push()

    user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
    security = Security(app, user_datastore)
    # migrate = Migrate(app)
    api = Api(app)
    app.app_context().push()

    celery = workers.celery
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        broker_connection_retry_on_startup = True,
        beat_schedule = app.config["CELERY_BEAT_SCHEDULE"]
        )
    celery.Task = workers.ContextTask
    app.app_context().push()

    #cache = Cache(app)
    cache.init_app(app)
    app.app_context().push()

    app.logger.info("app setup complete")
    return app, api, celery, cache

#app = create_app()
app, api, celery, cache = create_app()

# Import all controllers so that they are loaded
from application.controller.controllers import *

# Add all restful controllers

# admin APIs

from application.controller.api import Admin_GetMoviesAPI, Admin_GetTheatresAPI, Admin_GetScreeningsAPI, Admin_GetBookingsAPI
api.add_resource(Admin_GetMoviesAPI, "/api/admin/get_movies")
api.add_resource(Admin_GetTheatresAPI, "/api/admin/get_theatres")
api.add_resource(Admin_GetScreeningsAPI, "/api/admin/get_screenings")
api.add_resource(Admin_GetBookingsAPI, "/api/admin/get_bookings")

from application.controller.api import Admin_GetScreenings_Movie_API, Admin_GetScreenings_Theatre_API
api.add_resource(Admin_GetScreenings_Movie_API, "/api/admin/get_screenings/movie/<int:id>")
api.add_resource(Admin_GetScreenings_Theatre_API, "/api/admin/get_screenings/theatre/<int:id>")

from application.controller.api import Admin_GetMovie_Screening_API, Admin_GetTheatre_Screening_API
api.add_resource(Admin_GetMovie_Screening_API, "/api/admin/get_movie/screening/<int:id>")
api.add_resource(Admin_GetTheatre_Screening_API, "/api/admin/get_theatre/screening/<int:id>")

from application.controller.api import AdminMovieAPI, AdminTheatreAPI, AdminScreeningAPI
api.add_resource(AdminMovieAPI, "/api/admin/movie/<int:id>", "/api/admin/movie/create")
api.add_resource(AdminTheatreAPI, "/api/admin/theatre/<int:id>", "/api/admin/theatre/create")
api.add_resource(AdminScreeningAPI, "/api/admin/screening/<int:id>", "/api/admin/screening/create")


# user APIs

from application.controller.api import GetMoviesAPI, GetTheatresAPI, GetScreeningsAPI
api.add_resource(GetMoviesAPI, "/api/get_movies")
api.add_resource(GetTheatresAPI, "/api/get_theatres")
api.add_resource(GetScreeningsAPI, "/api/get_screenings")


from application.controller.api import GetScreenings_Movie_API, GetScreenings_Theatre_API
api.add_resource(GetScreenings_Movie_API, "/api/get_screenings/movie/<int:id>")
api.add_resource(GetScreenings_Theatre_API, "/api/get_screenings/theatre/<int:id>")

from application.controller.api import GetMovie_Screening_API, GetTheatre_Screening_API
api.add_resource(GetMovie_Screening_API, "/api/get_movie/screening/<int:id>")
api.add_resource(GetTheatre_Screening_API, "/api/get_theatre/screening/<int:id>")

from application.controller.api import MovieAPI, TheatreAPI, ScreeningAPI, BookingAPI, UserAPI
api.add_resource(MovieAPI, "/api/movie/<int:id>")
api.add_resource(TheatreAPI, "/api/theatre/<int:id>")
api.add_resource(ScreeningAPI, "/api/screening/<int:id>")
api.add_resource(BookingAPI, "/api/booking/<int:id>", "/api/booking/create")
api.add_resource(UserAPI, "/api/user/<email>")

from application.controller.api import User_BookingHistoryAPI
api.add_resource(User_BookingHistoryAPI, "/api/get_bookings/<email>")



@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(403)
def not_authorized(e):
    return render_template('403.html'), 403


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
