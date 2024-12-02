let GeneralHome = Vue.component("general_home", {
    template: `

  <div>

    <hr style="border-color: black"/>
          <h1 style="text-align: center;">ticketshow - <span style="color: midnightblue">Welcome</span></h1>
      <hr style="border-color: black"/>

    <h3> What our users have to say? </h3>

    <div>
      Jack:
⭐⭐⭐⭐⭐
"This ticket booking website is a lifesaver! 
<br>
John:
⭐⭐⭐⭐
"The website is great for finding last-minute tickets." 
<br>
Matt:
⭐⭐⭐
"Decent website, but the user interface could use some improvement." 
<br>
Sarah:
⭐⭐⭐⭐⭐
"Wow, just wow! This website always has the best selection of tickets." 
<br>
Emily:
⭐⭐⭐⭐
"The tickets were reasonably priced, and the confirmation email came in quickly." 
<br>
Chris:
⭐⭐⭐⭐
"Solid platform for movie enthusiasts." 
<br>
Anna:
⭐⭐⭐⭐⭐
"My partner and I love this website for booking tickets"
<br>
Mary:
⭐⭐⭐⭐
"The ticket prices are reasonable, and I love that they often offer exclusive deals."
<br>
Tony:
⭐⭐⭐⭐⭐
"I've been using this ticket booking website for years. The process is smooth. Highly recommended!"
    </div>

  </div>


    `,
    /*
    data() {
    return {
      movies: [], // Initialize movies as an empty array
    };
  },
  mounted() {
    this.fetchMovies(); // Fetch movies when the component is loaded
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
                    },*/
                    /*body: JSON.stringify({
                        "for": this.title,
                        "vistor_name": this.vistor_name,
                        "vistor_message": this.vistor_message
                    }),*/
                /*});
        const data = await response.json();
        this.movies = data; // Update the 'movies' array with the fetched data
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    },
  },
  */
})

export default GeneralHome;