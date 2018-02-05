var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var uniqid = require('uniqid');
var multer = require("multer");
var upload = multer({ dest: "public/uploads/" });

app.use(express.static("public"));
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
    console.log("ads 1", ads[0]);
    console.log("ads 2", ads[1])
    
    res.redirect("/")
});

app.get("/annonce/:id", function(req, res) {
   
    var id = req.params.id 
    var keys = ads.indexOf(id)
    console.log(keys)
    var title = ads[keys].title
    var city = ads[keys].city
    var price = ads[keys].price
    var photo = ads[keys].photo
    res.render("annonce.ejs", {
        ad : ads,
        title : title,
        city : city,
        price : price,
        photo: photo
    });
    
  });

app.listen(3000, function() {
    console.log("Server has started");
  });

//   <!-- <% for (var i = 0; i < ad.length; i++) {%>
//     <a href="/annonce/<%=ads[i].id%>"><%=ads[i].title%></a>
//     <%=ads[i].city%>
//     <%=ads[i].price%>
//     <img src="/uploads/<%=ads[i].photo%>" alt="">
//     <%}%> -->