const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts');

// Add a new contact
router.post('/add', async (req, res) => {
  try {
    const { name, role, phone, email, tags } = req.body;

    if (!name || !role || !phone || !email || !tags || tags.length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({ name, role, phone, email, tags });
    await newContact.save();
    res.status(201).json({ message: 'Contact added successfully', contact: newContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
