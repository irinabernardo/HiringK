// Input validation package

// https://www.npmjs.com/package/validator

const validator = require('validator');

// models

const Job = require('../models/Job.js');

// Validate the body data, sent by the client, for a new job

// formJob represents the data filled in a form

// It needs to be validated before using in gthe application

let validateNewJob = (formJob) => {

// Declare constants and variables

let validatedJob;

// debug to console - if no data

if (formJob === null) {

console.log("validateNewJob(): Parameter is null");

}

// Validate form data for new job fields

// Creating a job does not need a job id

// Adding '' to the numeric values makes them strings for validation purposes ()

if (

validator.isNumeric(formJob.CategoryId + '', {no_symbols: true, allow_negatives: false}) &&

!validator.isEmpty(formJob.JobName) &&

!validator.isEmpty(formJob.JobDescription) &&

validator.isDate(formJob.Start_Date) &&

validator.isDate(formJob.Finish_Date))

{

// Validation passed

// create a new Job instance based on Job model object

// no value for job id (passed as null)

validatedJob = new Job(

null,

formJob.CategoryId,

// escape is to sanitize - it removes/ encodes any html tags

validator.escape(formJob.JobName),

validator.escape(formJob.JobDescription),

validator.escape(formJob.Start_Date),

validator.escape(formJob.Finish_Date)

);

} else {

// debug

console.log("validateNewJob(): Validation failed");

}

// return new validated job object

return validatedJob;

}

// Module exports

// expose these functions

module.exports = {

validateNewJob

}