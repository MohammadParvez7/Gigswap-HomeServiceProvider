require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const serviceRoute = require("./router/service-router");
const adminRoute = require("./router/admin-router");
const workerRoute = require("./router/worker-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

const corsOptions = {
  origin: "https://gigswap-home-service-provider-clien.vercel.app",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/data", serviceRoute);
app.use("/api/admin", adminRoute);
app.use("/api/worker", workerRoute);

app.use(errorMiddleware);

// ✅ Database connect (important)
connectDb();

// ✅ VERY IMPORTANT — export app
module.exports = app;