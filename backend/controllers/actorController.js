import Actor from '../models/Actor.js';
import Movie from '../models/Movie.js';

// @desc    Get all actors with search query
// @route   GET /api/actors
export const getActors = async (req, res) => {
  try {
    const { search, roleType } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      query.name = new RegExp(search.trim(), 'i');
    }

    if (roleType && roleType !== 'All') {
      query.roleType = roleType;
    }

    const actors = await Actor.find(query).sort({ name: 1 });

    // Attach movie counts for quick preview
    const actorsWithCounts = await Promise.all(
      actors.map(async (actor) => {
        const totalMovies = await Movie.countDocuments({
          'characters.actor': actor._id,
        });
        const upcomingCount = await Movie.countDocuments({
          'characters.actor': actor._id,
          status: 'Upcoming',
        });
        return {
          ...actor.toObject(),
          totalMovies,
          upcomingCount,
        };
      })
    );

    res.json({
      success: true,
      count: actorsWithCounts.length,
      data: actorsWithCounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single actor by ID with detailed Previous & Upcoming Movies
// @route   GET /api/actors/:id
export const getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);

    if (!actor) {
      return res.status(404).json({ success: false, message: 'Actor not found' });
    }

    // Find all movies featuring this actor
    const allMovies = await Movie.find({
      'characters.actor': actor._id,
    })
      .populate('streamingPlatforms.platform')
      .sort({ releaseYear: -1 });

    // Segregate into previous (released) and upcoming movies
    const previousMovies = allMovies.filter((m) => m.status === 'Released');
    const upcomingMovies = allMovies.filter((m) => m.status === 'Upcoming');

    res.json({
      success: true,
      data: {
        actor,
        filmography: {
          totalCount: allMovies.length,
          previousMovies,
          upcomingMovies,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new actor (Admin Only)
// @route   POST /api/actors
export const createActor = async (req, res) => {
  try {
    const { name, image, bio, dateOfBirth, debutYear, nationality, roleType, awards, highlightQuote } = req.body;

    const actor = await Actor.create({
      name,
      image,
      bio,
      dateOfBirth,
      debutYear,
      nationality,
      roleType: roleType || 'Lead Actor',
      awards: Array.isArray(awards) ? awards : (awards ? awards.split(',').map(a => a.trim()) : []),
      highlightQuote,
    });

    res.status(201).json({
      success: true,
      message: 'Actor profile created successfully',
      data: actor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update actor (Admin Only)
// @route   PUT /api/actors/:id
export const updateActor = async (req, res) => {
  try {
    const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!actor) {
      return res.status(404).json({ success: false, message: 'Actor not found' });
    }

    res.json({
      success: true,
      message: 'Actor profile updated successfully',
      data: actor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete actor (Admin Only)
// @route   DELETE /api/actors/:id
export const deleteActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) {
      return res.status(404).json({ success: false, message: 'Actor not found' });
    }

    await actor.deleteOne();

    res.json({
      success: true,
      message: 'Actor profile deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
