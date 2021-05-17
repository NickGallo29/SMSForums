// SMSForums Index of routes and requirements for the application to run

// All code will be expanded upon with comments to make 
// practice in learning concepts and requirments for 
// Web Development


//Requirments
const express = require('express');
const path = require('path');
const mongoose= require('mongoose');
const ForumPost=require('./models/forumPost');
const Comment = require('./models/comment');
const { render } = require('ejs');
const {postSchema, commentSchema}=require('./schemas.js');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const Joi = require('joi');


//Connecting mongoose to MongoDB database
mongoose.connect('mongodb://localhost:27017/SMSForums',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;

//Error logic
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected")
});

//Setting Express to run server
const app = express();


app.engine('ejs',ejsMate);
//Requirments for ejs
app.set('view engine','ejs');
//Setting directiory for ejs folder 'views' so application can run outside home folder
app.set('views',path.join(__dirname,'views'));


app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));

const validatePost = (req,res,next)=>{
    const {error}= postSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

const validateComment = (req,res,next) =>{
    const {error}= commentSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

//.get to render pages for url loads
app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/forums',catchAsync(async (req,res)=>{
    const forums=['General','Guides','Speedrun','Art','Easter Eggs','Humor']
    const counter=0;
    const posts= await ForumPost.find({});
    res.render('forums/forumHome',{forums,posts,counter});
    //$or[{category:'General'},{category:'Guides'},{category:'Speedrun'},{category:'Art'},{category:'Easter Eggs'},{category:'Humor'}]
}))

app.get('/forums/new',(req,res)=>{
    res.render('forums/new');
})

app.get('/forums/:tagId',catchAsync(async(req,res)=>{
    const c=req.params.tagId;
    const sub=c.charAt(0).toUpperCase()+c.slice(1); //category is normally capitalized but url parses as lowercased, this 
    const posts=await ForumPost.find({category:sub});//logic capitalizes first letter
    console.log(posts);
    res.render('forums/forumShow',{posts,sub})
}))

app.get('/forums/:tagId/:id',catchAsync(async(req,res)=>{
    const post=await ForumPost.findById(req.params.id).populate('comments');
    const JSONBody= JSON.parse(post.quillText);
    const postBody=JSONBody.ops;
    const length=postBody.length;
    console.log(postBody);
    res.render('forums/show',{post,postBody,length});
}))

app.get('/forums/:tagId/:id/edit',catchAsync(async(req,res)=>{
    const post=await ForumPost.findById({_id:req.params.id});
    res.render('forums/edit',{post});
}))

app.post('/forums', validatePost, catchAsync(async (req,res)=>{
    const newPost=new ForumPost(req.body);
    console.log(req.body);
    await newPost.save();
    res.redirect(`/forums/${newPost.category}/${newPost._id}`)
}))

app.put('/forums/:tagId/:id', catchAsync(async(req,res)=>{
    const id=req.params.id;
    const post=await ForumPost.findByIdAndUpdate(id,(req.body));
    res.redirect(`/forums/${post.category}/${post._id}`)
}))

app.delete('/forums/:tagId/:id',catchAsync(async(req,res)=>{
    const id=req.params.id;
    await ForumPost.findByIdAndDelete(id);
    res.redirect(`/forums/${req.params.tagId}`);
}))

app.post('/forums/:tagId/:id/comments',validateComment,catchAsync(async(req,res)=>{
    const post = await ForumPost.findById(req.params.id);
    const comment = await new Comment(req.body);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/forums/${req.params.tagId}/${req.params.id}`);
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="Oh No, Something Went Wrong";
    res.status(statusCode).render('error', {err});
})

//Confrims server is running properly 
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})