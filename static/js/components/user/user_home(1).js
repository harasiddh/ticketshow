import router from "../../router.js"

let UserHome = Vue.component("user_home", {
    template: `
  <div class="admin-home">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Home</span></h1>
    <hr style="border-color: black"/>
    <br>
    <h3> Your Account Balance: {{ user.account_balance }} </h3>
    <br>
    <h5>
              <router-link :to="'/user/add_money'">
                  Click here to increase Account Balance!
              </router-link>
    </h5>
    <br>
    <h3> These are all the movies </h3>
    <div class="image-grid" style="text-align: center">
      <div v-if="movies.length === 0">
        <p>No movies currently</p>
      </div>
      <div v-else v-for="movie in movies" :key="movie.id" class="image-item">
        &nbsp;<router-link :to="'/user/movie/' + movie.id">
          <img :src="movie.poster" alt="Movie Poster" />
        </router-link>&nbsp;
      </div>
    </div>
    <br>
    <h3> These are all the theatres </h3>
    <div class="image-grid" style="text-align: center">
      <div v-if="theatres.length === 0">
        <p>No theatres currently</p>
      </div>
      <div v-else v-for="theatre in theatres" :key="theatre.id" class="image-item">
        &nbsp;<router-link :to="'/user/theatre/' + theatre.id">
          <img :src="theatre.picture" alt="Theatre Picture" />
        </router-link>&nbsp;
      </div>
    </div>
    <br>
  </div>
    `,
    data() {
    return {
      movies: [], // Initialize movies as an empty array
      theatres: [], // Initialize theatres as an empty array
      user: {},
    };
  },
  mounted() {
    let user_email = sessionStorage.getItem('email');
    this.fetchMovies(); // Fetch movies when the component is loaded
    this.fetchTheatres();
    this.fetchUser(user_email);
  },
  methods: {
    async fetchMovies() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch("/api/get_movies", {
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
    async fetchTheatres() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch("/api/get_theatres", {
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
  },
})

export default UserHome;