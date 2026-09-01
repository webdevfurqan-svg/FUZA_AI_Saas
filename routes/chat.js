const express = require('express');
const router = express.Router();
const User = require('../models/User');
const aiClient = require('../config/ai');
const requireLogin = require('../middleware/auth');

router.get('/', requireLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);

  if (!user) {
    return res.redirect('/login');
  }

  
  const messages = req.session.messages || [];

  res.render('chat', { user: user, messages: messages });
});


router.post('/send', requireLogin, async (req, res) => {
  try {
    
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({ error: 'You must be logged in.' });
    }

    
    if (user.credits <= 0) {
      return res.status(403).json({ error: 'You have used all your credits.' });
    }

    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    
    if (!req.session.messages) {
      req.session.messages = [
        {
          role: 'system',
          content: 'You are a helpful, friendly AI assistant called FuzaAI. Keep answers clear and concise.'
        }
      ];
    }


    req.session.messages.push({ role: 'user', content: userMessage });

    
    const response = await aiClient.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: req.session.messages
    });

    const aiReply = response.choices[0].message.content;


    req.session.messages.push({ role: 'assistant', content: aiReply });


    user.credits = user.credits - 1;
    user.messagesUsed = user.messagesUsed + 1;
    await user.save();


    res.json({
      reply: aiReply,
      credits: user.credits
    });

  } catch (err) {
    console.log('AI request failed:', err);
    
    res.status(500).json({ error: 'The AI failed to respond. Please try again.' });
  }
});


router.post('/new', requireLogin, (req, res) => {
  req.session.messages = [];
  res.redirect('/chat');
});

module.exports = router;