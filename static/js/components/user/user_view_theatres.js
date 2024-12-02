import router from "../../router.js"

let UserViewTheatres = Vue.component("user_view_theatres", {
    template: `
    <div class="admin-home">
    <hr style="border-color: black" />
    <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Theatres</span></h1>
    <hr style="border-color: black" />
    <br>
    <!-- Add the genre filter select dropdown -->
    <div style="text-align: center">
      <label for="locationSelect">Filter by Location:</label>
      <select v-model="selectedLocation" @change="filterTheatres" id="locationSelect">
        <option value="">All Locations</option>
        <option v-for="location in locations" :key="location">{{ location }}</option>
      </select>
    </div>
    <br>
    <div v-if="filteredTheatres.length > 0" class="image-grid" style="text-align: center">
        <div v-for="theatre in filteredTheatres" :key="theatre.id" class="image-item">
          &nbsp;<router-link :to="'/user/theatre/' + theatre.id">
            <img :src="theatre.picture" alt="Theatre Picture" />
          </router-link>&nbsp;
        </div>
      </div>
      <div v-else>
        <p>No theaters</p>
      </div>
      <br>
    </div>

    `,
    data() {
    return {
      theatres: [], // Initialize movies as an empty array
      locations: [], // Initialize genres as an empty array
      selectedLocation: '', // Store the selected genre for filtering
    };
  },
  mounted() {
    this.fetchTheatres(); // Fetch movies when the component is loaded
  },
  methods: {
    async fetchTheatres() {
      try {
        const response = await fetch("/api/get_theatres", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token'),
          },
        });
        const data = await response.json();
        this.theatres = data; // Update the 'movies' array with the fetched data
        this.updateLocations(); // Update the list of available genres
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    },
    updateLocations() {
      // Extract all unique genres from the movies data and update 'genres' array
      const allLocations = this.theatres.flatMap(theatre => theatre.location.split(', '));
      this.locations = Array.from(new Set(allLocations));
    },
  },
    computed: {
    filteredTheatres() {
      if (this.selectedLocation === '') {
        return this.theatres;
      } else {
        // If a genre is selected, filter movies based on the selected genre
        return this.theatres.filter(theatre => {
          const locations = theatre.location.split(', ').map(location => location.trim().toLowerCase());
          return locations.includes(this.selectedLocation.toLowerCase());
        });
      }
    },
  },
})


export default UserViewTheatres;