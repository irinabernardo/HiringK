const router = require('express').Router();


const jobService = require('../services/jobService.js');
const { authConfig, checkJwt, checkAuth } = require('../middleware/jwtAuth.js');
//auth0

// GET listing of all jobs
// Address http://server:port/job
// returns JSON
router.get('/', async (req, res) => {

    let result;
    // Get jobs
    try {

        result = await jobService.getJobs();
        res.json(result);

      // Catch and send errors  
      } catch (err) {
        res.status(500);
        res.send(err.message);
      }
});

// GET a single job by id
// id passed as parameter via url
// Address http://server:port/job/:id
// returns JSON
router.get('/:id', async (req, res) => {

    let result;
    // read value of id parameter from the request url
    const jobId = req.params.id;

    // If validation passed execute query and return results
    // returns a single job with matching id
    try {
        // Send response with JSON result    
        result = await jobService.getJobById(jobId);
        res.json(result);

        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
});

// GET jobs by category id
// id passed as parameter via url
// Address http://server:port/job/:id
// returns JSON
router.get('/bycat/:id', async (req, res) => {

    let result;

    // read value of id parameter from the request url
    const categoryId = req.params.id;

    // If validation passed execute query and return results
    // returns a single job with matching id
    try {
        // Send response with JSON result    
        result = await jobService.getJobByCatId(categoryId);
        res.json(result);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});


// POST - Insert a new job.
// This async function sends a HTTP POST request
//checkjwt authenticates the user, checkauth checks permissions
router.post('/', checkJwt, checkAuth([authConfig.create]), async (req, res) => {

    // the request body contains the new job values - copy it
    const newJob = req.body;

    // show what was copied in the console (server side)
    console.log("jobController: ", newJob);

    // Pass the new job data to the service and await the result
    try {
        // Send response with JSON result    
        result = await jobService.createJob(newJob);
        
        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});

// PUT update job
// Like post but jobId is provided and method = put
router.put('/', checkJwt, checkAuth([authConfig.update]),async (req, res) => {

    // the request body contains the new job values - copy it
    const job = req.body;

    // show what was copied in the console (server side)
    console.log("jobController update: ", job);

    // Pass the new job data to the service and await the result
    try {
        // Send response with JSON result    
        result = await jobService.updateJob(job);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});

// DELETE single task.
router.delete('/:id', checkJwt, checkAuth([authConfig.delete]),async (req, res) => {

    let result;
    // read value of id parameter from the request url
    const jobId = req.params.id;
    // If validation passed execute query and return results
    // returns a single job with matching id
    try {
        // Send response with JSON result    
        result = await jobService.deleteJob(jobId);
        res.json(result);

        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
});

// Export as a module
module.exports = router;
