const { ContactMessage } = require('../models');

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide your name and phone number' });
    }

    const formattedMessage = subject 
      ? `[${subject}]\n${message || 'Express interest submitted for this property.'}`
      : (message || 'No message provided');

    const cleanEmail = (email && email.trim()) ? email.trim() : `${phone.replace(/\D/g, '') || 'client'}@inquiry.homespace.com`;

    const newMsg = await ContactMessage.create({
      name, 
      email: cleanEmail, 
      phone, 
      message: formattedMessage
    });

    res.status(201).json({ success: true, message: 'Inquiry sent successfully', data: newMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact, getContacts };
