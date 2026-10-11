import mongoose from 'mongoose';
import Actor from '../models/Actor.js';
import Movie from '../models/Movie.js';
import { getFallbackActors, getFallbackActorById } from '../services/fallbackService.js';

// @desc    Get all actors with search query
// @route   GET /api/actors
export const getActors = async (req, res) => {
  const { search, roleType } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      let query = {};

      if (search && search.trim() !== '') {
        query.name = new RegExp(search.trim(), 'i');
      }

      if (roleType && roleType !== 'All') {
        query.roleType = roleType;
      }

      const actors = await Actor.find(query).maxTimeMS(4000).sort({ name: 1 });

      // Attach movie counts for quick preview
      const actorsWithCounts = await Promise.all(
        actors.map(async (actor) => {
          const totalMovies = await Movie.countDocuments({
            'characters.actor': actor._id,
            title: { $not: /(OG\b|They Call Him OG|HIT.*3|HIT.*Third)/i },
          });
          const upcomingCount = await Movie.countDocuments({
            'characters.actor': actor._id,
            status: 'Upcoming',
            title: { $not: /(OG\b|They Call Him OG|HIT.*3|HIT.*Third|Hari\s*Hara|Harihara|Raja\s*Sa+b|Rajasa+b|Mirai|Merai)/i },
          });
          return {
            ...actor.toObject(),
            totalMovies,
            upcomingCount,
          };
        })
      );

      return res.json({
        success: true,
        count: actorsWithCounts.length,
        data: actorsWithCounts,
      });
    } catch (error) {
      console.warn('⚠️ MongoDB getActors failed, falling back:', error.message);
    }
  }

  const fallbackActors = getFallbackActors({ search, roleType });
  return res.json({
    success: true,
    count: fallbackActors.length,
    data: fallbackActors,
    fallback: true,
  });
};

// @desc    Get single actor by ID with detailed Previous & Upcoming Movies
// @route   GET /api/actors/:id
export const getActorById = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const actor = await Actor.findById(req.params.id).maxTimeMS(4000);

      if (actor) {
        // Find all movies featuring this actor
        const allMovies = await Movie.find({
          'characters.actor': actor._id,
          title: { $not: /(OG\b|They Call Him OG|HIT.*3|HIT.*Third)/i },
        })
          .maxTimeMS(4000)
          .populate('streamingPlatforms.platform')
          .sort({ releaseYear: -1 });

        // Segregate into previous (released) and upcoming movies
        const releasedRegex = /(Hari\s*Hara|Harihara|Raja\s*Sa+b|Rajasa+b|Mirai|Merai)/i;
        const previousMovies = allMovies.filter((m) => m.status === 'Released' || releasedRegex.test(m.title));
        const upcomingMovies = allMovies.filter((m) => m.status === 'Upcoming' && !releasedRegex.test(m.title));

        return res.json({
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
      }
    } catch (error) {
      console.warn('⚠️ MongoDB getActorById failed, falling back:', error.message);
    }
  }

  const fallbackActor = getFallbackActorById(req.params.id);
  if (fallbackActor) {
    return res.json({
      success: true,
      data: {
        actor: fallbackActor,
        filmography: {
          totalCount: (fallbackActor.previousMovies?.length || 0) + (fallbackActor.upcomingMovies?.length || 0),
          previousMovies: fallbackActor.previousMovies || [],
          upcomingMovies: fallbackActor.upcomingMovies || [],
        },
      },
      fallback: true,
    });
  }

  return res.status(404).json({ success: false, message: 'Actor not found' });
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
