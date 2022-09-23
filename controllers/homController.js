

const bigPromise = require('../middlewares/bigPromise')

exports.home= bigPromise(async(req, res) =>{ 
    res.status(200).json({
        success:true,
        greeting:"Api says Hello"
    })
})




