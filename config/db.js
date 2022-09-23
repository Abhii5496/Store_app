const mongoose = require('mongoose')

const connectDB = () => {
    mongoose.connect(process.env.DB_URL , {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(console.log(`DB is Connected✅ `))
    .catch((error) => {
        console.log(`Connection Failed❌`);
        console.error(error)
        process.exit(1)
    })
}


module.exports = connectDB