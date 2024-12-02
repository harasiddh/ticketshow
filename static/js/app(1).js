import router from "./router.js"

const a = new Vue({
    el: "#app",
    router: router,
    // delimiters: ['${', '}$'],
    data : {

    },
    methods: {
    logout() {
      // Perform a server-side logout by making a fetch call to your logout endpoint
      fetch("/logout", {
        method: "POST", // Or "GET" depending on your server implementation
        // Add headers or authentication tokens if required
      })
        .then(response => {
          if (response.ok) {
            // Clear session storage, cookies, and local storage
            this.clearData();

            // Redirect the user to the logout page (replace "logout.html" with your actual logout page URL)
            window.location.replace("/");
          } else {
            console.error("Logout failed. Server returned status:", response.status);
            // Handle error scenario if required
          }
        })
        .catch(error => {
          console.error("Logout failed:", error);
          // Handle error scenario if required
        });
    },
    clearData() {
      // Clear session storage
      sessionStorage.clear();

      // Clear cookies (by setting their expiration to the past)
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [name, _] = cookie.split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      // Clear local storage
      localStorage.clear();
    },
  },
    mounted: {
        
    }
})