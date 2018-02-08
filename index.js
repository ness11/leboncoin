var express = require("express");
var bodyParser = require("body-parser");
var uniqid = require('uniqid');
var multer = require("multer");
var app = express();
var mongoose = require("mongoose");
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local')
var User = require('./models/user');

mongoose.connect("mongodb://localhost:27017/leboncoin");
app.set('view engine', 'ejs');
app.use(expressSession({
    secret: 'thereactor09',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // JSON.stringify
passport.deserializeUser(User.deserializeUser()); // JSON.parse

/* VARIABLES CONSTANTES */
var limit = 1;

// 1) Definir le schema - A faire qu'une fois
var adSchema = new mongoose.Schema({
    ad_type : String,
    user_type : String,
    title : String,
    description : String,
    city : String,
    price : Number,
    photo : String,
    username : String,
    email : String,
    phone_number : String,
});

// 2) Definir le model - A faire qu'une fois
var Ad = mongoose.model("Ad", adSchema);



var upload = multer({ dest: "public/uploads/" });
var _ = require('lodash');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    var page = req.query.page
    Ad.count({}, function(err, count) {
        
        Ad.find({}, function(err, ads) {
            if (!err) {
                res.render("home.ejs", {
                ads : ads,
                count: count
                });
            }    
        }).limit(limit)
        .skip(page * limit - limit);
        
    }) 
});
app.get('/secret', function(req, res) {
    if (req.isAuthenticated()) {
      console.log(req.user);
      res.render('secret');
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/register', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/secret');
    } else {
      res.render('register');
    }
  });
  
  app.post('/register', function(req, res) {
    // Créer un utilisateur, en utilisant le model defini
    // Nous aurons besoin de `req.body.username` et `req.body.password`
    User.register(
      new User({
        username: req.body.username,
        // D'autres champs peuvent être ajoutés ici
      }),
      req.body.password, // password will be hashed
      function(err, user) {
        if (err) {
          console.log(err);
          return res.render('register');
        } else {
          passport.authenticate('local')(req, res, function() {
            res.redirect('/secret');
          });
        }
      }
    );
  });
  
  app.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/secret');
    } else {
      res.render('login');
    }
  });
  
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
  }));
  
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
app.get("/offres", function(req, res) {
    //Appel a ta BD mongo pour récupérer toutes les annonces
    var page = req.query.page
    console.log(page)
    Ad.count({"ad_type" : "offres"}, function(err, count) {
        
        Ad.find({"ad_type" : "offres"}, function(err, ads) {
            if (!err) {
                res.render("offers.ejs", {
                ads : ads,
                count: count
                });
            }    
        }).limit(limit)
        .skip(page * limit - limit);
        
    })
    
});

             

  app.get("/demandes", function(req, res) {
    var page = req.query.page
    //Appel a ta BD mongo pour récupérer toutes les annonces
    Ad.count({"ad_type" : "demandes"}, function(err, count) {
        
        Ad.find({"ad_type" : "demandes"}, function(err, ads) {
            if (!err) {
                res.render("demandes.ejs", {
                ads : ads,
                count: count
                });
            }    
        }).limit(limit)
        .skip(page * limit - limit);
        
    })
});

app.get("/offres/:type", function(req, res) {
    var type = req.params.type
    var page = req.query.page
        if (type === "particulier"){
            Ad.count({"ad_type" : "offres", "user_type" : "particulier"}, function(err, count) {
            Ad.find({"user_type" : "particulier", "ad_type" : "offres"}, function(err, ads) {
                if (!err) {
                
                
                    res.render("offers.ejs", {
                    ads : ads,
                    count : count
                    });
                }    
            }).limit(limit)
            .skip(page * limit - limit);
        })
        } else if(type === "professionnel") {
            Ad.count({"ad_type" : "offres", "user_type" : "professionnel"}, function(err, count) {
             
        Ad.find({"user_type" : "professionnel", "ad_type" : "offres"}, function(err, ads) {
            if (!err) {
             
            
                res.render("offers.ejs", {
                ads : ads,
                count : count
                });
            }    
        }).limit(limit)
        .skip(page * limit - limit);
    })
    }
})

