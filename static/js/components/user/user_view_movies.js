import router from "../../router.js"

let UserViewMovies = Vue.component("user_view_movies", {
    template: `
  <div class="admin-home">
    <hr style="border-color: black" />
    <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Movies</span></h1>
    <hr style="border-color: black" />
    <br>
    <!-- Add the genre filter select dropdown -->
    <div style="text-align: center">
      <label for="genreSelect">Filter by Genre:</label>
      <select v-model="selectedGenre" @change="filterMovies" id="genreSelect">
        <option value="">All Genres</option>
        <option v-for="genre in genres" :key="genre">{{ genre }}</option>
      </select>
    </div>
    <br>
    <div v-if="filteredMovies.length > 0" class="image-grid" style="text-align: center">
        <div v-for="movie in filteredMovies" :key="movie.id" class="image-item">
          &nbsp;<router-link :to="'/user/movie/' + movie.id">
            <img :src="movie.poster" alt="Movie Poster" />
          </router-link>&nbsp;
        </div>
      </div>
      <div v-else>
        <p>No movies</p>
      </div>
      <br>
    </div>
    `,
    data() {
    return {
      movies: [], // Initialize movies as an empty array
      genres: [], // Initialize genres as an empty array
      selectedGenre: '', // Store the selected genre for filtering
    };
  },
  mounted() {
    this.fetchMovies(); // Fetch movies when the component is loaded
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch("/api/get_movies", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token'),
          },
        });
        const data = await response.json();
        this.movies = data; // Update the 'movies' array with the fetched data
        this.updateGenres(); // Update the list of available genres
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
    updateGenres() {
      // Extract all unique genres from the movies data and update 'genres' array
      const allGenres = this.movies.flatMap(movie => movie.genre.split(', '));
      this.genres = Array.from(new Set(allGenres));
    },
  },
    computed: {
    filteredMovies() {
      // Use a computed property for filteredMovies
      if (this.selectedGenre === '') {
        return this.movies; // If no genre is selected, return all movies
      } else {
        // If a genre is selected, filter movies based on the selected genre
        return this.movies.filter(movie => {
          const genres = movie.genre.split(', ').map(genre => genre.trim().toLowerCase());
          return genres.includes(this.selectedGenre.toLowerCase());
        });
      }
    },
  },
})

export default UserViewMovies;