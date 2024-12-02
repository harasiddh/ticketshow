import os, json
from application.data.database import db
import werkzeug
from flask import abort, jsonify
from sqlalchemy import desc
from application.data.models import User, Role, Theatre, Movie, Screening, Booking

'''
def get_all_movies():
    from main import cache  # Import cache locally to avoid circular import
    cached_movies = cache.get('all_movies')
    
    if cached_movies is None:
        movies = db.session.query(Movie).all()
        cache.set('all_movies', movies, timeout=1000)
        return movies
    
    return cached_movies
'''


from common import cache

@cache.cached(timeout=30, key_prefix='get_all_movies')
def get_all_movies():
    movies = db.session.query(Movie).order_by(desc(Movie.id)).all()
    return movies

@cache.cached(timeout=30, key_prefix='get_all_theatres')
def get_all_theatres():
    theatres = db.session.query(Theatre).order_by(desc(Theatre.id)).all()
    return theatres

@cache.cached(timeout=30, key_prefix='get_all_screenings')
def get_all_screenings():
    screenings = db.session.query(Screening).order_by(desc(Screening.id)).all()
    return screenings

@cache.cached(timeout=30, key_prefix='get_all_bookings')
def get_all_bookings():
    bookings = db.session.query(Booking).order_by(desc(Booking.id)).all()
    return bookings
