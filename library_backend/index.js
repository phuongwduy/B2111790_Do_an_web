require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const publisherRoutes = require('./routes/publisherRoutes.js');
const borrowRoutes = require('./routes/borrowRoutes.js');
const readerRoutes = require("./routes/readerRoutes");
const staffRoutes = require("./routes/staffRoutes.js");
const cors = require("cors");

app.use(cors());

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

mongoose.connect(process.env.MONGO_URI, { 
}).then(() => {  
  console.log('Connected to the database!');
}).catch((err) => { 
  console.log('Cannot connect to the database!', err);
  process.exit();
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/publishers', publisherRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/staffs", staffRoutes);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
