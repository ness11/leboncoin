var express = require("express");
var bodyParser = require("body-parser");
var uniqid = require('uniqid');
var multer = require("multer");
var app = express();
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/leboncoin");

// 1) Definir le schema - A faire qu'une fois
var adSchema = new mongoose.Schema({
  title : String,
  description : String,
  city : String,
  price : Number,
  photo : String,
  username : String,
  email : String,
  phone_number : Number,
});

// 2) Definir le model - A faire qu'une fois
var Ad = mongoose.model("Ad", adSchema);



var upload = multer({ dest: "public/uploads/" });
var _ = require('lodash');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", function(req, res) {
    //Appel a ta BD mongo pour récupérer toutes les annonces
    Ad.find({}, function(err, ads) {
        if (!err) {
          console.log(ads);
        }
        res.render("home.ejs", {
            ads : ads
            
        });   
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

    /* ads.push({
        title : title,
        description : description,
        city : city,
        price : price,
        photo : photo,
        username : username,
        email : email,
        phone_number : phone_number
    }) */

    var ad = new Ad({ 
        title : title,
        description : description,
        city : city,
        price: price,
        photo : photo,
        username : username,
        email : email,
        phone_number : phone_number
      
    
    })
    

    ad.save(function(err, obj) {
        if (err) {
        console.log("something went wrong");
        } else {
        console.log("we just saved the new add " + obj.title);
        }
    });
    res.redirect("/")
});

app.get("/annonce/:id", function(req, res) {
    var id = req.params.id;
    Ad.find({"_id" : id}, function(err, ad) {
        if (!err) {
          console.log("article", ad);
        }
        res.render("annonce.ejs", {
            ad : ad[0],
            id : id
            
        });   
      
      });
    
});


app.post("/annonce/:id/delete", function(req, res){
    var id = req.params.id;
    Ad.find({"_id" : id}, function(err, ad) {
        if (!err) {
          console.log("article", ad);
        }
        Ad.deleteOne({"_id" : id}, function(err, ad) {
                if (!err) {
                  res.redirect('/') 
            }
        })
             
    });
    
});

app.listen(3000, function() {
    console.log("Server has started");
  });

 
//   .save(function(err, obj) {
//     if (err) {
//       console.log("something went wrong");
//     } else {
//       console.log("we just saved the new add " + obj.title);
//     }
//   });

// title : "chaussettes",
// description : "je vends ma paire de chaussettes collector année 2016 à pailletes argentées",
// city : "bondy",
// price: "15",
// photo : "chaussettes-pailletees.jpg",
// username : "francoise",
// email : "francoise@gmail.com",
// phone_number : "0123456789"
  