const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_BOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewlistings= (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.show=(async (req, res) => {

    
    let { id } = req.params;
    const listing =
        await Listing
            .findById(id)
            .populate({path:"reviews", populate:{path:"author"}})
            .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
});

module.exports.create=(async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send();
        console.log(response.body.features[0].geometry);
        res.send("done!");
        
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    newListing.geometry = response.body.features[0].geometry;

    let result = await newListing.save();
    console.log(result);
    req.flash("success", "New listing added successfully");
    res.redirect(`/listings`);

});

module.exports.edit=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if(! listing){
        req.flash("error", "listing does not exit");
        res.render("listings");
    }

     let originalImageUrl = listing.image.url;
     originalImageUrl=originalImageUrl.replace("/uploads", "/uploads/h_300,w_250");
    req.flash("success", "Post edited successfully");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
});

module.exports.updateRoute=(async (req, res) => {
        let { id } = req.params;
        console.log(id);
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file != "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            await listing.save();
        }
        req.flash("success", "Listing updated  successfully");
        res.redirect(`/listings/${id}`);
    });

module.exports.destroy=(async (req, res) => {
    let { id } = req.params;
    let deletedInfo = await Listing.findByIdAndDelete(id);
    console.log(deletedInfo);
    req.flash("success", "Listing delted  successfully");
    res.redirect("/listings");
});