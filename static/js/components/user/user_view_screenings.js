import router from "../../router.js"

let UserViewScreenings = Vue.component("user_view_screenings", {
    template: `
  <div class="admin-home">
    <hr style="border-color: black" />
    <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Screenings</span></h1>
    <hr style="border-color: black" />
    <br>
    <!-- Add the date filter select dropdown -->
    <div style="text-align: center">
      <label for="dateSelect">Filter by Date:</label>
      <select v-model="selectedDate" @change="filterScreenings" id="dateSelect">
        <option value="">All Dates</option>
        <option v-for="date in dates" :key="date">{{ date }}</option>
      </select>
    </div>
    <br>
    <div v-if="filteredScreenings.length > 0" class="image-grid" style="text-align: center">
        <div v-for="screening in filteredScreenings" :key="screening.id" class="image-item">
          &nbsp;<div class="booking-box"><router-link :to="'/user/screening/' + screening.id">
            <p>Theatre: {{ screening.theatre_name }} </p>
            <p>Movie: {{ screening.movie_title }} </p>
            <p>Date: {{ screening.date }} </p>
            <p>Time: {{ screening.time }}</p>
            <p>Ticket Price: Rs.{{ screening.ticket_price }}</p>
          </router-link></div>&nbsp;
        </div>
      </div>
      <div v-else>
        <p>No screenings</p>
      </div>
      <br>
    </div>
    `,
    data() {
    return {
      screenings: [], // Initialize movies as an empty array
      dates: [], // Initialize genres as an empty array
      selectedDate: '', // Store the selected genre for filtering
    };
  },
  mounted() {
    this.fetchScreenings(); // Fetch movies when the component is loaded
  },
  methods: {
    async fetchScreenings() {
      try {
        const response = await fetch("/api/get_screenings", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token'),
          },
        });
        const data = await response.json();
        this.screenings = data; // Update the 'movies' array with the fetched data
        this.updateDates(); // Update the list of available genres
      } catch (error) {
        console.error("Error fetching screenings:", error);
      }
    },
    updateDates() {
      // Extract all unique genres from the movies data and update 'genres' array
      const allDates = this.screenings.flatMap(screening => screening.date.split(', '));
      this.dates = Array.from(new Set(allDates));
    },
  },
    computed: {
    filteredScreenings() {
      // Use a computed property for filteredMovies
      if (this.selectedDate === '') {
        return this.screenings; // If no genre is selected, return all movies
      } else {
        // If a genre is selected, filter movies based on the selected genre
        return this.screenings.filter(screening => {
          const dates = screening.date.split(', ').map(date => date.trim().toLowerCase());
          return dates.includes(this.selectedDate.toLowerCase());
        });
      }
    },
  },
})

export default UserViewScreenings;