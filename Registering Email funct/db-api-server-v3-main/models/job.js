
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_a_constructor_function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/default_parameters

function Job(id = 0, cat = 0, jname, desc, startd, finishd, uemail, lupdate) {

    this.JobId = id;
    this.CategoryId = cat;

    this.JobName = jname;
    this.JobDescription = desc;
    this.Start_Date = startd;
    this.Finish_Date = finishd;

    this.UserEmail = uemail;
    this.Lastupdate = lupdate;
}

module.exports = Job;

