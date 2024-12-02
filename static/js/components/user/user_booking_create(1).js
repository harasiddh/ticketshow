import router from "../../router.js"

let UserBookingCreate = Vue.component("user_booking_create", {
    template: `
    <div>
  <div v-for="screening in screenings" :key="screening.id">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> {{screening.theatre_name}} - {{screening.movie_title}} </span></h1>
    <hr style="border-color: black"/>
    <br>
      <div class="movie-columns">
        <div class="movie-card">
        <div v-for="movie in movies">
          <router-link :to="'/user/movie/' + movie.id">
            <img :src="movie.poster" class="poster">
          </router-link>
          <br>
        </div>
        </div>
        <div class="movie-card">
            <br>
            <p>Theatre: {{ screening.theatre_name }}</p>
            <p>Movie: {{ screening.movie_title }}</p>
            <p>Date: {{ screening.date }}</p>
            <p>Time: {{ screening.time }}</p>
            <p>Ticket Price: Rs.{{ screening.ticket_price }}</p>
          <div v-if="screening.seats_available > 0">
            <form @submit.prevent="submitForm">
              <br>
              <div>
                <label for="tickets_booked">Tickets:</label>
                <select v-model="formData.tickets_booked" required>
                  <option value="" disabled>Select the number of tickets</option>
                  <option v-for="i in Math.min(10, screening.seats_available)" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
              <br>
              <div>
                Amount to be Paid = Rs.{{screening.ticket_price * formData.tickets_booked}}
              </div>
              <br>
              <div>
                <button type="submit" :disabled="formData.tickets_booked === 0">Buy Tickets</button>
              </div>
              <br>
              <br>
              <h5>
              <router-link :to="'/user/add_money'">
                  Click here to add money in your account!
              </router-link>
            </h5>
            </form>
          </div>
          <div v-else>
            <p>Sold Out!</p>
          </div>
        </div>
        <div class="movie-card">
          <div v-for="theatre in theatres">
          <router-link :to="'/user/theatre/' + theatre.id">
            <img :src="theatre.picture" class="picture">
          </router-link>
          <br>
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
      formData: {
        tickets_booked: "",
      },
      user: {},
    };
  },
  mounted() {
    let screening_id = this.id;
    let user_email = sessionStorage.getItem('email');
    this.fetchScreening(screening_id); // Fetch movies when the component is loaded
    this.fetchMovie(screening_id);
    this.fetchTheatre(screening_id);
    this.fetchUser(user_email);
  },
  methods: {
    async fetchMovie(screening_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/get_movie/screening/${screening_id}`, {
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
    async fetchTheatre(screening_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/get_theatre/screening/${screening_id}`, {
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
    async fetchScreening(screening_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/screening/${screening_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        if (response.ok) {
        const data = await response.json();
        this.screenings = data; // Update the 'screenings' array with the fetched data
      } else if (response.status === 401) {
              router.push("/Error/401");
            } else if (response.status === 403) {
              router.push("/Error/403");
            } else if (response.status === 404) {
              router.push("/Error/404");
            } else if (response.status === 500) {
              router.push("/Error/500");
            }  else {
              // Handle other errors, if needed
              // console.error("Error fetching movies:", response.status);
                router.push("/Error/Unknown");
            }
      } catch (error) {
        console.error("Error fetching screening:", error);
      }
    },
    async fetchUser(user_email) {
      try {
        const response = await fetch(`/api/user/${user_email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.user = data; // Update the 'movies' array with the fetched data
      } catch (error) {
        console.error("Error fetching user_details:", error);
      }
    },
    async submitForm() {
      try {
        const bookingData = {
          tickets_booked: this.formData.tickets_booked,
          screening_id: this.id,
          user_email: sessionStorage.getItem('email')
        };

        const ticketPrice = this.screenings[0].ticket_price;
        const totalAmount = ticketPrice * this.formData.tickets_booked;

        if (totalAmount > this.user.account_balance) {
        alert("Insufficient balance. Please add more money to your account.");
        this.fetchUser(sessionStorage.getItem('email'))
        return; // Exiting the function if balance is insufficient
        }

        const response = await fetch("/api/booking/create", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
          body: JSON.stringify(bookingData), // Send data as JSON
        });

        if (response.ok) {
          alert("Tickets Booked Successfully! You will be redirected to booking history page");
          this.resetForm();
          router.push("/user/booking_history");
        } else {
          alert("Failed to book tickets. Please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      }
    },
    resetForm() {
      this.formData.tickets_booked = "";
    },
  },
})

export default UserBookingCreate;