const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/orderAnything', {
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then( () => console.log('database connected ..!'))
.catch(err => console.log(err))