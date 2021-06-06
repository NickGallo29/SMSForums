//Requirments
const mongoose= require('mongoose');
const ForumPost=require('../models/forumPost');


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

const seedDB=async()=>{
    await ForumPost.deleteMany({});
    const text=JSON.stringify({"ops":[{"insert":"Sample text\n"}]});
    const temp=['General','Guides','Speedrun','Art','Easter Eggs','Humor']
    const characters=['Luigi','Yoshi','Peach','Bowser']
    for(i=0;i<50;i++){
        const p = new ForumPost({postTitle:`Mario and ${characters[i%4]}`,quillText:text, category:`${temp[i%6]}`,author:'60b1a5aa2cae0c368cecd026'});
        await p.save();     
    }

}

seedDB();