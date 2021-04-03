// require the database connection
const jobRepository = require('../repositories/categoryRepository.js');

// Get all categories via the repository
// return categories
let getCategories = async () => {

    let categories = await jobRepository.getCategories();
    return categories;
};

// Module exports
// expose these functions
module.exports = {
    getCategories
};