
// Dependencies

// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// models
const Job = require('../models/Job.js');
const Category = require('../models/category.js');

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
const SQL_INSERT = 'INSERT INTO Job (CategoryId, UserId, AddressId, JobName, JobDescription, Start_Date, Finish_Date, Lastupdate, Active) VALUES (@categoryId, @UserId, @AddressId, @JobName, @JobDescription, @Start_Date, @Finish_Date, @Lastupdate, @Active); SELECT * from dbo.Job WHERE JobId = SCOPE_IDENTITY();';
const SQL_UPDATE = 'UPDATE Job SET CategoryId = @categoryId, AddressId= @AddressId, JobName = @JobName, JobDescription = @JobDescription, Start_Date = @Start_date, Finish_Date = @Finish_Date, Last_update = @Last_update, Active = @Active WHERE JobId = @id; SELECT * FROM dbo.Job WHERE JobId = @id;';
const SQL_DELETE = 'DELETE FROM Job WHERE JobId = @id;';


// Get all Jobs
// This is an async function named getJobs defined using ES6 => syntax
let getjobs = async () => {

    // define variable to store Jobs
    let Jobs;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);
        
        // first element of the recordset contains Jobs
        Jobs = result.recordset[0];

    // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all Jobs: ', err.message);
    }

    // return Jobs
    return Jobs;
};

// get Job by id
// This is an async function named getJobById defined using ES6 => syntax
let getjobById = async (JobId) => {

    let Job;

    // returns a single Job with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, JobId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        Job = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get Job by id: ', err.message);
        }
        
        // return the Job
        return Job;
};

// Get Jobs by category
let getjobByCatId = async (categoryId) => {

    let Jobs;

    // returns Jobs with matching category id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            .input('id', sql.Int, categoryId)
            // execute query
            .query(SQL_SELECT_BY_CATID);

        // Send response with JSON result    
        Jobs = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get Job by category id: ', err.message);
        }

    return Jobs;
};


// To be implemented
// insert/ create a new Job
let createJob = async (Job) => {
// Declare constanrs and variables

let insertedJob;

// Insert a new job

// Note: no Job yet

try {

// Get a DB connection and execute SQL

const pool = await dbConnPoolPromise

const result = await pool.request()

// set named parameter(s) in query

// checks for potential sql injection

.input('CategoryId', sql.Int, job.CategoryId)

.input('UserId', sql.Int, job.UserId)

.input('AddressId', sql.Int, job.AddressId)

.input('JobName', sql.NVarChar, job.JobName)

.input('JobDescription', sql.NVarChar, job.JobDescription)

.input('Start_Date', sql.Date, job.Start_Date)

.input('Finish_Date', sql.Date, job.Finish_Date)

// Execute Query

.query(SQL_INSERT);

// The newly inserted job is returned by the query

insertedJob = result.recordset[0];

// catch and log DB errors

} catch (err) {

console.log('DB Error - error inserting a new job: ', err.message);

}

// Return the job data

return insertedJob;

};

// update an existing Job
let updateJob = async (Job) => {

    return true;
};

// delete a Job
let deleteJob = async (id) => {

    return true;
};

// Export 
module.exports = {
    getjobs,
    getjobById,
    getjobByCatId,
    createJob,
    updateJob,
    deleteJob
};
