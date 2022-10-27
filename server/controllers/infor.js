let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

// create a reference to the model
let Infor = require('../models/infor');



module.exports.displayInforList = (req, res, next) => {
    Infor.find((err, inforList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(BookList);

            res.render('infor/list', 
            {title: 'infor', 
            InforList: inforList, 
            displayName: req.user ? req.user.displayName : ''});      
        }
    });
}

module.exports.displayAddPage = (req, res, next) => {
    res.render('infor/add', {title: 'Add Contact', 
    displayName: req.user ? req.user.displayName : ''})          
}

module.exports.processAddPage = (req, res, next) => {
    let newInfor = Infor({
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email
    });

    Infor.create(newInfor, (err, Infor) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the book list
            res.redirect('/infor');
        }
    });

}

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;

    Infor.findById(id, (err, inforToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('infor/edit', {title: 'Edit Contact', infor: inforToEdit, 
            displayName: req.user ? req.user.displayName : ''})
        }
    });
}

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id

    let updatedInfor = Infor({
        "_id": id,
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email
        
    });

    Infor.updateOne({_id: id}, updatedInfor, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the book list
            res.redirect('/infor');
        }
    });
}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    Infor.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // refresh the book list
             res.redirect('/infor');
        }
    });





}
module.exports.performRegister = (req, res, next) => {
    let newInfor = new Infor({
        name: req.body.name,
        // password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    });
    Infor.register(newInfor, req.body.password, (err) => {
        if (err) {
            console.log("Error: Inserting new user");
            console.log(err);
            if (err.name === "UserExistsError"){
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log("Error: User Already Exists!");
            }
            return res.render('auth/register', {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ""
            });
        } else {
            // if no error exists, then registration is successful
            // redirect the user and authenticate them
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            })
        }
    });
}