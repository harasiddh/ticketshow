import os, csv
from application.jobs.workers import celery
from datetime import datetime, timedelta
from celery.schedules import crontab
from flask import render_template_string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from application.data.models import User, Booking, Screening, Theatre, Movie
from application.data.database import db
from application.config import LocalDevelopmentConfig

@celery.task()
def current_jobs():
	print("STARTED CURRENT JOBS")
	now = datetime.now()
	print("now in task = ", now)
	dt_string = now.strftime("%d/%m/%y %H:%M:%S")
	print("date and time = ", dt_string)
	daily_reminder.delay(dt_string)
	monthly_report.delay(dt_string)
	print("COMPLETED CURRENT JOBS")
	return dt_string


@celery.task()
def daily_jobs():
	print("STARTED DAILY JOBS")
	now = datetime.now()
	#print("now in task = ", now)
	dt_string = now.strftime("%d/%m/%y %H:%M:%S")
	#print("date and time = ", dt_string)
	daily_reminder.delay(dt_string)
	print("COMPLETED DAILY JOBS")
	return dt_string


@celery.task()
def monthly_jobs():
	print("STARTED MONTHLY JOBS")
	now = datetime.now()
	#print("now in task = ", now)
	dt_string = now.strftime("%d/%m/%y %H:%M:%S")
	#print("date and time = ", dt_string)
	monthly_report.delay(dt_string)
	print("COMPLETED MONTHLY JOBS")
	return dt_string


@celery.task()
def daily_reminder(datetime_str):
    users = db.session.query(User).all()  # Retrieve all users from the database
    subject = "Book tickets before they sell out!"
    sender_email = 'do_not_reply@ticketshow.com'
    smtp_server = 'localhost'  # MailHog's SMTP server is running on localhost
    smtp_port = 1025  # Default port for MailHog's SMTP server

    for user in users:
    	if user.has_role('user'):
	    	booking = db.session.query(Booking).filter(Booking.user_email == user.email).first()
	    	if booking is None:
		        recipient_email = user.email

		        msg = MIMEMultipart()
		        msg['From'] = sender_email
		        msg['To'] = recipient_email
		        msg['Subject'] = subject
		        body = f"Gentle Reminder to book tickets to your favourite shows before they sell out. Sent on {datetime_str}"
		        msg.attach(MIMEText(body, 'plain'))

		        try:
		            server = smtplib.SMTP(smtp_server, smtp_port)
		            server.sendmail(sender_email, recipient_email, msg.as_string())
		            server.quit()
		            print(f"Email sent successfully to {recipient_email}")
		        except Exception as e:
		            print(f"Error sending email to {recipient_email}: {e}")


@celery.task()
def monthly_report(datetime_str):
    users = db.session.query(User).all()  # Retrieve all users from the database
    subject = "Monthly Entertainment Report"
    sender_email = 'do_not_reply@ticketshow.com'
    smtp_server = 'localhost'  # MailHog's SMTP server is running on localhost
    smtp_port = 1025  # Default port for MailHog's SMTP server

    for user in users:
    	if user.has_role('user'):
	    	bookings = db.session.query(Booking).filter(Booking.user_email == user.email).all()
	    	screenings = db.session.query(Screening).all()
	    	if bookings:
	    		report_html = generate_html_report(user, bookings, screenings, datetime_str)

	    		recipient_email = user.email

	    		msg = MIMEMultipart()
	    		msg['From'] = sender_email
	    		msg['To'] = recipient_email
	    		msg['Subject'] = subject

	    		msg.attach(MIMEText(report_html, 'html'))

	    		try:
	    			server = smtplib.SMTP(smtp_server, smtp_port)
	    			server.sendmail(sender_email, recipient_email, msg.as_string())
	    			server.quit()
	    			print(f"Email sent successfully to {recipient_email}")
	    		except Exception as e:
	    			print(f"Error sending email to {recipient_email}: {e}")


def generate_html_report(user, bookings, screenings, datetime_str):
    # Creates an HTML report based on user and booking information
    report = f"""
    <html>
    <head>
        <title>Monthly Entertainment Report</title>
    </head>
    <body>
        <h2>Monthly Entertainment Report</h2>
        <p>Hello {user.email},</p>
        <p>Here is your monthly entertainment report for {datetime_str}:</p>
        
        <table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th>Booking ID</th>
                <th>Movie Title</th>
                <th>Theatre Name</th>
                <th>Screening Date</th>
                <th>Screening Time</th>
                <th>Tickets Booked</th>
                <th>Amount Paid</th>
            </tr>
            """


    '''
    today = datetime.today()
    first_day_of_last_month = (today.replace(day=1) - timedelta(days=1)).replace(day=1).date()
    last_day_of_last_month = first_day_of_last_month.replace(day=31)
    '''

    for booking in bookings:
    	for screening in screenings:
    		screening_date = datetime.strptime(screening.date, "%Y-%m-%d").date()
    		if booking.screening_id == screening.id: #and first_day_of_last_month <= screening_date <= last_day_of_last_month:
		        report += f"""
		            <tr>
		                <td>{booking.id}</td>
		                <td>{screening.movie_title}</td>
		                <td>{screening.theatre_name}</td>
		                <td>{screening.date}</td>
		                <td>{screening.time}</td>
		                <td>{booking.tickets_booked}</td>
		                <td>Rs.{booking.amount_paid}</td>
		            </tr>
		        """

    report += """
        </table>
        
        <p>Thank you for using our service!</p>
        <p>Best regards,<br>Team TicketShow</p>
    </body>
    </html>
    """
    return report


@celery.task()
def generate_theatre_csv(theatre_id):
    # Get theatre details from the database based on theatre_id
    now = datetime.now()
    dt_string = now.strftime("%d/%m/%y %H:%M:%S")

    theatre = db.session.query(Theatre).filter(Theatre.id == theatre_id).first()  # Replace with your database query logic
    screenings = db.session.query(Screening).filter(Screening.theatre_name == theatre.name).all()


    csv_data = [['Screening ID', 'Theatre', 'Movie', 'Date', 'Time', 'Seating Capacity', 'Tickets Booked', 'Seats Available']]

    # Define CSV file path
    csv_filename = f'theatre_{theatre_id}_export.csv'
    csv_filepath = os.path.join(LocalDevelopmentConfig.CSV_DOWNLOADS_FOLDER, csv_filename)

    for screening in screenings:
	    csv_data.append([screening.id, screening.theatre_name, screening.movie_title, 
	    	screening.date, screening.time, theatre.seating_capacity, theatre.seating_capacity-screening.seats_available, screening.seats_available])
	        

    # Write CSV file
    with open(csv_filepath, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerows(csv_data)

    send_csv_export_alert(theatre_id, csv_filepath, dt_string)  # Sends email when the task is completed

    return csv_filepath


@celery.task()
def send_csv_export_alert(theatre_id, csv_filepath, datetime_str):
    subject = f"Download Ready - Theatre {theatre_id}"
    sender_email = 'analytics@ticketshow.com'
    smtp_server = 'localhost'  # MailHog's SMTP server is running on localhost
    smtp_port = 1025  # Default port for MailHog's SMTP server

    recipient_email = 'admin@ticketshow.com'

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    body = f"Your requested report is ready and available at {csv_filepath}. It was generated on {datetime_str}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print(f"Email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"Error sending email to {recipient_email}: {e}")