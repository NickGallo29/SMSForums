const Joi=require('joi');

module.exports.postSchema=Joi.object({
    postTitle: Joi.string().required(),
    quillText: Joi.string(),
    category: Joi.string().required(),
}).required()

module.exports.commentSchema=Joi.object({
    commentText: Joi.string().required(),
}).required()