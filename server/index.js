const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',  // Allow any origin for now, replace with specific domains in production
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    // We need to handle the @ character in the password specially
    // The connection string has two @ symbols, one in the password and one separating credentials from host
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define routes
app.get('/', (req, res) => {
  res.send('Restaurant Content Management API is running');
});

// Content schema and model
const contentSchema = new mongoose.Schema({
  general: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  pages: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Content = mongoose.model('Content', contentSchema);

// API routes
app.get('/api/content', async (req, res) => {
  try {
    // Get the most recent content entry
    const content = await Content.findOne().sort({ updatedAt: -1 });
    
    if (!content) {
      return res.status(404).json({ message: 'No content found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const content = await Content.findOne().sort({ updatedAt: -1 });
    
    if (content) {
      // Update existing content
      const updatedContent = {
        ...content.toObject(),
        ...req.body,
        updatedAt: new Date()
      };
      
      const result = await Content.findByIdAndUpdate(
        content._id,
        updatedContent,
        { new: true }
      );
      
      return res.json(result);
    } else {
      // Create new content if none exists
      const newContent = new Content(req.body);
      const result = await newContent.save();
      return res.status(201).json(result);
    }
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Translation schema and model
const translationSchema = new mongoose.Schema({
  translations: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Translation = mongoose.model('Translation', translationSchema);

// API routes for translations
app.get('/api/translations', async (req, res) => {
  try {
    const translations = await Translation.findOne().sort({ updatedAt: -1 });
    
    if (!translations) {
      return res.status(404).json({ message: 'No translations found' });
    }
    
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/translations', async (req, res) => {
  try {
    const translations = await Translation.findOne().sort({ updatedAt: -1 });
    
    if (translations) {
      // Update existing translations
      const updatedTranslations = {
        ...translations.toObject(),
        translations: req.body,
        updatedAt: new Date()
      };
      
      const result = await Translation.findByIdAndUpdate(
        translations._id,
        updatedTranslations,
        { new: true }
      );
      
      return res.json(result);
    } else {
      // Create new translations if none exists
      const newTranslations = new Translation({
        translations: req.body
      });
      const result = await newTranslations.save();
      return res.status(201).json(result);
    }
  } catch (error) {
    console.error('Error saving translations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 