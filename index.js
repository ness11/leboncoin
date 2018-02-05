var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var multer = require("multer");
var upload = multer({ dest: "public/uploads/" });

app.use(express.static("upload"));
app.use(bodyParser.urlencoded({ extended: false }));


// app.post("/upload", upload.single("picture"), function(req, res) {
//     console.log(req.file);
//     res.send("File uploaded");
//   });
var ads = [];

app.get("/", function(req, res) {
    res.render("home.ejs", {
        ads : ads
        
    });   
    
    console.log(ads[0].title)
  });


app.get("/deposer", function(req, res) {
    res.render("deposer.ejs");
  });

app.post("/deposer", upload.single("photo"), function(req, res){ 
    var title = req.body.title
    var description = req.body.description
    var city = req.body.city
    var price = req.body.price
    // var photo = req.file.path
    var username = req.body.username
    var email = req.body.email
    var phone_number = req.body.phone_number
// console.log(req.file)
    ads.push({
        title : title,
        description : description,
        city : city,
        price : price,
        // photo : photo,
        username : username,
        email : email,
        phone_number : phone_number
    })

    res.redirect("/")
});

app.listen(3000, function() {
    console.log("Server has started");
  });