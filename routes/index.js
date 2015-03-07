var express = require('express'); // we're requiring Express functionality
var router = express.Router(); // attach a "router" variable to Express's router method.
// using that method when an attempt is made to HTTP get the top level directory of our website

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function (req, res, next) {
   res.render('helloworld', {title:'Hello World!'});
});

router.get('/userlist', function(req, res, next){
   var db = req.db; //get the db object passed to our http req
    // extract the db object, tell our app which collection we want to use and do a find, and reture as "docs"
    // once we get the docs, we do a render of userlist, give it a userlist variable to work with and pass our data doc to userlist variable.
    var collection = db.get('usercollection');
       collection.find({},{},function(e, docs){ //fill our "docs" variables with db documents, ie: user data
        res.render('userlist', {"userlist": docs}); // page render
    });
});

router.get('/newuser', function (req, res) {
   res.render('newuser', {title: 'Add New User'});
});

router.post('/adduser', function(req,res) {
    //set our internal DB variable
    var db= req.db;

    // Get our form values, There rely on the "name" attributes
    var userName= req.body.username;
    var userEmail= req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function (err, doc){
        if(err){
            // if it is failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else{
            // if it is works, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");

        }
});

});


module.exports = router;
