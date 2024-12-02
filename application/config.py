import os
basedir = os.path.abspath(os.path.dirname(__file__))
#print(basedir)
from celery.schedules import crontab

class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    UPLOADED_POSTERS_DIR = None
    UPLOADED_PICTURES_DIR = None
    CSV_DOWNLOADS_FOLDER = None
    ALLOWED_EXTENSIONS = {'jpeg', 'jpg', 'png'}
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
    REDIS_URL = "redis://localhost:6379"
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CELERY_BEAT_SCHEDULE = {
        'daily-jobs': {
        'task': 'application.jobs.tasks.daily_jobs',
        'schedule': crontab(hour=12, minute=30),  # Schedule at 12:30 PM every day
        },
        'monthly-jobs': {
            'task': 'application.jobs.tasks.monthly_jobs',
            'schedule': crontab(day_of_month='1', hour=12, minute=30),  # Schedule on the 1st of every month at 12:30 PM
        },
        'current-jobs': {
            'task': 'application.jobs.tasks.current_jobs',  # Task name (module.function)
            'schedule': 10.0,  # Schedule in seconds (e.g., every 10 seconds)
        },
        # Add more tasks here...
    }

class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, '../db_directory')
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "testdb.sqlite3")
    UPLOADED_POSTERS_DIR = os.path.join(basedir, '../static/uploaded_posters')
    UPLOADED_PICTURES_DIR = os.path.join(basedir, '../static/uploaded_pictures')
    CSV_DOWNLOADS_FOLDER = os.path.join(basedir, '../static/csv_downloads_folder')
    DEBUG = True
    SECRET_KEY =  "ash ah secet"
    SECURITY_PASSWORD_HASH = "bcrypt"    
    SECURITY_PASSWORD_SALT = "really super secret" # Read from ENV in your case
    SECURITY_REGISTERABLE = True
    SECURITY_CONFIRMABLE = False
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_UNAUTHORIZED_VIEW = None
    WTF_CSRF_ENABLED = False
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
    REDIS_URL = "redis://localhost:6379"
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CELERY_BEAT_SCHEDULE = {
        'daily-jobs': {
        'task': 'application.jobs.tasks.daily_jobs',
        'schedule': crontab(hour=12, minute=30),  # Schedule at 12:30 PM every day
        },
        'monthly-jobs': {
            'task': 'application.jobs.tasks.monthly_jobs',
            'schedule': crontab(day_of_month='1', hour=12, minute=30),  # Schedule on the 1st of every month at 12:30 PM
        },
        'current-jobs': {
            'task': 'application.jobs.tasks.current_jobs',  # Task name (module.function)
            'schedule': 10.0,  # Schedule in seconds (e.g., every 10 seconds)
        },
        # Add more tasks here...
    }
