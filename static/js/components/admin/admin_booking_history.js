let AdminBookingHistory = Vue.component("admin_booking_history", {
    template: `
    <div>
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Booking History </span></h1>
    <hr style="border-color: black"/>
    <div style="text-align: center">
      <label for="emailSelect">Filter by Email:</label>
      <select v-model="selectedEmail" @change="filterBookings" id="emailSelect">
        <option value="">All Emails</option>
        <option v-for="user_email in user_emails" :key="user_email">{{ user_email }}</option>
      </select>
    </div>
    <br>
    <div v-if="filteredBookings.length === 0">
        <p>No bookings currently</p>
      </div>
      <div v-else v-for="booking in filteredBookings" :key="booking.id">
        <div v-for="screening in screenings" :key="screening.id">
            <div v-for="movie in movies" :key="movie.id">
                <div v-for="theatre in theatres" :key="theatre.id">
                    <div v-if="booking.screening_id === screening.id">
                        <div v-if="screening.movie_title === movie.title && screening.theatre_name === theatre.name">
                            <div class="movie-columns">
                                <div class="movie-card">
                                </div>
                                <!-- cover all this in a box -->
                                <div class="booking-box">
                                    <div class="movie-columns">
                                    <div class="movie-card">
                                    <br>
                                        <router-link :to="'/admin/movie/' + movie.id">
                                            <img :src="movie.poster" class="poster">
                                        </router-link>
                                    <br>
                                    </div>
                                    <div class="movie-card">
                                    <p>
                                            Booking ID: {{ booking.id }}
                                    </p>
                                    <p>
                                            Buyer: {{ booking.user_email }}
                                    </p>
                                    <p>
                                        <router-link :to="'/admin/screening/' + screening.id">
                                            Screening ID: {{ screening.id }}
                                        </router-link>
                                    </p>
                                    <p>
                                        <router-link :to="'/admin/theatre/' + theatre.id">
                                        Theatre: {{ screening.theatre_name }}
                                        </router-link>
                                    </p>
                                    <p>
                                        <router-link :to="'/admin/movie/' + movie.id">
                                        Movie: {{ screening.movie_title }}
                                        </router-link>
                                    </p>
                                    <p>Date: {{ screening.date }}</p>
                                    <p>Time: {{ screening.time }}</p>
                                    <p>Tickets Booked: {{ booking.tickets_booked }}</p>
                                    <p>Amount Paid: {{ booking.amount_paid }}</p>
                                    </div>
                                    <!-- end box starting here -->
                                    </div>
                                </div>
                                <div class="movie-card">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    `,
    data() {
    return {
      screenings: [], // Initialize movies as an empty array
      movies: [],
      theatres: [],
      bookings: [],
      user_emails: [], // Initialize genres as an empty array
      selectedEmail: '', // Store the selected genre for filtering
    };
  },
  mounted() {
    let user_email = sessionStorage.getItem('email')
    this.fetchBookings()
    this.fetchScreening(); // Fetch movies when the component is loaded
    this.fetchMovie();
    this.fetchTheatre();
  },
  methods: {
    async fetchMovie() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/get_movies`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.movies = data; // Update the 'movies' array with the fetched data
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    async fetchTheatre() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/get_theatres`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.theatres = data; // Update the 'movies' array with the fetched data
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    },
    async fetchScreening() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/get_screenings`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.screenings = data; // Update the 'screenings' array with the fetched data
      } catch (error) {
        console.error("Error fetching screening:", error);
      }
    },
    async fetchBookings() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/admin/get_bookings`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.bookings = data; // Update the 'movies' array with the fetched data
        this.updateEmails();
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    },
    updateEmails() {
      // Extract all unique genres from the movies data and update 'genres' array
      const allEmails = this.bookings.flatMap(booking => booking.user_email.split(', '));
      this.user_emails = Array.from(new Set(allEmails));
    },
  },
  computed: {
    filteredBookings() {
      // Use a computed property for filteredMovies
      if (this.selectedEmail === '') {
        return this.bookings; // If no genre is selected, return all movies
      } else {
        // If a genre is selected, filter movies based on the selected genre
        return this.bookings.filter(booking => {
          const user_emails = booking.user_email.split(', ').map(user_email => user_email.trim().toLowerCase());
          return user_emails.includes(this.selectedEmail.toLowerCase());
        });
      }
    },
  },
})

export default AdminBookingHistory;