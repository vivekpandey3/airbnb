require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

const DB_PATH = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

// multer
const randomString = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, randomString(10) + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage, fileFilter }).single('photo'));

app.use(express.static(path.join(rootDir, 'public')));
app.use("/uploads", express.static(path.join(rootDir, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  next();
});

app.use(authRouter);
app.use(storeRouter);

app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) next();
  else res.redirect("/login");
});

app.use("/host", hostRouter);
app.use(errorsController.pageNotFound);

mongoose.connect(DB_PATH)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
