import router from "../../router.js"


const AdminScreeningDelete = Vue.component("admin_screening_delete", {
    template: `
    <div>
    <div v-for="screening in screenings" :key="screening.id">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Delete Screening </span></h1>
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
          <p>&nbsp; If you choose to delete this screening, your action cannot be undone. Customers will be refunded &nbsp;</p>
          <p>&nbsp;Note: Deleting screening does not delete the movie or theatre. &nbsp;</p>
          <h4> Are you sure you wish to delete this screening? </h4>
          <br>
          <button @click="deleteScreening" style="background-color: darkred;
            color: white;
            padding: 10px;
            width: 100%;
            border: none;
            border-radius: 5px;
            cursor: pointer;">Yes, Delete Screening</button>
          <br>
          <br>
            <router-link :to="'/admin/screening/' + screening.id">
                <button>No, Back to Screening Details Page</button>
            </router-link>
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
        async deleteScreening() {
              try {
                const response = await fetch(`/api/admin/screening/${this.id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': sessionStorage.getItem('token')
                  },
                });

                if (response.ok) {
                  alert("Screening deleted successfully! You will be redirected to the home page.");
                  router.push("/admin/home");
                } else {
                  alert("Failed to delete the screening. Please try again later.");
                }
              } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while processing your request.");
              }
            }

      },
});

export default AdminScreeningDelete;