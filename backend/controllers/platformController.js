import Platform from '../models/Platform.js';

// @desc    Get all platforms
// @route   GET /api/platforms
export const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find().sort({ name: 1 });
    res.json({ success: true, count: platforms.length, data: platforms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new platform (Admin Only)
// @route   POST /api/platforms
export const createPlatform = async (req, res) => {
  try {
    const { name, logo, category, websiteUrl, badgeColor } = req.body;

    const exists = await Platform.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Platform already exists' });
    }

    const platform = await Platform.create({
      name,
      logo,
      category: category || 'Streaming Service',
      websiteUrl: websiteUrl || '#',
      badgeColor: badgeColor || '#6366f1',
    });

    res.status(201).json({ success: true, message: 'Platform added successfully', data: platform });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
