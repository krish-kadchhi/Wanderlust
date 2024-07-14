const Listing=require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async(req,res)=>
{
    try {
        const allListings=await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }
   catch(err)
   {
    res.render("error.ejs",{err});
   }
}

module.exports.renderNewForm =  (req,res)=>
{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>
{
    try{
        let {id} = req.params;
        const listing=await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
        if(!listing)
        {
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{listing});    
    }
    catch(err)
    {
        res.render("error.ejs",{err});
    }
}

module.exports.creatListing =  async(req,res,next)=>
{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()
        res.send("!done")
    try {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    
    newListing.geometry = response.body.features[0].geometry;
    

   let savedListing = await newListing.save();
   console.log(savedListing)
   
    req.flash("success","New listing created!");
    res.redirect("/listings");
    }
    catch(err)
    {
        res.render("error.ejs",{err});
    }
}

module.exports.renderEditForm =  async(req,res)=>
{
    try{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    req.flash("success"," listing is edited!");
    let originalUrl = listing.image.url;
    originalUrl.replace("/upload","/upload/h_300/w_250");
    res.render("listings/edit.ejs",{listing,originalUrl});
   //res.send("hii")
    }
    catch(err)
    {
        res.render("error.ejs",{err});
    }
}

module.exports.updateListing = async(req,res)=>
{
    try{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()
    listing.geometry = response.body.features[0].geometry;
    await listing.save();

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url , filename};
    await listing.save();
    }
    req.flash("success","Listing is updated!");
    res.redirect(`/listings/${id}`);
    }
    catch(err)
    {
        res.render("error.ejs",{err});
    }
}

module.exports.destroyListing = async (req,res)=>
{
    try{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted!");
    res.redirect("/listings");
    }
    catch(err)
    {
        res.render("error.ejs",{err});
    }
}