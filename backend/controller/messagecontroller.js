const db = require("../db");

const messages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId, message, ReceiverId, name, mobile, email } = req.body;

    if (userId === ReceiverId) {
      return res.status(400).json({ message: "cannot send message yourself" });
    }
    await db("message").insert({
      name,
      property_id: propertyId,
      user_id: userId,
      Receiver: ReceiverId,
      mobile,
      email,
      message,
    });

    res.status(201).json({ message: "Message has been sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await db("message")
      .join("rooms", "message.property_id", "rooms.id")
      .where("message.Receiver", userId)
      .select(
        "message.id",
        "message.message",
        "message.name ",
        "message.email",
        "message.mobile",
        "message.property_id",
        "message.user_id as sender_id",
        "message.Receiver as receiver_id",
        "rooms.name as room_name",
        "rooms.price as room_price",
        "rooms.location"
      );

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching messages." });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const delMessage = await db("message").where("id", id).delete();
    res
      .status(200)
      .json({ message: "Message Delete Successfully", delMessage });
  } catch (error) {
    console.log("delete error", error);
  }
};
module.exports = { messages, getMessages, deleteMessage };
