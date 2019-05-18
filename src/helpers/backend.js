import axios from 'axios';
import { BASE_URL, URL } from '../SERVER/Config';
import { API } from '../SERVER/API';

//Updated: 2019-05-18
//I hope that some day, i can understand what i code

export function configureFakeBackend() {
    //let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];//{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }
    let users=[];
    let user={username:'',password:''};
    let realFetch = window.fetch;

    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {            
            //console.log('let params = JSON.parse(opts.body): ', opts.body);
            //let params = JSON.parse(opts.body);

            //console.log('opts.headers.Authorization : ',opts.headers.Authorization );  underfied
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                
                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {                     
                    let params = JSON.parse(opts.body);
                    //console.log('opts.body: ',params);
                        fetch(BASE_URL+URL, 
                                {
                                    method: 'POST',
                                    headers: new Headers({
                                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // <-- Specifying the Content-Type
                                    })
                                    ,
                                    body: `tag=${API.CUSTOMER_LOGIN}&jdata=${JSON.stringify({
                                    'username':params.username,
                                    'password':params.password
                                    })}` // <-- Post parameters
                                }
                            )
                            .then(response => response.json())
                            .then(response => {   
                                // console.log('response1: ',response);
                                if(response.status==='OK'){
                                    user={username:params.username,password:params.password};//xác nhận là đã đúng account
                                    users=response.data["0"]; 
                                    //console.log('data: ',users ); return;
                                    resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users)) });
                                }                             
                                else{
                                    reject('Tài khoản không tồn tại !');
                                }                                
                            })
                            .catch((error) => {
                                console.error(error); 
                                reject('Please contact to HOB supporter. \nError: ',error);
                            });                    
                    return;
                }
                // console.log('user 1 : ',user); return;
                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security 
                    // is implemented server side in a real application
                    // let params ;//= JSON.parse(opts.body);
                    // console.log('user end: ',user); return;
                    if (opts.headers && opts.headers.Authorization === `Basic ${window.btoa(`${user.username}:${user.password}`)}`) {
                        //console.log('opts.headers.Authorization : ',opts.headers.Authorization ); //return;
                        //console.log('Users before return: ',users);  failed
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users)) });
                    } else {
                        // return 401 not authorised if token is null or invalid
                        resolve({ status: 401, text: () => Promise.resolve() });
                    }
                    return;
                }
                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));
            }, 500);
        });
    }
}