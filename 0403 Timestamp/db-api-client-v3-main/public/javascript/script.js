
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

  
// Parse JSON
// Create job rows
// Display in web page

        
function displayJobs(jobs) {
    // Use the Array map method to iterate through the array of jobs (in json format)
    // Each jobs will be formated as HTML table rowsand added to the array
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Finally the output array is inserted as the content into the <tbody id="jobRows"> element.

    if (jobs != null) {
      const rows = jobs.map(job => {
             // check user permissions
      const showUpdate = checkAuth(UPDATE_JOB);
      const showDelete = checkAuth(DELETE_JOB);
      
      // Show add job button
      if (checkAuth(CREATE_JOB))
      $('#AddJobButton').show(),
      $('#edit').show(),
      $('#del').show();
      else
      $('#AddJobButton').hide(),
      $('#edit').hide(),
      $('#del').hide();
      
        // returns a template string for each job, values are inserted using ${ }
        // <tr> is a table row and <td> a table division represents a column


          let row = `<tr>
                  <td>${job.JobId}</td>
                  <td>${job.JobName}</td>
                  <td>${job.JobDescription}</td>
                  <td>${(new Date(job.Start_Date)).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'numeric', year: 'numeric'
                  })}</td>
                  <td> ${(new Date(job.Finish_Date)).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'numeric', year: 'numeric'
                  })}</td>
                  <td> ${(new Date(job.Lastupdate)).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'numeric', year: 'numeric'
                  })}</td>`
                
                  //if user has permission to update
                  if (showUpdate)
                  row += `<td>
                    <button  class="btn btn-xs" data-toggle="modal" data-target="#JobFormDialog" 
                    onclick="prepareJobUpdate(${job.JobId})">
                    <span class="oi oi-pencil" data-toggle="tooltip" title="Edit Job"></span></button>
                  </td>`
                  //if user has permission to delete
                  if (showDelete)
                  row += `<td >
                    <button  class="btn btn-xs" onclick="deleteJob(${job.JobId})">
                    <span  class="oi oi-trash" data-toggle="tooltip" title="Delete Job" id="delbtn"></span></button>
                  </td>`          
                  //end of the row with return
                  row += `</tr>`;
                  return row;       
      });
      // Set the innerHTML of the jobRows root element = rows
      // Why use join('') ???
      document.getElementById('jobRows').innerHTML = rows.join('');

    } else {
      document.getElementById('jobRows').innerHTML = `<tr><td>No Jobs to display</td></tr>`;
    }

} // end function


// load and display categories in thhe left menu
function displayCategories(categories) {
  //console.log(categories);

  // Cat menu

  // use Array.map() to iterate through the list of categories
  // Returns an HTML link for each category in the array
  const catLinks = categories.map(category => {
    // The link has an onclick handler which will call updateJobsView(id) pasing the category id as a parameter
    return `<a href="#" id="categoryBar" class="text-light text-center col-md-3 list-group-item-action" onclick="updateJobsView(${category.CategoryId})"><h5>${category.CategoryName}</h5></a>`;
  });

  // use  unshift to add a 'Show all' link at the start of the array of catLinks
  catLinks.unshift(`<a href="#" id="showAllbar" class="text-light text-center col-md-3 list-group-item-action" onclick="loadJobs()"><h5>Show all</h5></a>`);

  // Set the innerHTML of the jobRows element = the links contained in catlinks
  // .join('') converts an array to a string, replacing the , seperator with blank.
  document.getElementById('categoryList').innerHTML = catLinks.join('');

  // *** Fill select list in job form ***
  // first get the select input by its id
  let catSelect = document.getElementById("CategoryId");

  // clear options
  while (catSelect.firstChild)
    catSelect.removeChild(catSelect.firstChild);

  // Add an option for each category
  // iterate through categories adding each to the end of the options list
  // each option is made from categoryName, categoryId
  // Start with default option
  catSelect.add(new Option("Choose Category", "0"))
  for (i=0; i< categories.length; i++) {
    catSelect.add(new Option(categories[i].CategoryName, categories[i].CategoryId));
  }

} // end function


// Load Jobs
// Get all categories and jobs then display
async function loadJobs() {
  try {
    
    // Get a list of categories via the getDataAsync(url) function
    const categories = await getDataAsync(`${BASE_URL}/category`);
    // Call displaycategoriess(), passing the retrieved categories list
    displayCategories(categories);

    // Get a list of jobs
    const jobs = await getDataAsync(`${BASE_URL}/job`);
    // Call displayJobs(), passing the retrieved jobs list

      displayJobs(jobs);

  } // catch and log any errors
      catch (err) {
      console.log(err);
  }
}