app.get("/demandes/:type", function(req, res) {
    var type = req.params.type
    var page = req.query.page
        if (type === "particulier"){
            Ad.count({"ad_type" : "demandes", "user_type" : "particulier"}, function(err, count) {
            Ad.find({"user_type" : "particulier", "ad_type" : "demandes"}, function(err, ads) {
                if (!err) {
                
                
                    res.render("demandes.ejs", {
                    ads : ads,
                    count : count
                    });
                }    
            }).limit(limit)
            .skip(page * limit - limit);
        })
        } else if(type === "professionnel") {
            Ad.count({"ad_type" : "demandes", "user_type" : "professionnel"}, function(err, count) {
             
        Ad.find({"user_type" : "professionnel", "ad_type" : "demandes"}, function(err, ads) {
            if (!err) {
             
            
                res.render("demandes.ejs", {
                ads : ads,
                count : count
                });
            }    
        }).limit(limit)
        .skip(page * limit - limit);
    })
    }
})
    
app.get("/deposer", function(req, res) {
    res.render("deposer.ejs");
  });

app.post("/deposer", upload.single("photo"), function(req, res){ 
    var title = req.body.title;
    var user_type = req.body.user_type
    var ad_type = req.body.ad_type;
    var description = req.body.description;
    var city = req.body.city;
    var price = req.body.price;
    var photo = req.file.filename;
    var username = req.body.username;
    var email = req.body.email;
    var phone_number = req.body.phone_number;
    console.log(ad_type)

    var ad = new Ad({ 
        ad_type : ad_type,
        user_type : user_type,
        title : title,
        description : description,
        city : city,
        price: price,
        photo : photo,
        username : username,
        email : email,
        phone_number : phone_number,
      
    
    })

    ad.save(function(err, obj) {
        if (err) {
        console.log("something went wrong");
        } else {
        console.log("we just saved the new add " + obj.title);
        }
        res.redirect("/"+ ad_type)
    });
    
});

app.get("/annonce/:id", function(req, res) {
    var id = req.params.id;
    Ad.find({"_id" : id}, function(err, ad) {
        if (!err) {
          console.log("article", ad);
        
            res.render("annonce.ejs", {
            ad : ad[0],
            id : id,
            });
        }    
           
      
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
app.get("/annonce/:id/edit", function(req, res) {
    //Appel a ta BD mongo pour récupérer toutes les annonces
    var id = req.params.id;
    Ad.find({"_id" : id}, function(err, ad) {
        if (!err) {
            console.log("3ieme", ad);
            res.render("edit.ejs", {
            ad : ad[0],
            id : id
            }); 
        }
        
            
          
    });
});

app.post("/annonce/:id/edit", upload.single("photo"), function(req, res) {
    var user_type = req.body.user_type
    var ad_type = req.body.ad_type;
    var title = req.body.title
    var description = req.body.description
    var city = req.body.city
    var price = req.body.price
    var photo = req.file.filename
    var username = req.body.username
    var email = req.body.email
    var phone_number = req.body.phone_number
    var id = req.params.id;

    Ad.findOneAndUpdate({"_id" : id}, {
        title : title,
        description : description,
        city : city,
        price: price,
        photo : photo,
        username : username,
        email : email,
        phone_number : phone_number,
        ad_type : ad_type,
        user_type : user_type,
        }, 
        {new: true}, 
        function(err, ad) {
        if (!err) {
          console.log("ad", ad);
          res.redirect("/annonce/"+id+"/modified")
        }
           
    });
    
});

app.get("/annonce/:id/modified", function(req, res) {
    var id = req.params.id;
    Ad.find({"_id" : id}, function(err, ad) {
        if (!err) {
            console.log("4ieme", ad);
            res.render("modify.ejs", {
            ad : ad[0],
            id : id
            
        });  
        }
         
    });
});

app.listen(3000, function() {
    console.log("Server has started");
  });


  