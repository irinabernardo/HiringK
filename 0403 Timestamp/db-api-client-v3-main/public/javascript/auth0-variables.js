// Declare consts for Auth0 details reqired in this app
const CREATE_JOB = "create:jobs";
const READ_JOB = "read:jobs";
const UPDATE_JOB = "update:jobs";
const DELETE_JOB = "delete:jobs";

// The Auth0 id for this app
const AUTH0_CLIENT_ID = 'wEUDSHFVFA1rseRduRHOJs0O4s8BWdhB';

// Your Auth0 domain aka account/ tenant
const AUTH0_DOMAIN = 'dev-vxkwz45d.eu.auth0.com';

// Users of this app require access to the API, identified by...
// This value is the 'Identifier' in your API settings 
const AUDIENCE = 'https://hiringkapi.com';

// Where Auth0 should return the token to after authentication
const AUTH0_CALLBACK_URL = 'http://localhost:3000';

// Initialise Auth0 connection with parameters defined above
const auth0WebAuth = new auth0.WebAuth({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: AUTH0_CALLBACK_URL,
  responseType: 'id_token token',
  audience: AUDIENCE
});

const auth0Authentication = new auth0.Authentication(auth0WebAuth, {
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID
});
