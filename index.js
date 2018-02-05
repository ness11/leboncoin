var express = require("express");
var bodyParser = require("body-parser");
var uniqid = require('uniqid');
var multer = require("multer");

var app = express();

var upload = multer({ dest: "public/uploads/" });
var _ = require('lodash');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


var ads = [];

var ad = {
    id :uniqid(),
    title : "chaussettes",
    photo : "02bc1d80f9b811f63444d943efb11beb"
}
ads.push(ad)
app.get("/", function(req, res) {
    res.render("home.ejs", {
        ads : ads
        
    });   
  });


app.get("/deposer", function(req, res) {
    res.render("deposer.ejs");
  });

app.post("/deposer", upload.single("photo"), function(req, res){ 
    var title = req.body.title
    var description = req.body.description
    var city = req.body.city
    var price = req.body.price
    var photo = req.file.filename
    var username = req.body.username
    var email = req.body.email
    var phone_number = req.body.phone_number

    ads.push({
        id :uniqid(),
        title : title,
        description : description,
        city : city,
        price : price,
        photo : photo,
        username : username,
        email : email,
        phone_number : phone_number
    })
    console.log(ads)

    
    res.redirect("/")
});

app.get("/annonce/:id", function(req, res) {
    var id = req.params.id
    var index = _.findIndex(ads, function(ad) { return ad.id == id });

    res.render("annonce.ejs", {
        ad: ads[index],
    });
    
});

app.listen(3000, function() {
    console.log("Server has started");
  });

