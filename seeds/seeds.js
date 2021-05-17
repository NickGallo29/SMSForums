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
    const text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga alias, tempore dolores laboriosam harum aspernatur debitis amet odit a esse praesentium quos accusantium deserunt ratione temporibus molestias sequi architecto iusto. Aliquid quam mollitia dolorem sit, iure labore voluptatum molestias. Autem alias voluptate est neque praesentium quia, sit nesciunt tempora doloribus placeat non recusandae id? Quae amet distinctio reprehenderit esse laboriosam?'
    const temp=['General','Guides','Speedrun','Art','Easter Eggs','Humor']
    const characters=['Luigi','Yoshi','Peach','Bowser']
    for(i=0;i<50;i++){
        const p = new ForumPost({postTitle:`Mario and ${characters[i%4]}`,postText:`${text}`,category:`${temp[i%6]}`});
        await p.save();     
    }

}

seedDB();