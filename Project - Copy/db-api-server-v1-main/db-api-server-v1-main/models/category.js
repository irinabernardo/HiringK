// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_a_constructor_function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/default_parameters

let Category = (categoryId = 0, categoryName, categoryDescription) => {

    this.CategoryId = categoryId;
    this.CategoryName = categoryName;
    this.CategoryDescription = categoryDescription;
};

module.exports = Category;


