require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const path = require("path");

/* =========================
   Import Routes & Middleware
========================= */

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const transactionController = require("./controllers/transactionController");
const isLoggedIn = require("./middleware/isLoggedIn");

const app = express();

/* =========================
   Environment Variables
========================= */

const PORT = process.env.PORT || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/finance-tracker";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "finance-tracker-secret";

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

/* =========================
   View Engine
========================= */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   Middleware
========================= */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

/* =========================
   Render Proxy Fix
========================= */

app.set("trust proxy", 1);

/* =========================
   Session Store
========================= */

const store = MongoStore.create({
  mongoUrl: MONGODB_URI,
  crypto: {
    secret: SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});

/* =========================
   Session Config
========================= */

app.use(
  session({
    store: store,
    name: "finance-tracker-session",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

/* =========================
   Global User Middleware
========================= */

app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? { name: req.session.userName }
    : null;
  next();
});

/* =========================
   Routes
========================= */

app.use("/", authRoutes);

app.get("/dashboard", isLoggedIn, transactionController.getDashboard);

app.use("/transactions", transactionRoutes);

/* =========================
   Root Redirect
========================= */

app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/dashboard");
  } else {
    return res.redirect("/login");
  }
});

/* =========================
   Health Check (Render)
========================= */

app.get("/health", (req, res) => {
  res.send("OK");
});

/* =========================
   404 Handler
========================= */

app.use((req, res) => {
  res.status(404).redirect("/");
});

/* =========================
   Start Server
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});