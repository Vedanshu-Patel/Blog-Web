let express = require('express');
let app = express();
const PORT = process.env.PORT || 3000;
let BodyParser=require('body-parser');
let mongoose = require('mongoose');
let methodOverride= require('method-override');
mongoose.connect("mongodb://localhost:27017/BlogApp");
app.use(express.static("public"));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Defining database schema
let BlogSchema=new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    created:{type:Date ,default: Date.now}
});

let Blog=mongoose.model('Blog',BlogSchema);

app.get('/',function (req,res) {
    res.redirect('/blogs');
});

app.get('/blogs',function (req,res) {
    Blog.find({},function (err, blog) {
        if(err) {
            console.log(err);
        }
        else{
            res.render("index.ejs",{data:blog});
        }
    });
});

//Form route to create a new blog entry
app.get('/blogs/new',function (req, res) {
    res.render("new.ejs");
});


app.post("/blogs",function (req, res) {
    //Creates a Blog
    Blog.create(req.body.blog,function (err, b) {
        if(err) {
            res.render("new.ejs");
        }
        else{
            //redirects to the index page to show the new blog along with others
            res.redirect("/blogs");
        }
    });
});

//Show page route
app.get('/blogs/:id',function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log("hello!");
            res.redirect("/blogs");
        }
        else{
            res.render("show.ejs",{z:foundblog});
        }
    });
});


//Edit page route
app.get('/blogs/:id/edit',function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog) {
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit.ejs",{dataz:foundblog});
        }
    });
});

//Update route

app.put("/blogs/:id",function(req, res) {
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog) {
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete route
app.delete("/blogs/:id",function (req, res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


app.listen(PORT, function(req,res){
    console.log("The BlogApp is Running!");
});
