const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    commentText:String
});

module.exports = mongoose.model('Comment', commentSchema);