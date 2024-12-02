import router from "../../router.js"

const AdminTheatreEdit = Vue.component("admin_theatre_edit", {
    template: `
    <div>
                <div v-for="theatre in theatres" :key="theatre.name">
    <hr style="border-color: black"/>
        <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue"> Edit Theatre Details </span></h1>
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
          <form @submit.prevent="submitForm">
        <br>
        <div>
          <label for="name">Title:</label>
          <input type="text" id="name" v-model="formData.name"/>
        </div>
        <br>
        <div>
          <label for="location">Location:</label>
          <input type="text" id="location" v-model="formData.location"/>
        </div>
        <br>
        <div>
          <label for="seating_capacity">Seating Capacity:</label>
          <input type="number" id="seating_capacity" v-model="formData.seating_capacity"/>
        </div>
        <br>
        <div>
          <label for="theatre_base_price">Price:</label>
          <input type="number" id="theatre_base_price" v-model="formData.theatre_base_price"/>
        </div>
        <br>
        <div>
          <label for="picture">Picture:</label>
          <input type="file" id="picture" @change="onPictureChange"/>
        </div>
        <br>
        <div>
          <button type="submit">Edit Details</button>
        </div>
      </form>
        </div>
        <div class="movie-card">
          <!-- This column will be left blank for now -->
          <p>Title: {{ theatre.name }}</p>
          <p>Location: {{ theatre.location }}</p>
          <p>Seating Capacity: {{ theatre.seating_capacity }}</p>
          <p>Theatre Price: {{ theatre.theatre_base_price}}</p>
          <p>&nbsp; Please only fill the details that you wish to change &nbsp;</p>
          <p>&nbsp;Note: Changes made to price will not affect existing bookings 
          and will only affect subsequent ones &nbsp;</p>
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
                        /*body: JSON.stringify({
                            "for": this.name,
                            "vistor_name": this.vistor_name,
                            "vistor_message": this.vistor_message
                        }),*/
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
        onPictureChange(event) {
          this.formData.picture = event.target.files[0];
        },
        async submitForm() {
          // Check for any blank inputs
          if (
            this.formData.name.trim() === "" &&
            this.formData.location.trim() === "" &&
            this.formData.seating_capacity.trim() === "" &&
            this.formData.theatre_base_price.trim() === "" &&
            !this.formData.picture
          ) {
            alert("Please fill at least one field before submitting.");
            return;
          }

          try {
            // Check for existing theatre with the same name
            if (this.formData.name) {
              const existingTheatreResponse = await fetch(`/api/check_theatre/${encodeURIComponent(this.formData.name)}`);
              const existingTheatreData = await existingTheatreResponse.json();
              if (existingTheatreData.exists) {
                alert("A theatre with that name already exists. Please choose a different name.");
                return;
              }
            }

            // Continue with form submission if the name is unique
            const theatreData = {
              name: this.formData.name,
              location: this.formData.location,
              seating_capacity: parseFloat(this.formData.seating_capacity),
              theatre_base_price: parseFloat(this.formData.theatre_base_price),
            };

            const response = await fetch(`/api/admin/theatre/${this.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json', // Set the Content-Type header to 'application/json'
                'Authentication-Token': sessionStorage.getItem('token')
              },
              body: JSON.stringify(theatreData), // Convert theatreData to JSON string and send it in the request body
            });

            if (response.ok) {
              alert("Theatre updated successfully!");
              this.fetchTheatre(this.id); // Fetch updated theatre details again
            } else {
              alert("Failed to update the theatre. Please try again later.");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your request.");
          }
        }

      },
});
export default AdminTheatreEdit;