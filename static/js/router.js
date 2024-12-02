import GeneralHome from "./components/general/general_home.js";
import GeneralError401 from "./components/general/general_error_401.js";
import GeneralError403 from "./components/general/general_error_403.js";
import GeneralError404 from "./components/general/general_error_404.js";
import GeneralError500 from "./components/general/general_error_500.js";
import GeneralErrorUnknown from "./components/general/general_error_unknown.js";
import NotFound from "./components/general/not_found.js"


import AdminHome from "./components/admin/admin_home.js";

import AdminBookingHistory from "./components/admin/admin_booking_history.js";


import AdminTheatreCreate from "./components/admin/admin_theatre_create.js";
import AdminTheatreEdit from "./components/admin/admin_theatre_edit.js";
import AdminTheatreDelete from "./components/admin/admin_theatre_delete.js";
import AdminTheatreDetails from "./components/admin/admin_theatre_details.js"

import AdminMovieCreate from "./components/admin/admin_movie_create.js";
import AdminMovieEdit from "./components/admin/admin_movie_edit.js";
import AdminMovieDelete from "./components/admin/admin_movie_delete.js";
import AdminMovieDetails from "./components/admin/admin_movie_details.js"

import AdminScreeningCreate from "./components/admin/admin_screening_create.js";
import AdminScreeningDetails from "./components/admin/admin_screening_details.js";
import AdminScreeningDelete from "./components/admin/admin_screening_delete.js";
import AdminScreeningEdit from "./components/admin/admin_screening_edit.js";


import UserHome from "./components/user/user_home.js";
import UserViewMovies from "./components/user/user_view_movies.js";
import UserViewTheatres from "./components/user/user_view_theatres.js";
import UserViewScreenings from "./components/user/user_view_screenings.js";


import UserAddMoney from "./components/user/user_addmoney.js";

import UserTheatreDetails from "./components/user/user_theatre_details.js";
import UserMovieDetails from "./components/user/user_movie_details.js";
import UserScreeningDetails from "./components/user/user_screening_details.js";
import UserBookingDetails from "./components/user/user_booking_details.js";
import UserBookingCreate from "./components/user/user_booking_create.js";
import UserBookingHistory from "./components/user/user_booking_history.js";
import UserBookingCancel from "./components/user/user_booking_cancel.js";





const routes = [
    {
        path: "/",
        component: GeneralHome,
    },
    {
        path: "/Error/401",
        component: GeneralError401,
    },
    {
        path: "/Error/403",
        component: GeneralError403,
    },
    {
        path: "/Error/404",
        component: GeneralError404,
    },
    {
        path: "/Error/500",
        component: GeneralError500,
    },
    {
        path: "/Error/Unknown",
        component: GeneralErrorUnknown,
    },
    {
        path: "/admin/home",
        component: AdminHome,
    },
    {
        path: "/admin/booking_history",
        component: AdminBookingHistory,
    },
    {
        path: "/admin/theatre/create",
        component: AdminTheatreCreate,
        props: true,
    },
    {
        path: "/admin/theatre/:theatre_id/edit",
        component: AdminTheatreEdit,
        props: (route) => {
          const id = Number.parseInt(route.params.theatre_id);
          return { id }
        }
    },
    {
        path: "/admin/theatre/:theatre_id/delete",
        component: AdminTheatreDelete,
        props: (route) => {
          const id = Number.parseInt(route.params.theatre_id);
          return { id }
        }
    },
    {
        path: "/admin/theatre/:theatre_id",
        component: AdminTheatreDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.theatre_id);
          return { id }
        }
    },
    {
        path: "/admin/movie/create",
        component: AdminMovieCreate,
        props: true,
    },
    {
        path: "/admin/movie/:movie_id/edit",
        component: AdminMovieEdit,
        props: (route) => {
          const id = Number.parseInt(route.params.movie_id);
          return { id }
        }
    },
    {
        path: "/admin/movie/:movie_id/delete",
        component: AdminMovieDelete,
        props: (route) => {
          const id = Number.parseInt(route.params.movie_id);
          return { id }
        }
    },
    {
        path: "/admin/movie/:movie_id",
        component: AdminMovieDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.movie_id);
          return { id }
        }
    },
    {
        path: "/admin/screening/create",
        component: AdminScreeningCreate,
        props: true,
    },
    {
        path: "/admin/screening/:screening_id/edit",
        component: AdminScreeningEdit,
        props: (route) => {
          const id = Number.parseInt(route.params.screening_id);
          return { id }
        }
    },
    {
        path: "/admin/screening/:screening_id/delete",
        component: AdminScreeningDelete,
        props: (route) => {
          const id = Number.parseInt(route.params.screening_id);
          return { id }
        }
    },
    {
        path: "/admin/screening/:screening_id",
        component: AdminScreeningDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.screening_id);
          return { id }
        }
    },
    {
        path: "/user/home",
        component: UserHome,
    },
    {
        path: "/user/movie/:movie_id",
        component: UserMovieDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.movie_id);
          return { id }
        }
    },
    {
        path: "/user/theatre/:theatre_id",
        component: UserTheatreDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.theatre_id);
          return { id }
        }
    },
    {
        path: "/user/screening/:screening_id",
        component: UserScreeningDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.screening_id);
          return { id }
        }
    },
    {
        path: "/user/screening/:screening_id/book_tickets",
        component: UserBookingCreate,
        props: (route) => {
          const id = Number.parseInt(route.params.screening_id);
          return { id }
        }
    },
    {
        path: "/user/booking_history",
        component: UserBookingHistory,
    },
    {
        path: "/user/view_movies",
        component: UserViewMovies,
    },
    {
        path: "/user/view_theatres",
        component: UserViewTheatres,
    },
    {
        path: "/user/view_screenings",
        component: UserViewScreenings,
    },
    {
        path: "/user/booking/:booking_id",
        component: UserBookingDetails,
        props: (route) => {
          const id = Number.parseInt(route.params.booking_id);
          return { id }
        }
    },
    {
        path: "/user/booking/:booking_id/cancel",
        component: UserBookingCancel,
        props: (route) => {
          const id = Number.parseInt(route.params.booking_id);
          return { id }
        }
    },
    {
        path: "/user/add_money",
        component: UserAddMoney,
    },
    { 
        path: "/:catchAll(.*)", 
        component: NotFound, 
    },
]

const router = new VueRouter({
    routes
})

export default router;