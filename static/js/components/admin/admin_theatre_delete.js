import router from "../../router.js"


const AdminTheatreDelete = Vue.component("admin_theatre_delete", {
    template: `
    <div>
                <div v-for="theatre in theatres" :key="theatre.name">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Delete {{ theatre.name }} </span></h1>
    <hr style="border-color: black"/>
    <br>
      <div class="movie-columns">
        <div class="movie-card">
          <router-link :to="'/admin/theatre/' + theatre.id">
            <img :src="theatre.picture" class="picture">
          </router-link>
          <br>
        </div>
        <div class="movie-card">
          <p>&nbsp; If you choose to delete the theatre, your action cannot be undone &nbsp;</p>
         <p>&nbsp;Note: Deleting theatre will also delete existing shows scheduled 
          and customers will be refunded. You can choose to delete specific screenings instead. &nbsp;</p>
          <h4> Are you sure you wish to delete this theatre? </h4>
          <br>
          <button @click="deleteTheatre" style="background-color: darkred;
            color: white;
            padding: 10px;
            width: 100%;
            border: none;
            border-radius: 5px;
            cursor: pointer;">Yes, Delete Theatre</button>
          <br>
          <br>
            <router-link :to="'/admin/theatre/' + theatre.id">
                <button>No, Back to Theatre Details Page</button>
            </router-link>
        </div>
        <div class="movie-card">
          <!-- This column will be left blank for now -->
          <p>Name: {{ theatre.name }}</p>
          <p>Location: {{ theatre.location }}</p>
          <p>Seating Capacity: {{ theatre.seating_capacity }}</p>
          <p>Theatre Price: {{ theatre.theatre_base_price}}</p>
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
          formData: {
            name: "",
            location: "",
            seating_capacity: "",
            theatre_base_price: "",
            picture: null,
          },
        };
      },
    mounted() {
    let theatre_id = this.id;
    this.fetchTheatre(theatre_id); // Fetch theatres when the component is loaded
    },
      methods: {
        async fetchTheatre(theatre_id) {
          try {
            // Make an asynchronous call to the '/get_theatres' endpoint
            const response = await fetch(`/api/admin/theatre/${theatre_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': sessionStorage.getItem('token')
                        },
                    });
            if (response.ok) {
              const data = await response.json();
              this.theatres = data; // Update the 'theatres' array with the fetched data
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
        onPosterChange(event) {
          this.formData.picture = event.target.files[0];
        },
        async deleteTheatre() {
              try {
                const response = await fetch(`/api/admin/theatre/${this.id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': sessionStorage.getItem('token')
                  },
                });

                if (response.ok) {
                  alert("Theatre deleted successfully! You will be redirected to the home page.");
                  router.push("/admin/home");
                } else {
                  alert("Failed to delete the theatre. Please try again later.");
                }
              } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while processing your request.");
              }
            }

      },
});

export default AdminTheatreDelete;