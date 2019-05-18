export function authHeader() {
    // return authorization header with basic auth credentials
    let user = JSON.parse(localStorage.getItem('user'));

    console.log('user: ',user);
    console.log('user.authdata: ',user.authdata);
    console.log('user && user.authdata: ', user && user.authdata);
    if (user && user.authdata) {
        return { 'Authorization': 'Basic ' + user.authdata };
    } else {
        return {};
    }
}