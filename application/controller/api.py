import os, json
from flask_restful import Resource, Api, fields, marshal, reqparse, marshal_with, request
# from application.validation import Business
from application.data.models import User, Role
from application.data.database import db
from flask import current_app as app
import werkzeug
from flask import abort, jsonify
from flask_security import auth_required, login_required, roles_accepted, roles_required, auth_token_required
from sqlalchemy import desc
from application.config import LocalDevelopmentConfig
from application.data.database import db
from application.data.models import User, Role, Theatre, Movie, Screening, Booking
from werkzeug.utils import secure_filename
from application.data import data_access

def allowed_file(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


class Admin_GetMoviesAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self):
        #movies = db.session.query(Movie).all()
        movies = data_access.get_all_movies()
        return marshal(movies, output_fields_movie)


class Admin_GetTheatresAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self):
        #theatres = db.session.query(Theatre).all()
        theatres = data_access.get_all_theatres()
        return marshal(theatres, output_fields_theatre)


class Admin_GetScreeningsAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self):
        #screenings = db.session.query(Screening).all()
        screenings = data_access.get_all_screenings()
        return marshal(screenings, output_fields_screening)


class Admin_GetBookingsAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self):
        #bookings = db.session.query(Booking).order_by(desc(Booking.id)).all()
        bookings = data_access.get_all_bookings()
        return marshal(bookings, output_fields_booking)


