
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection  
// const MONGO_URI="mongodb+srv://NTP:ntp22@cluster0.hve41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
 const MONGO_URI="mongodb+srv://elntopo793:nWX1HJag3rEoty4C@cluster0.a7ymo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 "
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("mango connected"))
    .catch(err => console.log(err));


// Allow all origins during testing
app.use(cors({
     origin: "https://ntopo1.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Allow cookies if needed
}));

// Photo Schema
const photoSchema = new mongoose.Schema({
    imageUrl: String,
    description: String,
    likes: { type: Number, default: 0 }
});
const Photo = mongoose.model("Photo", photoSchema);

// Multer Storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload Photo
app.post("/api/photos/upload", upload.single("image"), async (req, res) => {
    const { description } = req.body;
    const imageUrl =` data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;

    const newPhoto = new Photo({ imageUrl, description });
    await newPhoto.save();
    res.json(newPhoto);
});

// Get All Photos
app.get("/api/photos", async (req, res) => {
    const photos = await Photo.find();
    res.json(photos);
});

// Like Photo
app.post("/api/photos/like/:id", async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    photo.likes += 1;
    await photo.save();
    res.json(photo);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

