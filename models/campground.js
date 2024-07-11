//Importing Mongoose dependancy
const mongoose = require('mongoose');
//Importing review model
const Review = require('./review');
//Using schema
const Schema = mongoose.Schema;

//Defining out schema model
const CampgroundSchema = new Schema ({
    title: String,
    image: String, 
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
   if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
   }
}) 

//Compiling our schema by passing the class name and the defined model
module.exports = mongoose.model('campgrounds', CampgroundSchema);


