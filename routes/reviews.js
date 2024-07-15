const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');

const CatchAsync = require('../Utils/CatchAsync');
const ExpressError = require('../Utils/ExpressError')
const {reviewSchema} = require('../schemas.js')

const router = express.Router({mergeParams: true});


const validateReview = (req,res,next) => {
    const{error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview , CatchAsync(async (req,res)=> {

    const campground = await Campground.findById(req.params.id);
    const review = new Review (req.body.review);
    //reviews comes from campground model reviews
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', CatchAsync (async(req,res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
