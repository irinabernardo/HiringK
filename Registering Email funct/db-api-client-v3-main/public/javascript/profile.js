
// The set HTTP headers. These will be used by Fetch when making requests to the api

function getHeaders() {
    // Return headers
    // Note that the access token is set in the Authorization: Bearer

    return new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getAccessToken()
    });
  }
  
  // Requests will use the GET method and permit cross origin requests
  const GET_INIT = { method: 'GET', credentials: 'include', headers: getHeaders(), mode: 'cors', cache: 'default' };
  
  // API Base URL - the server address
  const BASE_URL = 'http://localhost:8080';
  
  
  
  
  // Asynchronous Function getDataAsync from a url and return
  async function getDataAsync(url) {
      // Try catch 
      try {
        // Call fetch and await the respose
        // Initally returns a promise
        const response = await fetch(url, GET_INIT);
    
        // As Resonse is dependant on fetch, await must also be used here
        const json = await response.json();
    
        // Output result to console (for testing purposes) 
        //console.log(json);
    
        // Call function( passing he json result) to display data in HTML page
        //displayData(json);
        return json;
    
        // catch and log any errors
      } catch (err) {
        console.log(err);
        return err;
      }
    }
// Client url
const clientUrl = "http://localhost:3000";

// check login status
function checkStatus () {
  // Get access tokem from browser sessionStorage
  const accessToken = sessionStorage.getItem('accessToken');
  // Check if expired
  const expirationDate = new Date(Number.parseInt(sessionStorage.getItem('expirationDate')));
  const isExpired = expirationDate < new Date();
  let status;

  // Log details to console
  if (!accessToken) {
    status = 'There is no access token present in local storage, meaning that you are not logged in.';
  } else if (isExpired) {
    status = 'There is an expired access token in local storage.';
  } else {
    status = `There is an access token in local storage, and it expires on ${expirationDate}.`;
  }
  console.log(status);

  // If logged in
  // Use jQuery to hide login then show logout and profile
  if (accessToken && !isExpired) {
    $('#login').hide();
    $('#logout').show();
    $('#get-profile').show();
    $('#AddJobButton').show();
  
    
    
  // else - not logged in
  // Use jQuery to hide logout and profile then show login
  } else {
    $('#get-profile').hide();
    $('#logout').hide();
    $('#AddJobButton').hide();
    $('#login').show();
  
  }
}
// Get access token (from session storage, etc.)
function getAccessToken() {
  return sessionStorage.getItem('accessToken');
}

// Save the token to session storage 
function saveAuthResult (result) {
  sessionStorage.setItem('accessToken', result.accessToken);
  sessionStorage.setItem('idToken', result.idToken);
  sessionStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000);
  // Refresh the page
  checkStatus();
  console.log(result.accessToken)
}

// Check token validity
function checkSession () {
  auth0WebAuth.checkSession({
    responseType: 'token id_token',
    timeout: 5000,
    usePostMessage: true
  }, function (err, result) {
    if (err) {
      console.log(`Could not get a new token using silent authentication (${err.error}).`);
      $('#get-profile').hide();
      $('#logout').hide();
      $('#login').show();
    } else {
      saveAuthResult(result);
    }
  });
}
// Login event handler
// Call Auth0 to handle login (then return here)
document.querySelector("#login").addEventListener("click", function(event) {
  // Prevent form submission (if used in a form)
  event.preventDefault();
  // Call the Auth0 authorize function
  // auth0WebAuth is defined in auth0-variables.js
  auth0WebAuth.authorize({ returnTo: clientUrl });
  console.log("Logged in");
}, false);

// Logout
// Call Auth0 to handle logout (then return here)
document.querySelector("#logout").addEventListener("click", function(event) {
  event.preventDefault();
  // remove tokens from session storage
  sessionStorage.clear();
  auth0WebAuth.logout({ returnTo: clientUrl });
  console.log("Logged out");
}, false);
/*
// get user profile from Auth0 
document.querySelector("#get-profile").addEventListener("click", async function() {
  auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
    if (err) {
          // handle error
      console.error('Failed to get userInfo');
      return;
    }
    // Output result to console (for testing purposes) 
    console.log(usrInfo);
    //console.log(JSON.stringify(usrInfo));
    console.log(usrInfo.email);

    document.getElementById('results').innerHTML = `<pre>${JSON.stringify(usrInfo, null, 2)}</pre>`;
  });
}, false);


// use jwt-decode to check if jwt contains a permission for the user
// return true or false
function checkAuth(permission) {
  // read the JWT
  const jwt = getAccessToken();
  // check permissions (if a jwt was returned)
  if (jwt != null) {
    const decoded = jwt_decode(jwt);
    return decoded.permissions.includes(permission);
  } else {
    return false;
  }
}
*/

// When page is loaded
window.onload = (event) => {
    // execute this code
    auth0WebAuth.parseHash(function (_err, result) {
      if (result) {
        saveAuthResult(result);
      }
    });
  // check login status after page loads.
  checkStatus();

};

  //FUNCTION TO GET user info from AUTH0 
async function pGetInfo() {

    return await new Promise((resolve,reject) => {
     
      auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
        
        resolve(usrInfo);          
        });
     }  )
  }

async function loadProf() {
    
const profObj = await pGetInfo();
console.log(profObj.email);
document.getElementById('pemail').innerHTML = profObj.email
    document.getElementById('pname').innerHTML = profObj.name;
    document.getElementById('ppic').innerHTML = profObj.picture;
console.log('fim profile sc')
};

loadProf();
