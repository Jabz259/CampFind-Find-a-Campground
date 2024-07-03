//Importing Mongoose dependancy
const mongoose = require('mongoose');
//Using schema
const Schema = mongoose.Schema;

//Defining out schema model
const CampgroundSchema = new Schema ({
    title: String,
    image: String, 
    price: Number,
    description: String,
    location: String
})

//Compiling our schema by passing the class name and the defined model
module.exports = mongoose.model('campgrounds', CampgroundSchema);
