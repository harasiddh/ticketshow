import router from "../../router.js"

const AdminMovieCreate = Vue.component("admin_movie_create", {
  template: `
    <div class="admin-movie-create">
        <hr style="border-color: black"/>
            <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Create Movie</span></h1>
        <hr style="border-color: black"/>
        <br>
      <form @submit.prevent="submitForm">
        <br>
        <div>
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="formData.title" required />
        </div>
        <br>
        <div>
          <label for="genre">Genre:</label>
          <input type="text" id="genre" v-model="formData.genre" required />
        </div>
        <br>
        <div>
          <label for="duration">Duration (mins):</label>
          <input type="number" id="duration" v-model="formData.duration" required />
        </div>
        <br>
        <div>
          <label for="movie_price">Price:</label>
          <input type="number" id="movie_price" v-model="formData.movie_price" required />
        </div>
        <br>
        <div>
          <label for="poster">Poster:</label>
          <input type="file" id="poster" @change="onPosterChange" required />
        </div>
        <br>
        <div>
          <button type="submit">Add Movie</button>
        </div>
      </form>
    </div>
  `,
  data() {
    return {
      movies: [],
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
    this.fetchMovies();
  },
  methods: {
    onPosterChange(event) {
      this.formData.poster = event.target.files[0];
    },
    async fetchMovies() {
      try {
        // Makes an asynchronous call to the '/get_movies' endpoint
        const response = await fetch("/api/admin/get_movies", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
            if (response.ok) {
              const data = await response.json();
              this.movies = data; // Updates the 'movies' array with the fetched data
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
    async submitForm() {
      // Check for any blank inputs
      if (
        this.formData.title.trim() === "" ||
        this.formData.genre.trim() === "" ||
        this.formData.duration.trim() === "" ||
        this.formData.movie_price.trim() === "" ||
        !this.formData.poster
      ) {
        alert("Please fill in all the fields before submitting.");
        return;
      }

      try {
        // Check for existing movie with the same title
        const existingMovieResponse = await fetch(`/api/check_movie/${encodeURIComponent(this.formData.title)}`);
        const existingMovieData = await existingMovieResponse.json();
        if (existingMovieData.exists) {
          alert("A movie with that title already exists. Please choose a different title.");
          return;
        }

        // Continue with form submission if the title is unique
        const movieData = {
          title: this.formData.title,
          genre: this.formData.genre,
          duration: parseFloat(this.formData.duration),
          movie_price: parseFloat(this.formData.movie_price),
        };

        const formData = new FormData();
        formData.append("movieData", JSON.stringify(movieData)); // Convert movieData to JSON string and append as a field
        formData.append("poster", this.formData.poster); // Append the poster file
        console.log(formData)

        const response = await fetch("/api/admin/movie/create", {
          method: 'POST',
          headers: {
            //'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
          body: formData,
        });

        if (response.ok) {
          alert("Movie added successfully!");
          this.resetForm();
        } else {
          alert("Failed to add the movie. Please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      }
    },
    resetForm() {
      this.formData.title = "";
      this.formData.genre = "";
      this.formData.duration = "";
      this.formData.movie_price = "";
      this.formData.poster = null;
    },
  },
});

export default AdminMovieCreate;
