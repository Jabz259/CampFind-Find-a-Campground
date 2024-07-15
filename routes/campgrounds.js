const express = require('express');
const router = express.Router();
const CatchAsync = require('../Utils/CatchAsync');
const ExpressError = require('../Utils/ExpressError')
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js')


const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }

}

router.get('/', CatchAsync (async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});

}));

//Order of routes matter
router.get('/new', (req,res) => {
    res.render('campgrounds/new')
} )

//posting and saving information
// app.post('/campgrounds', async (req,res) => {
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// })


router.post('/', validateCampground, CatchAsync (async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id', CatchAsync (async (req, res) =>{
    //getting the req, then the params (:id) then assinging its requested ID
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', CatchAsync (async (req,res) => {
    //passing selected data to req.params for access from HTML
    const campground = await Campground.findById(req.params.id);
    //render the details to campgrounds edit class
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', validateCampground, CatchAsync (async (req,res) => {
    const {id} = req.params;
    //using
    //console.log("This is req.body.campround for '/campgrounds/:id' " + req.body.campground);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:id', CatchAsync (async(req,res) => {
    //req.params will capture and store the id from the URL
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;