class Admin_GetScreenings_Movie_API(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        movie = db.session.query(Movie).filter(Movie.id == id).first()
        if movie:
            screenings = db.session.query(Screening).filter(Screening.movie_title == movie.title).all()
            return marshal(screenings, output_fields_screening)
        else:
            return {"error": "Movie Not Found"}, 404


class Admin_GetScreenings_Theatre_API(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        theatre = db.session.query(Theatre).filter(Theatre.id == id).first()
        if theatre:
            screenings = db.session.query(Screening).filter(Screening.theatre_name == theatre.name).all()
            return marshal(screenings, output_fields_screening)
        else:
            return {"error": "Theatre Not Found"}, 404


class Admin_GetMovie_Screening_API(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        screening = db.session.query(Screening).filter(Screening.id == id).first()
        if screening:
            movie = db.session.query(Movie).filter(Movie.title == screening.movie_title).all()
            return marshal(movie, output_fields_movie)
        else:
            return {"error": "Screening Not Found"}, 404


class Admin_GetTheatre_Screening_API(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        screening = db.session.query(Screening).filter(Screening.id == id).first()       
        if screening:
            theatre = db.session.query(Theatre).filter(Theatre.name == screening.theatre_name).all()
            return marshal(theatre, output_fields_theatre)
        else:
            return {"error": "Screening Not Found"}, 404


output_fields_movie = { "id": fields.Integer,
                        "title": fields.String,
                        "genre": fields.String,
                        "duration": fields.Integer, 
                        "movie_price": fields.Integer,
                        "poster": fields.String}

create_movie_parser = reqparse.RequestParser()
create_movie_parser.add_argument('title', type=str, required=True, help='Title is required.')
create_movie_parser.add_argument('genre', type=str, required=True, help='Genre is required.')
create_movie_parser.add_argument('duration', type=float, required=True, help='Duration is required.')
create_movie_parser.add_argument('movie_price', type=float, required=True, help='Movie price is required.')
create_movie_parser.add_argument('poster', type=str, location='files', required=True, help='Poster file is required.')



class AdminMovieAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        movies = db.session.query(Movie).filter(Movie.id == id).all()
        if movies:
            return marshal(movies, output_fields_movie)
        else:
            return {"error": "Movie Not Found"}, 404


    @roles_required('admin')
    @auth_required('token')
    def put(self, id):
        try:
            movie = db.session.query(Movie).filter(Movie.id == id).first()
            if not movie:
                raise NotFoundError(status_code=404)

            json_data = request.get_json()
            if not json_data:
                return {"error": "Invalid JSON data in the request"}, 400

            title = json_data.get('title', movie.title)  # Use existing title if not provided
            genre = json_data.get('genre', movie.genre)  # Use existing genre if not provided
            duration = json_data.get('duration', movie.duration)  # Use existing duration if not provided
            movie_price = json_data.get('movie_price', movie.movie_price)  # Use existing price if not provided

            if duration is not None:
                try:
                    duration = float(duration)
                except ValueError:
                    return {"error": "Invalid value for 'duration'"}, 400

            if movie_price is not None:
                try:
                    movie_price = float(movie_price)
                except ValueError:
                    return {"error": "Invalid value for 'movie_price'"}, 400

            # Check for an existing movie with the same title (except for the current movie)
            existing_movie = Movie.query.filter(Movie.title == title, Movie.id != id).first()
            if existing_movie:
                return {"error": "A movie with that title already exists. Please choose a different title."}, 400

            if title=="":
                title = movie.title

            old_poster = movie.poster
            old_title = movie.title

            # handle update of poster - poster needs to be updated if title or file has been changed
            # Check for an existing movie with the same title
            if title != old_title:
                existing_movie = Movie.query.filter_by(title=title).first()
                if existing_movie:
                    return {"error": "A movie with that title already exists. Please choose a different title."}, 400

                # Rename the old poster to match the new title
                if old_poster:
                    old_poster_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, os.path.basename(old_poster))
                    new_poster_filename = secure_filename(title + "." + os.path.basename(old_poster_path).split(".")[-1])
                    new_poster_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, new_poster_filename)
                    os.rename(old_poster_path, new_poster_path)
                    movie.poster = "/static/uploaded_posters/" + new_poster_filename

            # Get the poster file from the request
            poster_file = request.files.get('poster')
            if poster_file:
                if not allowed_file(poster_file.filename):
                    return {"error": "Invalid file format. Allowed formats: 'jpeg', 'jpg', 'png'"}, 400

                # Delete the old poster file if it exists
                if old_poster:
                    old_poster_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, os.path.basename(old_poster))
                    if os.path.exists(old_poster_path):
                        os.remove(old_poster_path)

                # Save the new poster file with the updated movie title as the filename
                poster_filename = secure_filename(title + "." + poster_file.filename.split(".")[-1])
                poster_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, poster_filename)
                poster_file.save(poster_path)

                movie.poster = "/static/uploaded_posters/" + poster_filename

            # Update the movie record
            movie.title = title
            if genre!="":
                movie.genre = genre
            if duration is not None:
                movie.duration = duration
            if movie_price is not None:
                movie.movie_price = movie_price

            db.session.commit()

            return marshal(movie, output_fields_movie), 200

        except Exception as e:
            # Log the error
            print("Error updating movie in the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return {"error": "Failed to update the movie. Please try again later."}, 500

    @roles_required('admin')
    @auth_required('token')
    def delete(self, id):
        movie = db.session.query(Movie).filter(Movie.id == id).first()
        if not movie:
            raise NotFoundError(status_code=404)
        screenings = db.session.query(Screening).filter(Screening.movie_title == movie.title).all()

        poster = movie.poster
        poster_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, 
                                    movie.title + "." + poster.split(".")[-1])
        if os.path.exists(poster_path):
            os.remove(poster_path)

        for screening in screenings:
            bookings = db.session.query(Booking).filter(Booking.screening_id == screening.id).all()
            for booking in bookings:
                user = db.session.query(User).filter(User.email == booking.user_email).first()
                user.account_balance += booking.amount_paid
                db.session.delete(booking)
            db.session.delete(screening)

        db.session.delete(movie)
        db.session.commit()
        return "", 200

    @roles_required('admin')
    @auth_required('token')
    def post(self):
        try:
            json_data = request.form.get('movieData')
            if not json_data:
                return {"error": "Invalid JSON data in the request"}, 400

            movie_data = json.loads(json_data)

            title = movie_data.get('title')
            genre = movie_data.get('genre')
            duration = movie_data.get('duration')
            movie_price = movie_data.get('movie_price')

            if not title or not genre or not duration or not movie_price:
                return {"error": "Please provide all the required details"}, 400

            try:
                duration = float(duration)
            except ValueError:
                return {"error": "Invalid value for 'duration'"}, 400

            try:
                movie_price = float(movie_price)
            except ValueError:
                return {"error": "Invalid value for 'movie_price'"}, 400

            # Check for an existing movie with the same title
            existing_movie = Movie.query.filter_by(title=title).first()
            if existing_movie:
                return {"error": "A movie with that title already exists. Please choose a different title."}, 400

            # Get the poster file from the request
            poster_file = request.files.get('poster')
            if not poster_file:
                return {"error": "Poster file is required"}, 400

            if not allowed_file(poster_file.filename):
                return {"error": "Invalid file format. Allowed formats: 'jpeg', 'jpg', 'png'"}, 400

            # Save the poster file with the movie title as the filename
            poster_filename = secure_filename(title + "." + poster_file.filename.split(".")[-1])
            poster_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, poster_filename)
            poster_file.save(poster_path)

            # Create the movie record
            new_movie = Movie(title=title, genre=genre, duration=duration, movie_price=movie_price, poster="/static/uploaded_posters/" + poster_filename)
            db.session.add(new_movie)
            db.session.commit()

            return marshal(new_movie, output_fields_movie), 201

        except Exception as e:
            # Log the error
            print("Error adding movie to the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return {"error": "Failed to add the movie. Please try again later."}, 500



output_fields_theatre = { "id": fields.Integer,
                        "name": fields.String,
                        "location": fields.String,
                        "seating_capacity": fields.Integer, 
                        "theatre_base_price": fields.Integer,
                        "picture": fields.String}

create_theatre_parser = reqparse.RequestParser()
create_theatre_parser.add_argument('name', type=str, required=True, help='Name is required.')
create_theatre_parser.add_argument('location', type=str, required=True, help='Location is required.')
create_theatre_parser.add_argument('seating_capacity', type=float, required=True, help='Seating Capacity is required.')
create_theatre_parser.add_argument('theatre_base_price', type=float, required=True, help='Theatre base price is required.')
create_theatre_parser.add_argument('picture', type=str, location='files', required=True, help='Picture file is required.')


class AdminTheatreAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        theatres = db.session.query(Theatre).filter(Theatre.id == id).all()
        if theatres:
            return marshal(theatres, output_fields_theatre)
        else:
            return {"error": "Theatre Not Found"}, 404


    @roles_required('admin')
    @auth_required('token')
    def put(self, id):
        try:
            theatre = db.session.query(Theatre).filter(Theatre.id == id).first()
            if not theatre:
                raise NotFoundError(status_code=404)

            json_data = request.get_json()
            if not json_data:
                return {"error": "Invalid JSON data in the request"}, 400

            name = json_data.get('name', theatre.name)  # Use existing name if not provided
            location = json_data.get('location', theatre.location)  # Use existing location if not provided
            seating_capacity = json_data.get('seating_capacity', theatre.seating_capacity)  # Use existing seating_capacity if not provided
            theatre_base_price = json_data.get('theatre_base_price', theatre.theatre_base_price)  # Use existing price if not provided

            if seating_capacity is not None:
                try:
                    seating_capacity = float(seating_capacity)
                except ValueError:
                    return {"error": "Invalid value for 'seating_capacity'"}, 400

            if theatre_base_price is not None:
                try:
                    theatre_base_price = float(theatre_base_price)
                except ValueError:
                    return {"error": "Invalid value for 'theatre_base_price'"}, 400

            # Check for an existing theatre with the same name (except for the current theatre)
            existing_theatre = Theatre.query.filter(Theatre.name == name, Theatre.id != id).first()
            if existing_theatre:
                return {"error": "A theatre with that name already exists. Please choose a different name."}, 400

            if name=="":
                name = theatre.name

            old_picture = theatre.picture
            old_name = theatre.name

            # handle update of picture - picture needs to be updated if name or file has been changed
            # Check for an existing theatre with the same name
            if name != old_name:
                existing_theatre = Theatre.query.filter_by(name=name).first()
                if existing_theatre:
                    return {"error": "A theatre with that name already exists. Please choose a different name."}, 400

                # Rename the old picture to match the new name
                if old_picture:
                    old_picture_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, os.path.basename(old_picture))
                    new_picture_filename = secure_filename(name + "." + os.path.basename(old_picture_path).split(".")[-1])
                    new_picture_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, new_picture_filename)
                    os.rename(old_picture_path, new_picture_path)
                    theatre.picture = "/static/uploaded_pictures/" + new_picture_filename

            # Get the picture file from the request
            picture_file = request.files.get('picture')
            if picture_file:
                if not allowed_file(picture_file.filename):
                    return {"error": "Invalid file format. Allowed formats: 'jpeg', 'jpg', 'png'"}, 400

                # Delete the old picture file if it exists
                if old_picture:
                    old_picture_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, os.path.basename(old_picture))
                    if os.path.exists(old_picture_path):
                        os.remove(old_picture_path)

                # Save the new picture file with the updated theatre name as the filename
                picture_filename = secure_filename(name + "." + picture_file.filename.split(".")[-1])
                picture_path = os.path.join(LocalDevelopmentConfig.UPLOADED_POSTERS_DIR, picture_filename)
                picture_file.save(picture_path)

                theatre.picture = "/static/uploaded_pictures/" + picture_filename

            # Update the theatre record
            theatre.name = name
            if location!="":
                theatre.location = location
            if seating_capacity is not None:
                theatre.seating_capacity = seating_capacity
            if theatre_base_price is not None:
                theatre.theatre_base_price = theatre_base_price

            db.session.commit()

            return marshal(theatre, output_fields_theatre), 200

        except Exception as e:
            # Log the error
            print("Error updating theatre in the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return {"error": "Failed to update the theatre. Please try again later."}, 500

    @roles_required('admin')
    @auth_required('token')
    def delete(self, id):
        theatre = db.session.query(Theatre).filter(Theatre.id == id).first()
        if not theatre:
            raise NotFoundError(status_code=404)
        screenings = db.session.query(Screening).filter(Screening.theatre_name == theatre.name).all()

        picture = theatre.picture
        picture_path = os.path.join(LocalDevelopmentConfig.UPLOADED_PICTURES_DIR, 
                                    theatre.name + "." + picture.split(".")[-1])
        if os.path.exists(picture_path):
            os.remove(picture_path)

        for screening in screenings:
            bookings = db.session.query(Booking).filter(Booking.screening_id == screening.id).all()
            for booking in bookings:
                user = db.session.query(User).filter(User.email == booking.user_email).first()
                user.account_balance += booking.amount_paid
                db.session.delete(booking)
            db.session.delete(screening)

        db.session.delete(theatre)
        db.session.commit()
        return "", 200

    @roles_required('admin')
    @auth_required('token')
    def post(self):
        try:
            json_data = request.form.get('theatreData')
            if not json_data:
                return {"error": "Invalid JSON data in the request"}, 400

            movie_data = json.loads(json_data)

            name = movie_data.get('name')
            location = movie_data.get('location')
            seating_capacity = movie_data.get('seating_capacity')
            theatre_base_price = movie_data.get('theatre_base_price')

            if not name or not location or not seating_capacity or not theatre_base_price:
                return {"error": "Please provide all the required details"}, 400

            try:
                seating_capacity = float(seating_capacity)
            except ValueError:
                return {"error": "Invalid value for 'seating_capacity'"}, 400

            try:
                theatre_base_price = float(theatre_base_price)
            except ValueError:
                return {"error": "Invalid value for 'theatre_base_price'"}, 400

            # Check for an existing theatre with the same name
            existing_theatre = Theatre.query.filter_by(name=name).first()
            if existing_theatre:
                return {"error": "A theatre with that name already exists. Please choose a different name."}, 400

            # Get the picture file from the request
            picture_file = request.files.get('picture')
            if not picture_file:
                return {"error": "Picture file is required"}, 400

            if not allowed_file(picture_file.filename):
                return {"error": "Invalid file format. Allowed formats: 'jpeg', 'jpg', 'png'"}, 400

            # Save the picture file with the movie title as the filename
            picture_filename = secure_filename(name + "." + picture_file.filename.split(".")[-1])
            picture_path = os.path.join(LocalDevelopmentConfig.UPLOADED_PICTURES_DIR, picture_filename)
            picture_file.save(picture_path)

            # Create the theatre record
            new_theatre = Theatre(name=name, location=location, seating_capacity=seating_capacity, theatre_base_price=theatre_base_price, picture="/static/uploaded_pictures/" + picture_filename)
            db.session.add(new_theatre)
            db.session.commit()

            return marshal(new_theatre, output_fields_theatre), 201

        except Exception as e:
            # Log the error
            print("Error adding theatre to the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return {"error": "Failed to add the theatre. Please try again later."}, 500



output_fields_screening = { "id": fields.Integer,
                        "theatre_name": fields.String,
                        "movie_title": fields.String,
                        "seats_available": fields.Integer, 
                        "date": fields.String,
                        "time": fields.String,
                        "ticket_price": fields.Integer}


class AdminScreeningAPI(Resource):

    @roles_required('admin')
    @auth_required('token')
    def get(self, id):
        screening = db.session.query(Screening).filter(Screening.id == id).all()
        if screening:
            return marshal(screening, output_fields_screening)
        else:
            return {"error": "Screening Not Found"}, 404


    @roles_required('admin')
    @auth_required('token')
    def put(self, id):
        try:
            screening = db.session.query(Screening).filter(Screening.id == id).first()
            if not screening:
                raise NotFoundError(status_code=404)

            json_data = request.get_json()
            if not json_data:
                return {"error": "Invalid JSON data in the request"}, 400

            #theatre_name = json_data.get('theatre')
            #movie_title = json_data.get('movie')
            date = json_data.get('date')
            time = json_data.get('time')

            if not date:
                date = screening.date

            if not time:
                time = screening.time
                
            screening.date = date
            screening.time = time

            db.session.commit()


            return marshal(screening, output_fields_screening), 200

        except Exception as e:
            # Log the error
            print("Error adding screening to the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return jsonify({"error": "Failed to add the screening. Please try again later."}), 500

    @roles_required('admin')
    @auth_required('token')
    def delete(self, id):
        screening = db.session.query(Screening).filter(Screening.id == id).first()
        if not screening:
            raise NotFoundError(status_code=404)

        bookings = db.session.query(Booking).filter(Booking.screening_id == screening.id).all()
        for booking in bookings:
            user = db.session.query(User).filter(User.email == booking.user_email).first()
            user.account_balance += booking.amount_paid
            db.session.delete(booking)
                
        db.session.delete(screening)
        db.session.commit()
        return "", 200

    @roles_required('admin')
    @auth_required('token')
    def post(self):
        try:
            json_data = request.get_json()
            if not json_data:
                return jsonify({"error": "Invalid JSON data in the request"}), 400

            theatre_name = json_data.get('theatre')
            movie_title = json_data.get('movie')
            date = json_data.get('date')
            time = json_data.get('time')

            if not theatre_name or not movie_title or not date or not time:
                return jsonify({"error": "Please provide all the required details"}), 400

            theatre = db.session.query(Theatre).filter(Theatre.name == theatre_name).first()
            seats_available = theatre.seating_capacity

            movie = db.session.query(Movie).filter(Movie.title == movie_title).first()

            ticket_price = theatre.theatre_base_price + movie.movie_price

            # Create the theatre record
            new_screening = Screening(theatre_name=theatre_name, movie_title=movie_title, seats_available=seats_available, date=date, time=time, ticket_price=ticket_price)
            db.session.add(new_screening)
            db.session.commit()


            return marshal(new_screening, output_fields_screening), 201

        except Exception as e:
            # Log the error
            print("Error adding screening to the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return jsonify({"error": "Failed to add the screening. Please try again later."}), 500




class GetMoviesAPI(Resource):

    @auth_required('token')
    def get(self):
        #movies = db.session.query(Movie).all()
        movies = data_access.get_all_movies()
        return marshal(movies, output_fields_movie)


class GetTheatresAPI(Resource):

    @auth_required('token')
    def get(self):
        #theatres = db.session.query(Theatre).all()
        theatres = data_access.get_all_theatres()
        return marshal(theatres, output_fields_theatre)



class GetScreeningsAPI(Resource):

    @auth_required('token')
    def get(self):
        #screenings = db.session.query(Screening).all()
        screenings = data_access.get_all_screenings()
        return marshal(screenings, output_fields_screening)


class GetScreenings_Movie_API(Resource):

    @auth_required('token')
    def get(self, id):
        movie = db.session.query(Movie).filter(Movie.id == id).first()
        if movie:
            screenings = db.session.query(Screening).filter(Screening.movie_title == movie.title).all()
            return marshal(screenings, output_fields_screening)
        else:
            return {"error": "Movie Not Found"}, 404


class GetScreenings_Theatre_API(Resource):

    @auth_required('token')
    def get(self, id):
        theatre = db.session.query(Theatre).filter(Theatre.id == id).first()
        if theatre:
            screenings = db.session.query(Screening).filter(Screening.theatre_name == theatre.name).all()
            return marshal(screenings, output_fields_screening)
        else:
            return {"error": "Theatre Not Found"}, 404


class GetMovie_Screening_API(Resource):

    @auth_required('token')
    def get(self, id):
        screening = db.session.query(Screening).filter(Screening.id == id).first()
        if screening:
            movie = db.session.query(Movie).filter(Movie.title == screening.movie_title).all()
            return marshal(movie, output_fields_movie)
        else:
            return {"error": "Screening Not Found"}, 404


class GetTheatre_Screening_API(Resource):

    @auth_required('token')
    def get(self, id):
        screening = db.session.query(Screening).filter(Screening.id == id).first()       
        if screening:
            theatre = db.session.query(Theatre).filter(Theatre.name == screening.theatre_name).all()
            return marshal(theatre, output_fields_theatre)
        else:
            return {"error": "Screening Not Found"}, 404


class MovieAPI(Resource):

    @auth_required('token')
    def get(self, id):
        movies = db.session.query(Movie).filter(Movie.id == id).all()
        if movies:
            return marshal(movies, output_fields_movie)
        else:
            return {"error": "Movie Not Found"}, 404

class TheatreAPI(Resource):

    @auth_required('token')
    def get(self, id):
        theatres = db.session.query(Theatre).filter(Theatre.id == id).all()
        if theatres:
            return marshal(theatres, output_fields_theatre)
        else:
            return {"error": "Theatre Not Found"}, 404


class ScreeningAPI(Resource):

    @auth_required('token')
    def get(self, id):
        screenings = db.session.query(Screening).filter(Screening.id == id).all()
        if screenings:
            return marshal(screenings, output_fields_screening)
        else:
            return {"error": "Screening Not Found"}, 404


output_fields_booking = { "id": fields.Integer,
                        "screening_id": fields.Integer,
                        "user_email": fields.String,
                        "tickets_booked": fields.Integer,
                        "amount_paid": fields.Integer}


class BookingAPI(Resource):

    @auth_required('token')
    def get(self, id):
        bookings = db.session.query(Booking).filter(Booking.id == id).all()
        if bookings:
            return marshal(bookings, output_fields_booking)
        else:
            return {"error": "Booking Not Found"}, 404
            
    '''
    @auth_required('token')
    def put(self, id):
        return
    '''

    @auth_required('token')
    def delete(self, id):
        booking = db.session.query(Booking).filter(Booking.id == id).first()
        if not booking:
            raise NotFoundError(status_code=404)
        screening = db.session.query(Screening).filter(Screening.id == booking.screening_id).first()
        screening.seats_available += booking.tickets_booked

        amount_paid = booking.amount_paid

        user = db.session.query(User).filter(User.email == booking.user_email).first()
        user.account_balance = user.account_balance + (0.5*amount_paid)

        db.session.delete(booking)
        db.session.commit()
        return "", 200

    @auth_required('token')
    def post(self):
        try:
            json_data = request.get_json()
            if not json_data:
                return jsonify({"error": "Invalid JSON data in the request"}), 400

            tickets_booked = json_data.get('tickets_booked')
            screening_id = json_data.get('screening_id')
            user_email = json_data.get('user_email')

            if not tickets_booked or not screening_id or not user_email:
                return jsonify({"error": "Please provide all the required details"}), 400

            screening = db.session.query(Screening).filter(Screening.id == screening_id).first()
            screening.seats_available = screening.seats_available - tickets_booked

            amount_paid = screening.ticket_price * tickets_booked

            user = db.session.query(User).filter(User.email == user_email).first()

            user.account_balance = user.account_balance - amount_paid


            new_booking = Booking(screening_id=screening_id, user_email=user_email, tickets_booked=tickets_booked, amount_paid=amount_paid)
            db.session.add(new_booking)
            db.session.commit()

            return marshal(new_booking, output_fields_booking), 201

        except Exception as e:
            # Log the error
            print("Error adding booking to the database:", e)
            db.session.rollback()  # Rollback the transaction in case of an error
            return jsonify({"error": "Failed to add the screening. Please try again later."}), 500

class User_BookingHistoryAPI(Resource):

    @auth_required('token')
    def get(self, email):
        bookings = db.session.query(Booking).filter(Booking.user_email == email).order_by(desc(Booking.id)).all()
        if bookings:
            return marshal(bookings, output_fields_booking)
        else:
            raise NotFoundError(status_code=404)


output_fields_user = { "email": fields.String,
                        "account_balance": fields.Integer}


class UserAPI(Resource):

    @auth_required('token')
    def get(self, email):
        user = db.session.query(User).filter(User.email == email).first()
        if user:
            return marshal(user, output_fields_user)
        else:
            return {"error": "User Not Found"}, 404

    @auth_required('token')
    def put(self, email):
        user = db.session.query(User).filter(User.email == email).first()
        if user:
            json_data = request.get_json()
            if not json_data:
                return {"error": "Invalid JSON data in the request"}, 400

            added_money = json_data.get('amount')

            if user.account_balance is None:
                user.account_balance = 0

            user.account_balance += added_money
            db.session.commit()

            return marshal(user, output_fields_user)
        else:
            raise NotFoundError(status_code=404)
