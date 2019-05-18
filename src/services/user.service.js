import config from 'config';
import { authHeader } from '../helpers';

export const userService = {
    login,
    logout,
    getAll
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };   

    return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            console.log('user: ',user);
            if (user) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
}



function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    // console.log('Cục Response: \n');
    // console.log(response);

    return response.text().then(text => {
        // console.log('response.text().then(... : \n');
        // console.log(text);
        // console.log(JSON.parse(text));

        const data = text && JSON.parse(text);
        // console.log('text && JSON.parse(text) \n');
        // console.log(data);
        
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            // console.log('data && data.message: \n');
            // console.log(data && data.message);
            const error = (data && data.message) || response.statusText;            
            
            return Promise.reject(error);
        }
        // console.log('Data trả về: \n');
        // console.log(data);
        return data;
    });
}