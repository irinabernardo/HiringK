// require the database connection
const jobRepository = require('../repositories/jobRepository.js');
const jobValidator = require('../validators/jobValidators.js');

// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');


// Get all jobs via the repository
// return jobs
let getjobs = async () => {

    let jobs = await jobRepository.getjobs();
    return jobs;
};


// Get job by id via the repository
// Validate input
// return job
let getjobById = async (jobId) => {

    let job;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!validator.isNumeric(jobId + '', { no_symbols: true })) {
        console.log("getjobs service error: invalid id parameter");
        return "invalid parameter";
    }

    // get job
    job = await jobRepository.getjobById(jobId);

    return job;
};

// Get jobs in a category via the repository
// Validate input
// return jobs
let getjobByCatId = async (catId) => {

    let jobs;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!validator.isNumeric(catId + '', { no_symbols: true })) {
        console.log("getjobsCatId service error: invalid id parameter");
        return "invalid parameter";
    }

    jobs = await jobRepository.getjobByCatId(catId);

    return jobs;
};


// To be implemented

let createJob = async (job) => {
// declare variables

let newlyInsertedJob;

// Call the job validator - kept seperate to avoid clutter here

let validatedJob = jobValidator.validateNewJob(job);

// If validation returned a job object - save to database

if (validatedJob != null) {

newlyInsertedJob = await jobRepository.createJob(validatedJob);

} else {

// Job data failed validation

newlyInsertedJob = {"error": "invalid job"};

// log the result

console.log("JobService.createJob(): form data validate failed");

}

// return the newly inserted job

return newlyInsertedJob;

};

let updatejob = async (job) => {

    return true;
};

let deletejob = async (id) => {

    return true;
};

// Module exports
// expose these functions
module.exports = {
    getjobs,
    getjobById,
    getjobByCatId,
    createJob,
    updatejob,
    deletejob
};