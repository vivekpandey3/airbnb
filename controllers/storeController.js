const Favourite = require("../models/favourite");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
         isLoggedIn : req.isLoggedIn
    });
  });
};
// storeController.js
exports.getBookings = async (req, res, next) => {
    const homeId = req.params.homeId;
    try {
        const home = await Home.findById(homeId);
        if (!home) {
            return res.redirect('/');
        }
        res.render('store/bookings', { 
            home: home,
            pageTitle: "Book Your Stay",
            currentPage: "bookings",
            isLoggedIn: req.isLoggedIn
        });
    } catch(err) {
        console.log(err);
        res.redirect('/');
    }
};



exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
         isLoggedIn : req.isLoggedIn
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
       isLoggedIn : req.isLoggedIn
  });
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
    .populate('houseId')
    .then(favourites => {
      // Map and remove null homes
      const favouriteHomes = favourites
        .map(fav => fav.houseId)
        .filter(home => home); // remove null
      res.render("store/favourite-list", {
        favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
           isLoggedIn : req.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};


exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;
  Favourite.findOne({houseId:homeId}).then ((fav) =>{
    if(fav){
      console.log("already added")
    } else{
      fav= new Favourite({houseId:homeId})
      fav.save().then((result) =>{
        console.log(result)
      })
    }
    res.redirect("/favourites")
  }).catch(err =>{
    console.log(err)

  })
};

exports.postRemoveFromFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete(houseId).then(result => {
    console.log('Fav Removed: ', result);
  }).catch(err => {
    console.log("Error while removing favourite: ", err);
  }).finally(() => {
    res.redirect("/favourites");
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-details", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
           isLoggedIn : req.isLoggedIn
      });
    }
  });
};