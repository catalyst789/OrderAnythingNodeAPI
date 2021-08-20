const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DeliveyPartner = require('../models/deliveryPartnerSchema');
const { isLoggedIn } = require('../utility/verifyAgentToken');

router.get('/', isLoggedIn, (req, res) => {
    res.status(200).json({message : 'Hello Delivery Partners'});
})


/**let deliveyPartner Register in this route */
router.post('/register', (req, res) => {
    const { phoneno, password } = req.body;
    const newDeliveryPartner = new DeliveyPartner ({phoneno, password});
    DeliveyPartner.findOne({phoneno})
       .then(deliveyPartner => {
           if(deliveyPartner) return res.status(302).json({Error: 'Delivey Partner Already Exits..!'})
           bcrypt.genSalt(10, function(err, salt) {
               bcrypt.hash(newDeliveryPartner.password, salt, function(err, hash) {
                   newDeliveryPartner.password = hash
                newDeliveryPartner.save()
                .then(deliveyPartnerCreated => res.status(201).json({message: 'New Delivery Partner Successfully Created!', deliveyPartnerCreated}))
                .catch(err => res.status(500).json({Error: 'Internal Server Issue' ,err}))
               });
           }); 
        })
        .catch(err =>res.status(500).json({Error: 'Internal Server Issue', err}));
           
});


/**let Admin login in this route */
router.post('/login', (req, res) => {
    const { phoneno, password } = req.body;
       DeliveyPartner.findOne({phoneno})
       .then(deliveyPartner => {
           if(!deliveyPartner) return res.status(401).json({Error: 'Delivey Partner Not Found..!'})
          bcrypt.compare(password, deliveyPartner.password)
            .then( isMatch => {
                if(!isMatch) return res.status(203).json({Error: 'Password Incorrect..!'})
                const token = jwt.sign({deliveyPartner}, process.env.SECRET_KEY_JWT_AGENT, { expiresIn: 200000 });
                req.header('auth-token', token);
                res.status(200).json({message:'Delivery Partner Successfully Logged In!', token})
            })
        })
        .catch(err =>res.status(500).json({Error: 'Internal Server Issue', err}));
           
})




module.exports = router;