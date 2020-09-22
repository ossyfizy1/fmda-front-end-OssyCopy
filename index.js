var express = require('express')
// require the path module
var path = require("path");
// require express
var app = express();
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
var bodyParser = require("body-parser");
// require express-session
var session = require("express-session");

// require individual router
var fmda_ind_routes = require("./routes/fmda_ind_routes");
// require update_fmda_ind_routes router
var update_fmda_ind_routes = require("./routes/update_fmda_ind_routes");
// require corporate router
var fmda_corp_routes = require("./routes/fmda_corp_routes");
// require admin router
var fmda_admin_routes = require("./admin/routes");



// require controller
var app_controller = require("./controllers/app_controller");


// set up the view engine
app.set("view engine", "ejs");

// for public content
app.use(express.static(path.join(__dirname) + "/public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// use session as middleware
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    }
    
// using session as middleware
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));




/* other route server */

// use fmda_ind_routes router as middle-ware
app.use("/", fmda_ind_routes);
// use update_fmda_ind_routes router as middle-ware
app.use("/", update_fmda_ind_routes);
// use fmda_corp_routes router as middle-ware
app.use("/", fmda_corp_routes);
// use fmda_admin_routes router as middle-ware
app.use("/admin", fmda_admin_routes);



/* routes and controllers */

// index route
app.get('/', app_controller.homePage);

// registration route
app.get('/register', app_controller.registration);

// /individual_toKnow
app.get('/individual_toKnow', app_controller.individual_toKnow);

// corperate_toKnow
app.get('/corperate_toKnow', app_controller.corperate_toKnow);

// individual & corporate login
app.post('/login', app_controller.login);

// password reset get route
app.get('/passwordReset', app_controller.passwordReset_initiated);

// password reset post route
app.post('/passwordReset', app_controller.passwordReset_done);

// verify security answer for password reset
app.post("/validateSecurityAnswer", app_controller.validateSecurityAnswer);

// set the new Password
app.post('/newPasswordReset', app_controller.newPasswordReset);

// post route to get industry list 
app.post('/industriesTypesList', app_controller.industriesTypesList);

// make_objection
app.get('/make_objection', app_controller.make_objection);

// make_objection
app.post('/make_objection', app_controller.handle_make_objection);

// corp member objection post
app.post('/general_objection_post', app_controller.general_objection_post);

// review_objection
app.get('/review_objection', app_controller.review_objection);

// review_objection
app.post('/review_objection', app_controller.handle_review_objection);

// logout get route
app.get('/logout', app_controller.logout);






// start server to listen on given port 
var server = app.listen( process.env.FMDAPORT || 9100, function () {
    var host = server.address().address
    var port = server.address().port;

    console.log("fmda app server listening at http://%s:%s", host, port);
})