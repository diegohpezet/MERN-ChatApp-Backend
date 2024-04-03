const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { getReceiverSocketId, io } = require('../socket/socket');

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, id] }
    }).populate("messages");

    if (!conversation) return res.status(200).json([])
    
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // Create conversation
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    };

    // Create new message
    const newMessage = new Message({ senderId, receiverId, message });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Store message into database
    await Promise.all([newMessage.save(), conversation.save()]);

    // SocketIO functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);  // Emit to specific client
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = { sendMessage, getMessages }