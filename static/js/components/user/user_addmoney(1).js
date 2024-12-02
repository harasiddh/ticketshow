import router from "../../router.js"

const UserAddMoney = Vue.component("user_add_money", {
     template: `
  <div class="admin-home">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Add Money</span></h1>
    <hr style="border-color: black"/>
    <br>
    <h3> Your Account Balance: {{ user.account_balance }} </h3>
    <br>
    <form @submit.prevent="addMoney" style="width: 300px; height:30px; margin: auto; text-align: center;">
      <label for="amount">Add Money:</label>
      <input type="number" id="amount" v-model.number="amount" min="1" step="1" style="width: 80px; margin: 0 10px;" />
      <button type="submit">Add</button>
    </form>
    <br>
    <br>
  </div>
    `,
    data() {
    return {
      movies: [], // Initialize movies as an empty array
      theatres: [], // Initialize theatres as an empty array
      user: {},
      amount: 0,
    };
  },
  mounted() {
    let user_email = sessionStorage.getItem('email');
    this.fetchMovies(); // Fetch movies when the component is loaded
    this.fetchTheatres();
    this.fetchUser(user_email);
  },
  methods: {
    async fetchMovies() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch("/api/get_movies", {
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
    async fetchTheatres() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
        const response = await fetch("/api/get_theatres", {
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
    async fetchUser(user_email) {
      try {
        const response = await fetch(`/api/user/${user_email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem('token')
                    },
                });
        const data = await response.json();
        this.user = data; // Update the 'movies' array with the fetched data
      } catch (error) {
        console.error("Error fetching user_details:", error);
      }
    },
    addMoney() {
      try {
        const userData = {
          amount: this.amount,
        };

        const response = fetch(`/api/user/${sessionStorage.getItem('email')}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
          body: JSON.stringify(userData), // Send data as JSON
        }).then(response => {
        if (response.ok) {
          alert("Amount Successfully Added! You will be redirected to Home Page");
          this.resetForm();
          this.fetchUser(sessionStorage.getItem('email'))
          router.push("/user/home");
        } else {
          alert("Failed to add amount. Please try again later.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing your request.");
  }
},
  resetForm() {
      this.amount = 0;
    },
  },
})
export default UserAddMoney;