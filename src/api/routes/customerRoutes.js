const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerSchema');
const Catalogues = require('../models/catalogueSchema');
const { isLoggedIn } = require('../utility/verifyCustomerToken');
const { json } = require('express');

router.get('/', isLoggedIn, (req, res) => {
    res.status(200).json({message : 'Hello Customer'});
})


/**let deliveyPartner Register in this route */
router.post('/register', (req, res) => {
    const { phoneno, password } = req.body;
    const newCustomer = new Customer ({phoneno, password});
    Customer.findOne({phoneno})
       .then(cutomer => {
           if(cutomer) return res.status(302).json({Error: 'Customer Already Exits..!'})
           bcrypt.genSalt(10, function(err, salt) {
               bcrypt.hash(newCustomer.password, salt, function(err, hash) {
                   newCustomer.password = hash
                newCustomer.save()
                .then(customerCreated => res.status(201).json({message: 'New Customer Successfully Created!', customerCreated}))
                .catch(err => res.status(500).json({Error: 'Internal Server Issue' ,err}))
               });
           }); 
        })
        .catch(err =>res.status(500).json({Error: 'Internal Server Issue', err}));
           
});


/**let Admin login in this route */
router.post('/login', (req, res) => {
    const { phoneno, password } = req.body;
       Customer.findOne({phoneno})
       .then(customer => {
           if(!customer) return res.status(401).json({Error: 'Customer Not Found..!'})
          bcrypt.compare(password, customer.password)
            .then( isMatch => {
                if(!isMatch) return res.status(203).json({Error: 'Password Incorrect..!'})
                const token = jwt.sign({customer}, process.env.SECRET_KEY_JWT_CUSTOMER, { expiresIn: 200000 });
                req.header('auth-token', token);
                res.status(200).json({message:'Customer Successfully Logged In!', token, customer})
            })
        })
        .catch(err =>res.status(500).json({Error: 'Internal Server Issue', err}));
           
});


/**let Customer see Catalogues */
router.get('/allCatalogues', isLoggedIn, (req, res) => {
    Catalogues.find().then( catalogues => {
        res.status(200).json({message:'All Catalogues', catalogues})
    }).catch( err => res.status(302).json({Error:err}));
})

/**Let Customer a item to there Cart */
router.post('/addTocart', isLoggedIn, (req, res) => {
    const catalogueId = req.body.catalogueId;
    Customer.findOne({user: req.user}).then( loggedInUser => {
        if(!loggedInUser.cart.includes(catalogueId)) {
            loggedInUser.cart.push(catalogueId)
            let customerCart = loggedInUser.cart;
            const filtredCart = customerCart.filter((data, index) => {
                return customerCart.indexOf(data) === index;
            })
            customerCart = filtredCart;
            loggedInUser.save().then( userHasAddSomethingToCart => {
                res.status(200).json({message:'Added to Cart', userHasAddSomethingToCart})
            }).catch( err => res.status(500).json({Error:err}))
        }
        else{
            let customerCart = loggedInUser.cart;
            const filtredCart = customerCart.filter((data, index) => {
                return customerCart.indexOf(data) === index;
            })
            customerCart = filtredCart;
            loggedInUser.save().then( customerCart => {
                res.status(200).json({message:'You have Already this Item in your Cart', customerCart})
            }).catch( err => res.status(500).json({Error:err}))
            
        }
    }).catch( err => res.status(500).json({Error:err}));
});

/**Let Cutomer Place an Order*/
router.post('/makeOrder', isLoggedIn, (req, res, next) => {
    const { name, quantity, deliveryPoint, mobile } = req.body;
    if(name && quantity && deliveryPoint && mobile !== ''){
    Customer.findOne({user: req.user}).then( loggedInCustomer => {
        const catalogueId = loggedInCustomer.cart[0];
        loggedInCustomer.myOrders.push({ catalogueId, name, quantity, deliveryPoint, mobile })
        loggedInCustomer.save().then( savedCustomer => {
            res.status(201).json({message: 'Order Placed', savedCustomer})
        }).catch( err => res.status(500).json({Error: err}))
    }).catch( err => res.status(500).json({Error: err}));
} else res.json({error: 'Enter name, mobile, deliveryPoint and Other Details to Place an Order'})
})



module.exports = router;