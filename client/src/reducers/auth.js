import { AUTH, LOGOUT } from "../constants/actionType";

const authReducer = (state = { authData: null }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }))

            return { ...state, authData: action?.data };
        case LOGOUT:
            localStorage.clear();

            return { ...state, authData: null };
        default:
            return state;
    }
}

export default authReducer;

// "You have created a new client application that uses libraries for user authentication or authorization
// that are deprecated. New clients must use the new libraries instead.
// See the [Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration)
//     for more information."