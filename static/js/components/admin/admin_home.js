import router from "../../router.js"

let AdminHome = Vue.component("admin_home", {
    template: `
   <div class="admin-home">
    <hr style="border-color: black"/>
    <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Home</span></h1>
    <hr style="border-color: black"/>
    <br>
    <h3> These are all the movies </h3>
    <div class="image-grid" style="text-align: center">
      <div v-if="movies.length === 0">
        <p>No movies currently</p>
      </div>
      <div v-else v-for="movie in movies" :key="movie.id" class="image-item">
        &nbsp;<router-link :to="'/admin/movie/' + movie.id">
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
        &nbsp;<router-link :to="'/admin/theatre/' + theatre.id">
          <img :src="theatre.picture" alt="Theatre Picture" />
        </router-link>&nbsp;
      </div>
    </div>
    <br>
  </div>


    `,
    data() {
    return {
      movies: [], 
      theatres: [],
    };
  },
  mounted() {
    this.fetchMovies(); // Fetch movies when the component is loaded
    this.fetchTheatres(); // Fetch theatres when the component is loaded
  },
  methods: {
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
            } else if (response.status === 403) {
              router.push("/Error/403");
            } else {
              // Can Handle other errors if needed
              // console.error("Error fetching movies:", response.status);
                router.push("/Error/Unknown");
            }
          } catch (error) {
            console.error("Error fetching movies:", error);
          }
    },
    async fetchTheatres() {
      try {
        // Makes an asynchronous call to the '/get_theatres' endpoint
        const response = await fetch("/api/admin/get_theatres", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        if (response.ok) {
              const data = await response.json();
              this.theatres = data; // Update the 'theatres' array with the fetched data
            } else if (response.status === 403) {
              router.push("/Error/403");
            } else {
              // Can Handle other errors if needed
              // console.error("Error fetching movies:", response.status);
                router.push("/Error/Unknown");
            }
          } catch (error) {
            console.error("Error fetching movies:", error);
          }
    },
  },
})

export default AdminHome;