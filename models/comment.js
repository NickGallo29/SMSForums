const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commentText:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model('Comment', commentSchema);