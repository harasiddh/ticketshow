import router from "../../router.js"

const AdminTheatreCreate = Vue.component("admin_theatre_create", {
    template: `
        <div class="admin-theatre-create">
        <hr style="border-color: black"/>
            <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Create Theatre</span></h1>
        <hr style="border-color: black"/>
        <br>
      <form @submit.prevent="submitForm">
        <br>
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="formData.name" required />
        </div>
        <br>
        <div>
          <label for="location">Location:</label>
          <input type="text" id="location" v-model="formData.location" required />
        </div>
        <br>
        <div>
          <label for="seating_capacity">Seating Capacity:</label>
          <input type="number" id="seating_capacity" v-model="formData.seating_capacity" required />
        </div>
        <br>
        <div>
          <label for="theatre_base_price">Base Price:</label>
          <input type="number" id="theatre_base_price" v-model="formData.theatre_base_price" required />
        </div>
        <br>
        <div>
          <label for="picture">Picture:</label>
          <input type="file" id="picture" @change="onPictureChange" required />
        </div>
        <br>
        <div>
          <button type="submit">Add Theatre</button>
        </div>
      </form>
    </div>
  `,
  data() {
    return {
      theatres: [],
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
    this.fetchTheatres();
  },
  methods: {
    onPictureChange(event) {
      this.formData.picture = event.target.files[0];
    },
    async fetchTheatres() {
      try {
        // Make an asynchronous call to the '/get_movies' endpoint
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
            console.error("Error fetching movies:", error);
          }
    },
    async submitForm() {
      // Check for any blank inputs
      if (
        this.formData.name.trim() === "" ||
        this.formData.location.trim() === "" ||
        this.formData.seating_capacity.trim() === "" ||
        this.formData.theatre_base_price.trim() === "" ||
        !this.formData.picture
      ) {
        alert("Please fill in all the fields before submitting.");
        return;
      }

      try {
        // Check for existing theatre with the same name
        const existingTheatreResponse = await fetch(`/api/check_theatre/${encodeURIComponent(this.formData.name)}`);
        const existingTheatreData = await existingTheatreResponse.json();
        if (existingTheatreData.exists) {
          alert("A theatre with that name already exists. Please choose a different name.");
          return;
        }

        // Continue with form submission if the name is unique
        const theatreData = {
          name: this.formData.name,
          location: this.formData.location,
          seating_capacity: parseFloat(this.formData.seating_capacity),
          theatre_base_price: parseFloat(this.formData.theatre_base_price),
        };

        const formData = new FormData();
        formData.append("theatreData", JSON.stringify(theatreData)); // Convert theatreData to JSON string and append as a field
        formData.append("picture", this.formData.picture); // Append the picture file
        console.log(formData)

        const response = await fetch("/api/admin/theatre/create", {
          method: 'POST',
          headers: {
            //'Content-Type': 'application/json',
            'Authentication-Token': sessionStorage.getItem('token')
          },
          body: formData,
        });

        if (response.ok) {
          alert("Theatre added successfully!");
          this.resetForm();
        } else {
          alert("Failed to add the theatre. Please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      }
    },
    resetForm() {
      this.formData.name = "";
      this.formData.location = "";
      this.formData.seating_capacity = "";
      this.formData.theatre_base_price = "";
      this.formData.picture = null;
    },
  },
});

export default AdminTheatreCreate;

