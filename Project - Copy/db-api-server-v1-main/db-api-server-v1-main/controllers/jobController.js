const router = require('express').Router();

const JobService = require('../services/JobService.js');


// GET listing of all jobs
// Address http://server:port/job
// returns JSON
router.get('/', async (req, res) => {

    let result;
    // Get jobs
    try {

        result = await JobService.getjobs();
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
        result = await JobService.getjobById(jobId);
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
        result = await JobService.getjobByCatId(categoryId);
        res.json(result);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});


/*
 *  These endpoints need to be implemented
 *
*/

// POST - Insert a new job.
// This async function sends a HTTP post request
router.post('/', async (req, res) => {

// the request body contains the new Job values - copy it

const newJob = req.body;

// show what was copied in the console (server side)

console.log("JobController: ", newJob);

// Pass the new Job data to the service and await the result

try {

// Send response with JSON result

result = await JobService.createJob(newJob);

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
router.put('/:id', async (req, res) => {

    const jobId = req.params.id;

    res.json(`This will update job with id = ${jobId}`);
});

// DELETE single task.
router.delete('/:id', async (req, res) => {

    const jobId = req.params.id;
    
    res.json(`This will delete job with id = ${jobId}`);
});

// Export as a module
module.exports = router;
