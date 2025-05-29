const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/projects/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/projects - Get all projects with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = '',
      province = '',
      sector = '',
      budgetRange = '',
      status = 'active'
    } = req.query;

    // Build filter object
    let filter = { status };

    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by province
    if (province && province !== 'Toutes les provinces') {
      filter.province = province;
    }

    // Filter by sector
    if (sector && sector !== 'Tous les secteurs') {
      filter.sector = { $regex: sector, $options: 'i' };
    }

    // Filter by budget range
    if (budgetRange && budgetRange !== 'Tous les budgets') {
      switch (budgetRange) {
        case '< 2M Dhs':
          filter.budget = { $lt: 2 };
          break;
        case '2-5M Dhs':
          filter.budget = { $gte: 2, $lte: 5 };
          break;
        case '5-10M Dhs':
          filter.budget = { $gt: 5, $lte: 10 };
          break;
        case '> 10M Dhs':
          filter.budget = { $gt: 10 };
          break;
      }
    }

    // Execute query with pagination
    const projects = await Project.find(filter)
      .populate('porteur', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await Project.countDocuments(filter);

    // Format projects for frontend
    const formattedProjects = projects.map(project => ({
      id: project._id,
      title: project.title,
      location: `${project.location}, ${project.province}`,
      sector: project.sector,
      budget: `${project.budget} M Dhs`,
      jobs: project.jobs,
      image: project.image ? `/uploads/projects/${project.image}` : '/api/placeholder/400/250',
      description: project.description,
      category: project.category || 'general',
      views: project.views,
      createdAt: project.createdAt
    }));

    res.json({
      projects: formattedProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des projets',
      error: error.message
    });
  }
});

// GET /api/projects/:id - Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('porteur', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Increment views
    await project.incrementViews();

    // Format project for frontend
    const formattedProject = {
      id: project._id,
      title: project.title,
      description: project.description,
      sector: project.sector,
      location: `${project.location}, ${project.province}`,
      budget: project.budget,
      revenue: project.revenue,
      jobs: project.jobs,
      profitability: project.profitability,
      goal: project.goal,
      technology: project.technology,
      impact: project.impact,
      incentives: project.incentives,
      partners: project.partners,
      image: project.image ? `/uploads/projects/${project.image}` : '/api/placeholder/800/400',
      publishTime: project.publishTime,
      views: project.views,
      publishedDate: project.createdAt.toISOString().split('T')[0],
      porteur: project.porteur,
      economicData: [
        { label: 'Investissement', value: `${project.budget} M Dhs`, icon: 'DollarSign' },
        { label: 'Chiffre d\'affaires', value: `${project.revenue} M Dhs`, icon: 'TrendingUp' },
        { label: 'Emplois', value: project.jobs.toString(), icon: 'Users' },
        { label: 'Ratio de rentabilité', value: project.profitability.toString(), icon: 'TrendingUp' }
      ],
      keyInfo: {
        location: `${project.location}, ${project.province}`,
        sector: project.sector,
        investment: `${project.budget} millions Dhs`,
        expectedJobs: `${project.jobs} emplois`,
        expectedRevenue: `${project.revenue} millions Dhs`
      }
    };

    res.json(formattedProject);

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération du projet',
      error: error.message
    });
  }
});

// POST /api/projects - Create new project (Protected route)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      sector,
      location,
      province,
      budget,
      revenue,
      jobs,
      profitability,
      goal,
      technology,
      impact,
      incentives,
      partners,
      publishTime,
      category
    } = req.body;

    // Create new project
    const projectData = {
      title,
      description,
      sector,
      location,
      province,
      budget: parseFloat(budget),
      revenue: revenue ? parseFloat(revenue) : 0,
      jobs: jobs ? parseInt(jobs) : 0,
      profitability: profitability ? parseFloat(profitability) : 0,
      goal: goal || '',
      technology: technology || '',
      impact: impact || '',
      incentives: incentives || '',
      partners: partners || '',
      publishTime: publishTime || '',
      category: category || 'general',
      porteur: req.user.id
    };

    // Add image if uploaded
    if (req.file) {
      projectData.image = req.file.filename;
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      message: 'Projet créé avec succès',
      project: {
        id: project._id,
        title: project.title,
        sector: project.sector,
        location: project.location
      }
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      message: 'Erreur lors de la création du projet',
      error: error.message
    });
  }
});

// PUT /api/projects/:id - Update project (Protected route)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check if user owns the project
    if (project.porteur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Update fields
    const updates = { ...req.body };

    // Handle numeric fields
    if (updates.budget) updates.budget = parseFloat(updates.budget);
    if (updates.revenue) updates.revenue = parseFloat(updates.revenue);
    if (updates.jobs) updates.jobs = parseInt(updates.jobs);
    if (updates.profitability) updates.profitability = parseFloat(updates.profitability);

    // Handle image update
    if (req.file) {
      updates.image = req.file.filename;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Projet mis à jour avec succès',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du projet',
      error: error.message
    });
  }
});

// DELETE /api/projects/:id - Delete project (Protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check if user owns the project
    if (project.porteur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Projet supprimé avec succès' });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression du projet',
      error: error.message
    });
  }
});

// GET /api/projects/similar/:id - Get similar projects
router.get('/similar/:id', async (req, res) => {
  try {
    const currentProject = await Project.findById(req.params.id);

    if (!currentProject) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Find similar projects based on sector and location
    const similarProjects = await Project.find({
      _id: { $ne: req.params.id },
      $or: [
        { sector: currentProject.sector },
        { province: currentProject.province }
      ],
      status: 'active'
    })
    .limit(3)
    .select('title location province image')
    .exec();

    const formattedSimilar = similarProjects.map(project => ({
      id: project._id,
      title: project.title,
      location: project.province,
      image: project.image ? `/uploads/projects/${project.image}` : '/api/placeholder/300/200'
    }));

    res.json(formattedSimilar);

  } catch (error) {
    console.error('Error fetching similar projects:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des projets similaires',
      error: error.message
    });
  }
});

module.exports = router;