const db = require("../db");

const bookmark = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.id;

  if (!userId || !propertyId) {
    return res
      .status(400)
      .json({ message: "User ID and Property ID required" });
  }

  try {
    const existing = await db("bookmarks")
      .where({ user_id: userId, property_id: propertyId })
      .first();

    if (existing) {
      await db("bookmarks")
        .where({ user_id: userId, property_id: propertyId })
        .del();

      return res.status(200).json({ message: "Unbookmarked" });
    } else {
      await db("bookmarks").insert({
        user_id: userId,
        property_id: propertyId,
      });

      return res.status(201).json({ message: "Bookmarked" });
    }
  } catch (error) {
    console.error("Error in bookmark toggle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await db("bookmarks")
      .join("rooms", "bookmarks.property_id", "rooms.id")
      .where("bookmarks.user_id", userId)
      .select("rooms.*");

    res.status(200).json({ message: "Bookmarks", bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const checkBookmark = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.id;

  try {
    const existing = await db("bookmarks")
      .where({ user_id: userId, property_id: propertyId })
      .first();

    res.status(200).json({ bookmarked: !!existing });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getBookmarks, bookmark, checkBookmark };
