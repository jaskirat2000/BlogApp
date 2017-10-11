"use strict";
var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    override= require("method-override"),
    sanitizer=require("express-sanitizer");

var app = express();

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(override("_method"));

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

//INDEX
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

//NEW
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE
app.post("/blogs", function (req, res) {

    console.log(req.body.blogs.body);
    req.body.blogs.body= req.sanitize(req.body.blogs.body);
    console.log(req.body.blogs.body);
    

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

//SHOW
app.get("/blogs/:id", function (req, res) {

    var id= req.params.id;

    Blog.findById(id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {blog: blog});
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", function (req, res) {
    var id= req.params.id;

    Blog.findById(id, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", function (req, res) {
    var id= req.params.id;
    req.body.blogs.body= req.sanitize(req.body.blogs.body);

    Blog.findByIdAndUpdate(id,req.body.blogs,function (err, updatedBlog) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
})

//DELETE
app.delete("/blogs/:id",function (req, res) {
    var id= req.params.id;

    Blog.findByIdAndRemove(id,function (err) {
       if(err){
           console.log(err);
       } else{
           res.redirect("/");
       }
    });
})


app.listen(3000, function () {
    console.log("Blog App is Online!");
});