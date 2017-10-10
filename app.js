"use strict";
var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var app = express();

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});

//Mongoose model config
var BlogScheme = mongoose.Schema({
    title: String,
    img: String,
    body: String,
    date: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", BlogScheme);

//Demo Blog

// Blog.create({
//     title:"Test Blog",
//     img: "https://www.shoutmeloud.com/wp-content/uploads/2013/10/What-is-blog.jpg",
//     body:"Tremble wihtout energy, and we won’t command an astronaut."
// },function (err, blog) {
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Blog was added");
//     }
// })

//ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function (req, res) {
    res.render("new");
});

app.post("/blogs", function (req, res) {

    Blog.create(req.body.blogs, function (err, blog) {
        if (err) {
            console.log(err);
            res.render("new");
        } else {
            console.log("Blog was added");
            res.redirect("/blogs");
        }
    });

});


app.listen(3000, function () {
    console.log("Blog App is Online!");
});