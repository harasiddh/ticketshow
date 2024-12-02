import router from "../../router.js"

let AdminMovieDetails = Vue.component("admin_movie_details", {
    template: `
    <div>
  <div v-for="movie in movies" :key="movie.title">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> {{movie.title}} </span></h1>
    <hr style="border-color: black"/>
    <br>
      <div class="movie-columns">
        <div class="movie-card">
          <router-link :to="'/admin/movie/' + movie.id">
            <img :src="movie.poster" class="poster">
          </router-link>
          <br>
        </div>
        <div class="movie-card">
          <!-- Add other details here, for example: -->
          <!-- <p>Release Date: {{ movie.releaseDate }}</p> -->
          <!-- <p>Genre: {{ movie.genre }}</p> -->
          <!-- <p>Director: {{ movie.director }}</p> -->
          <!-- <p>Rating: {{ movie.rating }}</p> -->
          <!-- Add other details here -->
          <br>
          <p>Genre: {{ movie.genre }}</p>
          <p>Duration: {{ movie.duration }}</p>
          <p>
          <router-link :to="'/admin/movie/' + movie.id + '/edit'">
            Edit Details
          </router-link>
          </p>
          <p>
          <router-link :to="'/admin/movie/' + movie.id + '/delete'" style="color: red;">
            Delete Movie
          </router-link>
          </p>
        </div>
        <div class="movie-card">
          <p> List of Screenings </p>
          <div v-for="screening in screenings" :key="screening.id"> 
          <p> 
          <router-link :to="'/admin/screening/' + screening.id">
            {{ screening.theatre_name }}, {{ screening.date }}, {{screening.time}}
          </router-link>
          </p>
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
      movies: [], // Initialize movies as an empty array
      screenings: [],
    };
  },
  mounted() {
    let movie_id = this.id;
    this.fetchMovie(movie_id); // Fetch movies when the component is loaded
    this.fetchScreenings(movie_id)
  },
  methods: {
    async fetchMovie(movie_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/admin/movie/${movie_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
          if (response.ok) {
              const data = await response.json();
              this.movies = data; // Update the 'movies' array with the fetched data
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
            console.error("Error fetching movies:", error);
          }
    },
    async fetchScreenings(movie_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/admin/get_screenings/movie/${movie_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.screenings = data; // Update the 'movies' array with the fetched data
      } catch (error) {
        console.error("Error fetching screenings:", error);
      }
    },
  },
})

export default AdminMovieDetails;