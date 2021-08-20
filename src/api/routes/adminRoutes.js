const router = require('express').Router();

const bcrypt = require('bcryptjs');
const { json } = require('express');
const { required } = require('joi');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema');
const catalogue = require('../models/catalogueSchema');
const customers = require('../models/customerSchema');
const { isLoggedIn } = require('../utility/verifyAdminToken');


router.get('/', isLoggedIn, (req, res) => {
    res.status(200).json({message : 'Hello Admin'});
})


/**let Admin Register in this route */
router.post('/register', (req, res, next) => {
    const { phoneno, password } = req.body;
    const newAdmin = new Admin ({phoneno, password});
       Admin.findOne({phoneno})
       .then(admin => {
           if(admin) return res.status(302).json({Error: 'Admin Already Exits..!'})
           bcrypt.genSalt(10, function(err, salt) {
               bcrypt.hash(newAdmin.password, salt, function(err, hash) {
                   newAdmin.password = hash
                newAdmin.save()
                .then(adminCreated => res.status(201).json({message: 'Admin Successfully Created!', adminCreated}))
                .catch(err => res.status(500).json({Error: 'Internal Server Issue' ,err}))
               });
           }); 
        })
        .catch(err =>res.status(500).json({Error: 'Internal Server Issue', err}));
           
});


/**let Admin login in this route */
router.post('/login', (req, res) => {
    const { phoneno, password } = req.body;
       Admin.findOne({phoneno})
       .then(admin => {
           if(!admin) return res.status(401).json({Error: 'Admin Not Found..!'})
          bcrypt.compare(password, admin.password)
            .then( isMatch => {
                if(!isMatch) return res.status(203).json({Error: 'Password Incorrect..!'})
                const admintoken = jwt.sign({admin}, process.env.SECRET_KEY_JWT_ADMIN, { expiresIn: 200000 });
                req.header('auth-token', admintoken);
                res.status(200).json({message:'Admin Successfully Logged In!', admintoken})
            })
        })
        .catch(err =>res.status(500).json({Error: 'Internal Server Issue', err}));
           
})


/**let admin Created a new Catalogue */
router.post('/createCatalogue', isLoggedIn, (req, res, next) => {
    const { category, name, address, quantity }  = req.body;
    const newCatalogue = new catalogue({category, name, address, quantity});
    newCatalogue.save().then( newlycreatedCatalogue => {
        res.status(201).json({message:'New catalogue Created', newlycreatedCatalogue})
    }).catch( err => res.status(302).json({Error:err}));
});




module.exports = router;