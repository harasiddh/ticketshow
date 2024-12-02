import router from "../../router.js"


const AdminMovieDelete = Vue.component("admin_movie_delete", {
    template: `
    <div>
                <div v-for="movie in movies" :key="movie.title">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Delete {{movie.title}} </span></h1>
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
          <p>&nbsp; If you choose to delete the movie, your action cannot be undone &nbsp;</p>
          <p>&nbsp;Note: Deleting movie will also delete existing shows scheduled 
          and customers will be refunded. You can choose to delete specific screenings instead. &nbsp;</p>
          <h4> Are you sure you wish to delete this movie? </h4>
          <br>
          <button @click="deleteMovie" style="background-color: darkred;
            color: white;
            padding: 10px;
            width: 100%;
            border: none;
            border-radius: 5px;
            cursor: pointer;">Yes, Delete Movie</button>
          <br>
          <br>
            <router-link :to="'/admin/movie/' + movie.id">
                <button>No, Back to Movie Details Page</button>
            </router-link>
        </div>
        <div class="movie-card">
          <!-- This column will be left blank for now -->
          <p>Title: {{ movie.title }}</p>
          <p>Genre: {{ movie.genre }}</p>
          <p>Duration: {{ movie.duration }}</p>
          <p>Movie Price: {{ movie.movie_price}}</p>
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
          formData: {
            title: "",
            genre: "",
            duration: "",
            movie_price: "",
            poster: null,
          },
        };
      },
    mounted() {
    let movie_id = this.id;
    this.fetchMovie(movie_id); // Fetch movies when the component is loaded
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
        onPosterChange(event) {
          this.formData.poster = event.target.files[0];
        },
        async deleteMovie() {
              try {
                const response = await fetch(`/api/admin/movie/${this.id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': sessionStorage.getItem('token')
                  },
                });

                if (response.ok) {
                  alert("Movie deleted successfully! You will be redirected to the home page.");
                  router.push("/admin/home");
                } else {
                  alert("Failed to delete the movie. Please try again later.");
                }
              } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while processing your request.");
              }
            }

      },
});

export default AdminMovieDelete;