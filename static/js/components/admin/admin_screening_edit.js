import router from "../../router.js"

const AdminScreeningEdit = Vue.component("admin_screening_edit", {
    template: `
    <div>
    <div v-for="screening in screenings" :key="screening.id">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Edit Screening </span></h1>
    <hr style="border-color: black"/>
    <br>
      <div class="movie-columns">
        <div class="movie-card">
        <div v-for="movie in movies">
          <router-link :to="'/admin/movie/' + movie.id">
            <img :src="movie.poster" class="poster">
          </router-link>
          <br>
        </div>
        </div>
        <div class="movie-card">
          <form @submit.prevent="submitForm">
          <br>
          <div>
            <label for="date">Date:</label>
            <input type="date" v-model="formData.date">
          </div>
          <br>
          <div>
            <label for="time">Time:</label>
            <input type="time" v-model="formData.time">
          </div>
          <br>
          <div>
            <button type="submit">Edit Screening</button>
          </div>
          </form>
        </div>
        <div class="movie-card">
          <!-- This column will be left blank for now -->
          <p>Theatre: {{ screening.theatre_name }} </p>
          <p>Movie: {{ screening.movie_title }} </p>
          <p>Date: {{ screening.date }}</p>
          <p>Time: {{ screening.time }}</p>
          <p>Ticket Price: Rs.{{ screening.ticket_price }}</p>
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
      }
    },
    data() {
    return {
      screenings: [], // Initialize movies as an empty array
      movies: [],
      theatres: [],
      formData: {
        date: "",
        time: "",
      },
    };
  },
  mounted() {
    let screening_id = this.id;
    this.fetchScreening(screening_id); // Fetch movies when the component is loaded
    this.fetchMovie(screening_id);
    this.fetchTheatre(screening_id);
  },
  methods: {
    async fetchMovie(screening_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/admin/get_movie/screening/${screening_id}`, {
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
        const response = await fetch(`/api/admin/get_theatre/screening/${screening_id}`, {
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
        const response = await fetch(`/api/admin/screening/${screening_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        if (response.ok) {
              const data = await response.json();
              this.screenings = data; // Update the 'movies' array with the fetched data
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
      if (
        this.formData.date.trim() === "" &&
        this.formData.time.trim() === ""
      ) {
        alert("Please fill atleast one field before submitting.");
        return;
      }

      try {
        const screeningData = {
          date: this.formData.date,
          time: this.formData.time,
        };

        const response = await fetch(`/api/admin/screening/${this.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
          body: JSON.stringify(screeningData), // Send data as JSON
        });

        if (response.ok) {
          alert("Screening edited successfully!");
          this.resetForm();
        } else {
          alert("Failed to edit the screening. Please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      }
    },
    resetForm() {
      this.formData.date = "";
      this.formData.time = "";
    },

      },
});
export default AdminScreeningEdit;