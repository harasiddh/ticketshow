from .database import db
from dataclasses import dataclass
from flask_security import UserMixin, RoleMixin
from flask_login import login_manager


roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    # username = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False) 
    account_balance = db.Column(db.Integer, nullable=False)
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))


class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String)


class Theatre(db.Model):
    __tablename__ = 'theatre'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    location = db.Column(db.String, nullable=False)
    picture = db.Column(db.String, nullable=False, unique=True)
    # timings = db.Column(db.String, nullable=False)
    theatre_base_price = db.Column(db.Integer, nullable=False)
    seating_capacity = db.Column(db.Integer, nullable=False)
    # facilities = db.Column(db.String, nullable=False)  # convert it into list if possible


class Movie(db.Model):
    __tablename__ = 'movie'
    id:int = db.Column(db.Integer, autoincrement=True, primary_key=True)
    title:str = db.Column(db.String, nullable=False, unique=True)
    poster:str = db.Column(db.String, nullable=False, unique=True)
    genre:str = db.Column(db.String, nullable=False)
    duration:int = db.Column(db.Integer, nullable=False)
    movie_price:int = db.Column(db.Integer, nullable=False)


class Screening(db.Model):
    __tablename__ = 'screening'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    theatre_name = db.Column(db.String, db.ForeignKey("theatre.name"), nullable=False)
    movie_title = db.Column(db.String, db.ForeignKey("movie.title"), nullable=False)
    seats_available = db.Column(db.Integer, nullable=False)  # depends on seating capacity of theatre
    date = db.Column(db.String, nullable=False)
    time = db.Column(db.String, nullable=False)
    ticket_price = db.Column(db.Integer, nullable=False)


class Booking(db.Model):
    __tablename__ = 'booking'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    screening_id = db.Column(db.Integer, db.ForeignKey("screening.id"), nullable=False)
    user_email = db.Column(db.String, db.ForeignKey("user.email"), nullable=False)
    tickets_booked = db.Column(db.Integer, nullable=False)
    amount_paid = db.Column(db.Integer, nullable=False)