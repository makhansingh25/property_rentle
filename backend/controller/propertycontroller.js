const db = require("../db/index");
const streamUpload = require("../config/streamupload");
const cloudinary = require("../config/claudnary");
const property = async (req, res) => {
  try {
    const userid = req.user.id;
    const { name, price, location, room, bathroom, ac, freeze, heater } =
      req.body;

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const property = await db("rooms").insert({
      name,
      image: imageUrl,
      price,
      location,
      room,
      bathroom,
      ac,
      freeze,
      heater,
      user_id: userid,
    });

    res.status(201).json({ message: "Property Added", property, imageUrl });
  } catch (err) {
    res
      .status(500)
      .json({ error: "something went wrong", details: err.message });
  }
};

const getProperty = async (req, res) => {
  try {
    const userid = req.user.id;
    const property = await db("rooms").where({ user_id: userid }).select("*");
    res.status(200).json({ property });
  } catch (err) {
    res
      .status(500)
      .json({ error: "something went wrong", details: err.message });
  }
};

const getallproperty = async (req, res) => {
  try {
    const property = await db("rooms").select("*");
    res.status(200).json({ property });
  } catch (err) {
    res
      .status(500)
      .json({ error: "something went wrong", details: err.message });
  }
};

const latestProperty = async (req, res) => {
  try {
    const property = await db("rooms")
      .select("*")
      .orderBy("id", "desc")
      .limit(2);
    res.status(200).json({ property });
  } catch (err) {
    res
      .status(500)
      .json({ error: "something went wrong", details: err.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await db("rooms").where("id", id).first();

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const imageUrl = property.image;
    if (imageUrl) {
      const publicId = getPublicIdFromUrl(imageUrl);

      await cloudinary.uploader.destroy(publicId);
    }

    const deletepro = await db("rooms").where("id", id).delete();

    return res
      .status(200)
      .json({ message: "Property and image deleted successfully", deletepro });
  } catch (error) {
    console.error("Deletion error:", error);
    return res.status(500).json({ error: "Server error during deletion" });
  }
};

const getPropertyDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await db("rooms").where("id", id).first();
    res.status(200).json({ message: "Property get Successfully", property });
  } catch (error) {
    console.log("delete error", error);
  }
};

const updateProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const updateDdata = req.body;
    const existingProperty = await db("rooms").where("id", id).first();
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer);
      const imageUrl = uploadResult.secure_url;
      updateDdata.image = imageUrl;

      if (existingProperty.image) {
        const publicId = getPublicIdFromUrl(existingProperty.image);
        await cloudinary.uploader.destroy(publicId);
      }
    }
    await db("rooms").where("id", id).update(updateDdata);
    const updatedProperty = await db("rooms").where("id", id).first();

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function getPublicIdFromUrl(url) {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
}

module.exports = {
  property,
  getProperty,
  getallproperty,
  latestProperty,
  deleteProperty,
  getPropertyDetail,
  updateProperty,
};
