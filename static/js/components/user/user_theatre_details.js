import router from "../../router.js"

let UserTheatreDetails = Vue.component("user_theatre_details", {
    template: `
  <div v-for="theatre in theatres" :key="theatre.name">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> {{theatre.name}} </span></h1>
    <hr style="border-color: black"/>
    <br>
      <div class="movie-columns">
        <div class="movie-card">
          <router-link :to="'/user/theatre/' + theatre.id">
            <img :src="theatre.picture" class="picture">
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
          <p>Location: {{ theatre.location }}</p>
          <p>Seating Capacity: {{ theatre.seating_capacity }}</p>
        </div>
        <div class="movie-card">
          <p> List of Screenings </p>
          <div v-for="screening in screenings" :key="screening.id"> 
          <p> 
          <router-link :to="'/user/screening/' + screening.id">
            {{ screening.movie_title }}, {{ screening.date }}, {{screening.time}}
          </router-link>
          </p>
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
      theatres: [], // Initialize theatres as an empty array
      screenings: [],
    };
  },
  mounted() {
    let theatre_id = this.id;
    this.fetchTheatre(theatre_id); // Fetch theatres when the component is loaded
    this.fetchScreenings(theatre_id);
  },
  methods: {
    async fetchTheatre(theatre_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/theatre/${theatre_id}`, {
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
    async fetchScreenings(theatre_id) {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch(`/api/get_screenings/theatre/${theatre_id}`, {
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

export default UserTheatreDetails;