const checkjob = (requiredJob) => {
    // const job = ["Admin", "Manager", "Nurse", "PTNurse"];
    if( requiredJob.includes( JSON.parse( localStorage.getItem("userData") ).Job ) ) {
        return true;
    }
    return false;
};

export default checkjob;