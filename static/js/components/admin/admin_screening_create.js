import router from "../../router.js"

const AdminScreeningCreate = Vue.component("admin_screening_create", {
  template: `
  <div class="admin-movie-create">
    <hr style="border-color: black" />
    <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Create Screening</span></h1>
    <hr style="border-color: black" />
    <br>
    <div v-if="theatres.length > 0 && movies.length > 0" class="admin-movie-create">
    <form @submit.prevent="submitForm">
      <br>
      <div>
        <label for="theatre">Theatre:</label>
        <select v-model="formData.theatre" required>
          <option value="" disabled>Select a Theatre</option>
          <option v-for="theatre in sortedTheatres" :key="theatre.id" :value="theatre.name">{{ theatre.name }}</option>
        </select>
      </div>
      <br>
      <div>
        <label for="movie">Movie:</label>
        <select v-model="formData.movie" required>
          <option value="" disabled>Select a Movie</option>
          <option v-for="movie in sortedMovies" :key="movie.id" :value="movie.title">{{ movie.title }}</option>
        </select>
      </div>
      <br>
      <div>
        <label for="date">Date:</label>
        <input type="date" v-model="formData.date" required>
      </div>
      <br>
      <div>
        <label for="time">Time:</label>
        <input type="time" v-model="formData.time" required>
      </div>
      <br>
      <div>
        <button type="submit">Add Screening</button>
      </div>
    </form>
  </div>
  <div v-else class="admin-movie-create">
      <p v-if="theatres.length === 0">You must create at least one theatre before creating a screening.</p>
      <p v-if="movies.length === 0">You must create at least one movie before creating a screening.</p>
  </div>
  </div>
  `,
  data() {
    return {
      movies: [],
      theatres: [],
      formData: {
        theatre: "",
        movie: "",
        date: "",
        time: "",
      },
    };
  },
  computed: {
    sortedMovies() {
      return this.movies.slice().sort((a, b) => a.title.localeCompare(b.title));
    },
    sortedTheatres() {
      return this.theatres.slice().sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mounted() {
    this.fetchMovies();
    this.fetchTheatres();
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch("/api/admin/get_movies", {
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
    async fetchTheatres() {
      try {
        const response = await fetch("/api/admin/get_theatres", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
        });
        if (response.ok) {
              const data = await response.json();
              this.theatres = data; // Update the 'movies' array with the fetched data
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
    async submitForm() {
      if (
        this.formData.theatre.trim() === "" ||
        this.formData.movie.trim() === "" ||
        this.formData.date.trim() === "" ||
        this.formData.time.trim() === ""
      ) {
        alert("Please fill in all the fields before submitting.");
        return;
      }

      try {
        const screeningData = {
          theatre: this.formData.theatre,
          movie: this.formData.movie,
          date: this.formData.date,
          time: this.formData.time,
        };

        const response = await fetch("/api/admin/screening/create", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
          body: JSON.stringify(screeningData), // Send data as JSON
        });

        if (response.ok) {
          alert("Screening added successfully!");
          this.resetForm();
        } else {
          alert("Failed to add the screening. Please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      }
    },
    resetForm() {
      this.formData.theatre = "";
      this.formData.movie = "";
      this.formData.date = "";
      this.formData.time = "";
    },
  },
});

export default AdminScreeningCreate;
