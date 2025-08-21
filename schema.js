const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        country : Joi.string().required(),
        loaction : Joi.string().required(),
        price : Joi.number().required().min(0),
        // imgage : Joi.string().allow("", null)
    }).required()
});