const {postSchema} = require('../SMSForums/schemas');
const ForumPost=require('../SMSForums/models/forumPost');
const Comment=require('./models/comment')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    const id=req.params.id;
    const post=await ForumPost.findById(id);
    if(!post.author.equals(req.user._id)){
        req.flash('error','Invalid Permissions');
        res.redirect(`/forums/${post.category}/${post._id}`);
    }
    next();
}

module.exports.isCommentAuthor=async(req,res,next)=>{
    const {commentId} = req.params;
    const comment=await Comment.findById(commentId);
    if(!comment.author.equals(req.user._id)){
        req.flash('error','Invalid Permissions');
        res.redirect(`/forums/${post.category}/${post._id}`);
    }
    next();
}