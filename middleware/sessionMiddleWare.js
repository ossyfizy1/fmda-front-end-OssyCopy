
// middleware to check if session has a valid user email
var checkSession = function(req, res, next){
    try {
        if(!req.session.userDetails){
            console.log("logged out or not a valid user")
            res.send(
                " '<script> alert(' You have been logged out already '); </script>' "
                + "<script> window.location.href='/'; </script>"
                );

            return;
        }
        else if(req.session.userDetails){
            next();
        }
    } catch (error) {
        if(error){
            res.send(
                " '<script> alert(' session middle ware issue, contact the tech department '); </script>' "
                + "<script> window.location.href='/'; </script>"
                );
        }
    }

    
}


module.exports = checkSession;