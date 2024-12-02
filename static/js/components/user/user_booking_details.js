import router from "../../router.js"

let UserBookingDetails = Vue.component("user_booking_details", {
    template: `
    <div>
    <div v-for="booking in bookings" :key="booking.id">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Booking {{ booking.id }} </span></h1>
    <hr style="border-color: black"/>
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
                                        <router-link :to="'/user/movie/' + movie.id">
                                            <img :src="movie.poster" class="poster">
                                        </router-link>
                                    <br>
                                    </div>
                                    <div class="movie-card">
                                    <br>
                                    <br>
                                    <br>
                                    <br>
                                    <p>
                                        <router-link :to="'/user/booking/' + booking.id">
                                            Booking ID: {{ booking.id }}
                                        </router-link>
                                    </p>
                                    <p>
                                        <router-link :to="'/user/theatre/' + theatre.id">
                                        Theatre: {{ screening.theatre_name }}
                                        </router-link>
                                    </p>
                                    <p>
                                        <router-link :to="'/user/movie/' + movie.id">
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
                                    <router-link :to="'/user/booking/' + booking.id + '/cancel'" style="color: red">
                                        Wish to cancel your booking? Click here
                                    </router-link>
                                </div>
                                <br>
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
    props: {
    id: {
      required: true,
      type: Number,
      },
    },
    data() {
    return {
      screenings: [], // Initialize movies as an empty array
      movies: [],
      theatres: [],
      bookings: [],
    };
  },
  mounted() {
    let booking_id = this.id;
    this.fetchBooking(booking_id);
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
    async fetchBooking(booking_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/booking/${booking_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        if (response.ok) {
              const data = await response.json();
              this.bookings = data; // Update the 'movies' array with the fetched data
            } else if (response.status === 401) {
              router.push("/Error/401");
            } else if (response.status === 403) {
              router.push("/Error/403");
            } else if (response.status === 404) {
              router.push("/Error/404");
            } else if (response.status === 500) {
              router.push("/Error/500");
            } else {
              // Handle other errors, if needed
              // console.error("Error fetching movies:", response.status);
                router.push("/Error/Unknown");
            }
          } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    },
  },
})

export default UserBookingDetails;