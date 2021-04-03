
// Dependencies

// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// models
const Job = require('../models/job.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM Job ORDER BY JobName ASC for json path;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM Job WHERE JobId = @id for json path, without_array_wrapper;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_CATID = 'SELECT * FROM Job WHERE CategoryId = @id ORDER BY JobName ASC for json path;';

// Second statement (Select...) returns inserted record identified by JobId = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO Job (CategoryId, JobName, JobDescription, Start_Date, Finish_Date, Lastupdate, UserEmail) VALUES (@categoryId, @JobName, @JobDescription, @Start_Date, @Finish_Date, getDate(), @UserEmail); SELECT * from dbo.Job WHERE JobId = SCOPE_IDENTITY();';
const SQL_UPDATE = 'UPDATE Job SET CategoryId = @categoryId, JobName = @JobName, JobDescription = @JobDescription, Start_Date = @Start_date, Finish_Date = @Finish_Date, Lastupdate = @Lastupdate WHERE JobId = @id; SELECT * FROM dbo.Job WHERE JobId = @id;';

const SQL_DELETE = 'DELETE FROM Job WHERE JobId = @id;';

// Get all jobs
// This is an async function named getJobs defined using ES6 => syntax
let getJobs = async () => {

    // define variable to store jobs
    let jobs;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);
        
        // first element of the recordset contains jobs
        jobs = result.recordset[0];

    // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all jobs: ', err.message);
    }

    // return jobs
    return jobs;
};

// get job by id
// This is an async function named getJobById defined using ES6 => syntax
let getJobById = async (jobId) => {

    let job;

    // returns a single job with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, jobId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        job = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get job by id: ', err.message);
        }
        
        // return the job
        return job;
};

// Get jobs by category
let getJobByCatId = async (categoryId) => {

    let jobs;

    // returns jobs with matching category id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            .input('id', sql.Int, categoryId)
            // execute query
            .query(SQL_SELECT_BY_CATID);

        // Send response with JSON result    
        jobs = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get job by category id: ', err.message);
        }

    return jobs;
};


// insert/ create a new job
// parameter: a validated job model object
let createJob = async (job) => {

    // Declare constants and variables
    let insertedJob;

    // Insert a new job
    // Note: no Job yet
    try {
        // Get a DB connection and execute SQL
        console.log("jobController Received: ", job);

        const pool = await dbConnPoolPromise
        console.log("chegou?")
        const result = await pool.request()
        

            // set named parameter(s) in query
            // checks for potential sql injection
            .input('categoryId', sql.Int, job.CategoryId)    

            .input('JobName', sql.NVarChar, job.JobName)

            .input('JobDescription', sql.NVarChar, job.JobDescription)

            .input('Start_Date', sql.Date, job.Start_Date)

            .input('Finish_Date', sql.Date, job.Finish_Date)

            .input('UserEmail', sql.NVarChar, job.UserEmail)

            .input('Lastupdate', sql.Date, new Date())

            // Execute Query
            
            .query(SQL_INSERT);      
console.log(job.UserEmail,job.Lastupdate)
        // The newly inserted job is returned by the query    
        insertedJob = result.recordset[0];
        

        // catch and log DB errors
        } catch (err) {
            console.log('DB Error - error inserting a new job: ', err.message);
            
        }

        // Return the job data
        return insertedJob;
};

// update an existing job
let updateJob = async (job) => {

   // Declare constanrs and variables
   let updatedJob;

   // Insert a new job
   // Note: no Job yet
   try {
       // Get a DB connection and execute SQL
       console.log("jobController Recebido: ", job);
       const pool = await dbConnPoolPromise
       const result = await pool.request()


           // set named parameter(s) in query
           // checks for potential sql injection
           .input('id', sql.Int, job.JobId)
           .input('CategoryId', sql.Int, job.CategoryId)

            .input('JobName', sql.NVarChar, job.JobName)

            .input('JobDescription', sql.NVarChar, job.JobDescription)

            .input('Start_Date', sql.Date, job.Start_Date)

            .input('Finish_Date', sql.Date, job.Finish_Date)

            .input('Lastupdate', sql.Date, new Date())

           // Execute Query
           .query(SQL_UPDATE);      

       // The newly inserted job is returned by the query    
       updatedJob = result.recordset[0];

       // catch and log DB errors
       } catch (err) {
           console.log('DB Error - error updating job: ', err.message);
           console.log(job.JobId, typeof job.JobId)
           console.log(updatedJob)
       }

       // Return the job data
       return updatedJob;
};

// delete a job
let deleteJob = async (jobId) => {

    // record how many rows were deleted  > 0 = success
    let rowsAffected;

    // returns a single job with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, jobId)
            // execute query
            .query(SQL_DELETE);

        // Was the job deleted?    
        rowsAffected = Number(result.rowsAffected);     

        } catch (err) {
            console.log('DB Error - get job by id: ', err.message);
        }
        // Nothing deleted
        if (rowsAffected === 0)
            return false;
        // successful delete
        return true;    
};

// Export 
module.exports = {
    getJobs,
    getJobById,
    getJobByCatId,
    createJob,
    updateJob,
    deleteJob
};
