var express = require('express');
var router = express.Router();
var configHeader = require("../configs/config_Header");
var mongoose = require('mongoose');
var Product = require('../models/product');
var session = require('express-session');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, xcallback) {
        xcallback(null, 'public/images');
    },
    filename: function (req, file, xcallback) {
        xcallback(null, file.originalname);
    }
});
var uploadStore = multer({ storage: storage });

const dbname = 'shopbebe';
const uri = 'mongodb+srv://phuc:khieVuk2ZM11p2s4@cluster0.skjiy.mongodb.net/shopbebe?retryWrites=true&w=majority';

/// --- Code CONTROLLERs
router.use(function timeLog (req, res, next) {
    console.log('\n\t Product controller - Time: ', Date.now());
    next();
})

// / ..................................................
router.get('/', productPage);
function productPage(req, res) {
    
    if (session.user) 
    {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("shopbebe");
            dbo.collection("product").find({}).toArray(function(err, productlist) {
              if (err) throw err;
              
                res.render("pages/product-list",  {
                    title: "ATN-Shop PRODUCT page", 
                    username: session.user.username,
                    products : productlist 
                    , configHeader: configHeader , currpage: "Product"
                    });
                console.log('Found:', productlist);

              db.close();
            });
          });
                    

        
    } else {
        res.redirect('/login');
    }    
    console.log("\n\t ... connect PRODUCT from ", req.connection.remoteAddress, req.headers.host);
}
router.get('/view', productPage1);
function productPage1(req, res) {
    if (session.user) 
    {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("shopbebe");
            dbo.collection("product").find({}).toArray(function(err, productlist) {
              if (err) throw err;
              
                res.render("pages/product-two",  {
                    title: "ATN-Shop PRODUCT page", 
                    username: session.user.username,
                    products : productlist 
                    , configHeader: configHeader , currpage: "Product"
                    });
                console.log('Found:', productlist);

              db.close();
            });
          });
                    

        
    } else {
        res.redirect('/login');
    }    
    console.log("\n\t ... connect PRODUCT from ", req.connection.remoteAddress, req.headers.host);
}


router.get('/view1', productPage2);
function productPage2(req, res) {
    if (session.user) 
    {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("shopbebe");
            dbo.collection("product").find({}).toArray(function(err, productlist) {
              if (err) throw err;
              
                res.render("pages/product-three",  {
                    title: "ATN-Shop PRODUCT page", 
                    username: session.user.username,
                    products : productlist 
                    , configHeader: configHeader , currpage: "Product"
                    });
                console.log('Found:', productlist);

              db.close();
            });
          });
                    

        
    } else {
        res.redirect('/login');
    }    
    console.log("\n\t ... connect PRODUCT from ", req.connection.remoteAddress, req.headers.host);
}
/// ..................................................
router.get('/list', listProductPage);
function listProductPage(req, res) {
    res.send('PRODUCT: list PRODUCT page');
}

/// ..................................................
router.post('/create', uploadStore.array('img', 12),  createProductPage);
router.get('/create', uploadStore.array('img', 12), createProductPage);
function createProductPage(req, res, next) {
    xproduct = {
        id: "",
        name: "",
        price: 0,
        information: "",
        img: ""
    };
    if (req.body.id) {
        xproduct.id = req.body.id;
    }
    if (req.body.name) {
        xproduct.name = req.body.name;
    }
    if (req.body.price) {
        xproduct.price = req.body.price;
    }
    if (req.body.information) {
        xproduct.information = req.body.information;
    }
    if (req.files) {
        xproduct.img = req.files[0].originalname;
    }

    console.log(xproduct);

    if (xproduct.id != "") {
        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
            function(err, dbconnection) {
                if (err) throw handleError(err);
                ///
                console.log('\n\t insert Product: Successfully connected');
        
                ///
                const newproduct = new Product( {
                    _id : new mongoose.Types.ObjectId, 
                    id : xproduct.id,
                    name: xproduct.name,
                    price: xproduct.price,
                    information: xproduct.information,
                    img: xproduct.img
                });
                newproduct.save( function(err) {
                    if (err) throw err;
                    ///
                    console.log('\n\t insert - Product model - Successfully insert');
                } );  
        });
    }

    res.render("pages/product_create", {title: "ATN-Shop create PRODUCT page", Notify: "", configHeader: router.params.configHeader , currpage: "create Product" });
}

router.post('/delete',deleteProduct);
router.get('/delete',deleteProduct);
function deleteProduct(req,res){
    xproduct1 = {
        name: "",
    };
    if (req.body.name) {
        xproduct1.name = req.body.name;
    }

    console.log(xproduct1);
    if (xproduct1.name != "") {
            var MongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/";
            MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("shopbebe");
            var myquery = { name: xproduct1.name };
            dbo.collection("product").deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            });
            });
    }
    res.render("pages/product_delete", {title: "ATN-Shop Delete PRODUCT page", Notify: "", configHeader: router.params.configHeader , currpage: "Delete Product" });
}
/// --- EXports
module.exports = router;


