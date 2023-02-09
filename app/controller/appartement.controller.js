const Appartement = require("../models/appartement.model.js");


const {body, validationResult} = require("express-validator");


exports.create = [

    // Validate and sanitize the name field.
    body('name', 'The appartement name is required').trim().isLength({min: 1}).escape(),
    body('address', 'The appartement address is required').trim().isLength({min: 1}).escape(),
    body('city', 'The appartement city is required').trim().isLength({min: 1}).escape(),
    body('state', 'The appartement state is required').trim().isLength({min: 1}).escape(),
    body('phone', 'Phone number should be 10 digit number plus optional country code').trim().isMobilePhone().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const appartement = new Appartement(req.body);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('appartement-add', {title: 'Create Genre', appartement: appartement, errors: errors.array()});
        } else {
            // Data from form is valid., save to db
            Appartement.create(appartement, (err, data) => {
                if (err)
                    res.render("500", {message: `Error occurred while creating the Appartement.`});
                else res.redirect("/appartements");
            });
        }
    }
];

exports.findAll = (req, res) => {
    Appartement.getAll((err, data) => {
        if (err)
            res.render("500", {message: "The was a problem retrieving the list of appartements"});
        else res.render("appartement-list-all", {appartements: data});
    });
};

exports.findOne = (req, res) => {
    Appartement.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found appartement with id ${req.params.id}.`
                });
            } else {
                res.render("500", {message: `Error retrieving appartement with id ${req.params.id}`});
            }
        } else res.render("appartement-update", {appartement: data});
    });
};


exports.update = [

    // Validate and sanitize the name field.
    body('name', 'The appartement name is required').trim().isLength({min: 1}).escape(),
    body('address', 'The appartement address is required').trim().isLength({min: 1}).escape(),
    body('city', 'The appartement city is required').trim().isLength({min: 1}).escape(),
    body('state', 'The appartement state is required').trim().isLength({min: 1}).escape(),
    body('phone', 'Phone number should be 10 digit number plus optional country code').trim().isMobilePhone().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const appartement = new Appartement(req.body);
        appartement.i

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('appartement-update', {appartement: appartement, errors: errors.array()});
        } else {
            // Data from form is valid., save to db
            Appartement.updateById(
                req.body.id,
                appartement,
                (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                message: `Appartement with id ${req.body.id} Not found.`
                            });
                        } else {
                            res.render("500", {message: `Error updating Appartement with id ${req.body.id}`});
                        }
                    } else res.redirect("/appartements");
                }
            );
        }
    }
];

exports.remove = (req, res) => {
    Appartement.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Appartement with id ${req.params.id}.`
                });
            } else {
                res.render("500", {message: `Could not delete Appartement with id ${req.body.id}`});
            }
        } else res.redirect("/appartements");
    });
};

exports.removeAll = (req, res) => {
    Appartement.removeAll((err, data) => {
        if (err)
            res.render("500", {message: `Some error occurred while removing all appartements.`});
        else res.send({message: `All Appartements were deleted successfully!`});
    });
};

//test