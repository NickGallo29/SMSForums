//Forum Post Model
//A model that will be used to create data for user posts

//Setting defaults for models
const mongoose= require('mongoose');
const Schema = mongoose.Schema;

//Schematic for post
const forumSchema = new Schema({
    postTitle:String,
    postText:String,
    quillText:Object,
    category:{
        type:String,
        enum:['General','Guides','Speedrun','Art','Easter Eggs','Humor']
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
});

//Delete Comments Middleware

forumSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Comment.deleteMany({
            _id:{
                $in:doc.comments
            }
        })
    }
})

//Export so model can be used
module.exports=mongoose.model('ForumPost',forumSchema);