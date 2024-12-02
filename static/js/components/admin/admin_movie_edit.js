import router from "../../router.js"

const AdminMovieEdit = Vue.component("admin_movie_edit", {
    template: `
    <div>
                <div v-for="movie in movies" :key="movie.title">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Edit Movie Details </span></h1>
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
          <form @submit.prevent="submitForm">
        <br>
        <div>
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="formData.title"/>
        </div>
        <br>
        <div>
          <label for="genre">Genre:</label>
          <input type="text" id="genre" v-model="formData.genre"/>
        </div>
        <br>
        <div>
          <label for="duration">Duration:</label>
          <input type="number" id="duration" v-model="formData.duration"/>
        </div>
        <br>
        <div>
          <label for="movie_price">Price:</label>
          <input type="number" id="movie_price" v-model="formData.movie_price"/>
        </div>
        <br>
        <div>
          <label for="poster">Poster:</label>
          <input type="file" id="poster" @change="onPosterChange"/>
        </div>
        <br>
        <div>
          <button type="submit">Edit Details</button>
        </div>
      </form>
        </div>
        <div class="movie-card">
          <!-- This column will be left blank for now -->
          <p>Title: {{ movie.title }}</p>
          <p>Genre: {{ movie.genre }}</p>
          <p>Duration: {{ movie.duration }}</p>
          <p>Movie Price: {{ movie.movie_price}}</p>
          <p>&nbsp; Please only fill the details that you wish to change &nbsp;</p>
          <p>&nbsp;Note: Changes made to price will not affect existing bookings 
          and will only affect subsequent ones &nbsp;</p>
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
        async submitForm() {
          // Check for any blank inputs
          if (
            this.formData.title.trim() === "" &&
            this.formData.genre.trim() === "" &&
            this.formData.duration.trim() === "" &&
            this.formData.movie_price.trim() === "" &&
            !this.formData.poster
          ) {
            alert("Please fill at least one field before submitting.");
            return;
          }

          try {
            // Check for existing movie with the same title
            if (this.formData.title) {
              const existingMovieResponse = await fetch(`/api/check_movie/${encodeURIComponent(this.formData.title)}`);
              const existingMovieData = await existingMovieResponse.json();
              if (existingMovieData.exists) {
                alert("A movie with that title already exists. Please choose a different title.");
                return;
              }
            }

            // Continue with form submission if the title is unique
            const movieData = {
              title: this.formData.title,
              genre: this.formData.genre,
              duration: parseFloat(this.formData.duration),
              movie_price: parseFloat(this.formData.movie_price),
            };

            const response = await fetch(`/api/admin/movie/${this.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json', // Set the Content-Type header to 'application/json'
                'Authentication-Token': sessionStorage.getItem('token')
              },
              body: JSON.stringify(movieData), // Convert movieData to JSON string and send it in the request body
            });

            if (response.ok) {
              alert("Movie updated successfully!");
              this.fetchMovie(this.id); // Fetch updated movie details again
            } else {
              alert("Failed to update the movie. Please try again later.");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your request.");
          }
        }

      },
});
export default AdminMovieEdit;