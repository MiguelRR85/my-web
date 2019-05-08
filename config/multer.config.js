const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const User = require('../models/user.model');
const createError = require('http-errors');

const storage = multer.diskStorage({
    destination: function(req, file, next) {

        const dir1 = './public/uploads/users';
        const dir2 = './public/uploads/posts';
        const dir3 = './public/uploads/works';

        console.log("MULTER----->", req.body)
        
        if(file.fieldname === 'avatar'){
            User.findOne({ email: req.body.email })
                .then(user => {
                        fs.ensureDir(dir1)
                            .then(() => {
                                next(null, './public/uploads/users');
                            })
                            .catch(err => {
                                next(err)
                            })   
                    })
                    .catch(err => {
                        next(err);
                    })                    
                // .then(user => {
                //     if( !user ){
                //         fs.ensureDir(dir1)
                //             .then(() => {
                //                 next(null, './public/uploads/users');
                //             })
                //             .catch(err => {
                //                 next(err)
                //             })
                //     }else{
                //         throw createError(409, `User with email ${req.body.email} already exists`);
                //             
                //     }
                // })
                // .catch(err => {
                //     next(err);
                // })                    
        }                
                    
                
       
        if(file.fieldname === 'image'){
            fs.ensureDir(dir2)
                .then(() => {
                    next(null, './public/uploads/posts');
                })
                .catch(err => {
                    console.error(err)
                })
            
        }
        if(file.fieldname === 'img'){
            fs.ensureDir(dir3)
                .then(() => {
                    
                    next(null, './public/uploads/works');
                })
                .catch(err => {
                    console.error(err)
                })
            
        }
       
    },
    filename: function(req, file, next) {
        next(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({ storage: storage });
module.exports = upload;