// update jobs list when category is selected to show only jobs from that category
async function updateJobsView(id) {
  try {
    // call the API enpoint which retrieves jobs by category (id)
    const jobs = await getDataAsync(`${BASE_URL}/job/bycat/${id}`);
    // Display the list of jobs returned by the API

      displayJobs(jobs);

  } // catch and log any errors
  catch (err) {
    console.log(err);
  }
}


// Get form data and return as object for POST
// Uppercase first char to match DB
function getJobForm() {

  // Get form fields
  const pId = document.getElementById('JobId').value;
  const catId = document.getElementById('CategoryId').value;
 
  const pName = document.getElementById('JobName').value;
  const pDesc = document.getElementById('JobDescription').value;
  const pStart_Date = new Date(document.getElementById('Start_Date').value);
  const pFinish_Date = new Date(document.getElementById('Finish_Date').value)
  const pUserEmail = 'nina';
  const pLastupdate = new Date();
  // build Job object for Insert or Update
  // required for sending to the API
  const jobObj = {
    JobId: pId,
    CategoryId: catId,
    JobName: pName,
    JobDescription: pDesc,
    Start_Date: pStart_Date,
    Finish_Date: pFinish_Date,
    UserEmail: pUserEmail,
    Lastupdate: pLastupdate,
  }

  // return the body data
  return jobObj;
}

// Setup job form (for inserting or updating)
function jobFormSetup(title) {
  // Set form title
  document.getElementById("jobFormTitle").innerHTML = title;

  // reset the form and change the title
  document.getElementById("jobForm").reset();
  // form reset doesn't work for hidden inputs!!
  document.getElementById("JobId").value = 0;

}

// Add a new job - called by form submit
// get the form data and send request to the API
async function addOrUpdateJob() {
  // url for api call
  const url = `${BASE_URL}/job`
  let httpMethod = "POST";

  // get new job data as json (the request body)
  const jobObj = getJobForm();
  console.log('GRAVA');
  console.log(jobObj);

  // If JobId > 0 then this is an existing job for update
  if (jobObj.JobId > 0) {
    httpMethod = "PUT";
  }
  // build the request object - note: POST
  // reqBodyJson added to the req body
  const request = {
      method: httpMethod,
      headers: getHeaders(),
      // credentials: 'include',
      mode: 'cors',
      // convert JS Object to JSON and add to request body
      body: JSON.stringify(jobObj)
    };

  // Try catch 
  try {
    // Call fetch and await the respose
    // fetch url using request object
    
    const response = await fetch(url, request);
    console.log("chegou?", response)
    const json = await response.json();
    // Output result to console (for testing purposes) 
    console.log(json);

    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
  // Refresh jobs list
  loadJobs();
}

  // When a job is selected for update/ editing, get it by id and fill out the form
  async function prepareJobUpdate(id) {
    try {
        // 1. Get job by id
        const job = await getDataAsync(`${BASE_URL}/job/${id}`);

        // 2. Set up the form (title, etc.)
        jobFormSetup(`Update Job ID: ${job.JobId}`);

        // 3. Fill out the form
        document.getElementById('JobId').value = job.JobId; // uses a hidden field - see the form
        document.getElementById('CategoryId').value = job.CategoryId;
        document.getElementById('JobName').value = job.JobName;
        document.getElementById('JobDescription').value = job.JobDescription;
        document.getElementById('Start_Date').value = moment(new Date(job.Start_Date)).format('YYYY-MM-DD') ;
        console.log(document.getElementById('Start_Date').value)
        console.log(document.getElementById('Finish_Date').value)
        document.getElementById('Finish_Date').value = moment(new Date(job.Finish_Date)).format('YYYY-MM-DD');

    } // catch and log any errors
    catch (err) {
    console.log(err);
    }
  }


  // Delete job by id using an HTTP DELETE request
  async function deleteJob(id) {

    // Build the request object
    const request = {
      // set http method
      method: 'DELETE',
      headers: getHeaders(),
      // credentials: 'include',
      mode: 'cors',
    };
    // Cofirm delete
    if (confirm("Are you sure?")) {
        // build the api url for deleting a job
        const url = `${BASE_URL}/job/${id}`;
        // Try catch 
        try {
            // call the api and get a result
            const result = await fetch(url, request);
            const response = await result.json();
            // if success (true result), refresh jobs list
            if (response == true)
              loadJobs();

        // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        } 
    }
  }


// Alternative for getting for data
// used formData object
// https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
function getJobFormAlt() {

  // Get form + data
  const jobForm = document.getElementById("jobForm");
  const formData = new FormData(jobForm);

  // https://stackoverflow.com/questions/41431322/how-to-convert-formdatahtml5-object-to-json
  // Get form fields + values
  let newJob = {};
  formData.forEach((value, key) => newJob[key] = value);

  // return job json
  return JSON.stringify(newJob);
}

// When this script is loaded, call loadJobs() to add jobs to the page
loadJobs();