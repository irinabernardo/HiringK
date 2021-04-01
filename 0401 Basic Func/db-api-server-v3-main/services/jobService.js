// require the database connection
const jobRepository = require('../repositories/jobRepository.js');

const jobValidator = require('../validators/jobValidators.js');

// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');


// Get all jobs via the repository
// return jobs
let getJobs = async () => {

    let jobs = await jobRepository.getJobs();
    return jobs;
};


// Get job by id via the repository
// Validate input
// return job
let getJobById = async (jobId) => {

    let job;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!jobValidator.validateId(jobId)) {
        console.log("getJobs service error: invalid id parameter");
        return "invalid parameter";
    }

    // get job
    job = await jobRepository.getJobById(jobId);

    return job;
};

// Get jobs in a category via the repository
// Validate input
// return jobs
let getJobByCatId = async (catId) => {

    let jobs;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!jobValidator.validateId(catId)) {
        console.log("getJobs service error: invalid id parameter");
        return "invalid parameter";
    }

    jobs = await jobRepository.getJobByCatId(catId);

    return jobs;
};


// Insert a new job
// This function accepts job data as a paramter from the controller.
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

        // debug info
        console.log("jobService.createJob(): form data validate failed");
    }

    // return the newly inserted job
    return newlyInsertedJob;
};

// job update service
let updateJob = async (job) => {

    // Declare variables and consts
    let updatedJob;

    // call the job validator
    let validatedJob = jobValidator.validateUpdateJob(job);

    // If validation returned a job object - save to database
    if (validatedJob != null) {
        updatedJob = await jobRepository.updateJob(validatedJob);
    } else {

        // Job data failed validation 
        updatedJob = {"error": "Job update failed"};

        // debug info
        console.log("jobService.updateJob(): form data validate failed");
    }

    // return the newly inserted job
    return updatedJob;
};

let deleteJob = async (jobId) => {

    let deleteResult = false;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (jobValidator.validateId(jobId) === false) {
        console.log("deleteJobs service error: invalid id parameter");
        return false;
    }

    // delete job by id
    // result: true or false
    deleteResult = await jobRepository.deleteJob(jobId);

    // sucess
    return deleteResult;
};

// Module exports
// expose these functions
module.exports = {
    getJobs,
    getJobById,
    getJobByCatId,
    createJob,
    updateJob,
    deleteJob
};