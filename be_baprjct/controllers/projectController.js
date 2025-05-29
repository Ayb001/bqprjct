const Project = require('../models/Project');
const fs = require('fs').promises;
const path = require('path');

class ProjectController {
  // Get all projects with filters
  static async getAllProjects(req, res) {
    try {
      const {
        page = 1,
        limit = 6,
        search = '',
        province = '',
        sector = '',
        budgetRange = '',
        status = 'active',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter object
      let filter = { status };

      // Search functionality
      if (search.trim()) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      // Province filter
      if (province && province !== 'Toutes les provinces') {
        filter.province = province;
      }

      // Sector filter
      if (sector && sector !== 'Tous les secteurs') {
        filter.sector = { $regex: sector, $options: 'i' };
      }

      // Budget range filter
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

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const projects = await Project.find(filter)
        .populate('porteur', 'name email')
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean()
        .exec();

      // Get total count
      const total = await Project.countDocuments(filter);

      // Format projects for response
      const formattedProjects = projects.map(project => ({
        id: project._id,
        title: project.title,
        location: `${project.location}, ${project.province}`,
        sector: project.sector,
        budget: `${project.budget} M Dhs`,
        jobs: project.jobs,
        image: project.image ? `/uploads/projects/${project.image}` : '/api/placeholder/400/250',
        description: project.description.length > 150
          ? project.description.substring(0, 150) + '...'
          : project.description,
        category: project.category || 'general',
        views: project.views,
        createdAt: project.createdAt,
        porteurName: project.porteur?.name || 'Anonyme'
      }));

      const response = {
        success: true,
        data: {
          projects: formattedProjects,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalProjects: total,
            hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1,
            limit: parseInt(limit)
          },
          filters: {
            provinces: ['Toutes les provinces', 'Ouarzazate', 'Errachidia', 'Midelt', 'Tinghir', 'Zagora'],
            sectors: [
              'Tous les secteurs',
              'Agriculture',
              'Tourisme',
              'Artisanat',
              'Énergie renouvelable',
              'Santé',
              'Éducation',
              'Patrimoine',
              'Technologie',
              'Industrie'
            ],
            budgetRanges: ['Tous les budgets', '< 2M Dhs', '2-5M Dhs', '5-10M Dhs', '> 10M Dhs']
          }
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Error in getAllProjects:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des projets',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
      });
    }
  }

  // Get single project by ID
  static async getProjectById(req, res) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id)
        .populate('porteur', 'name email phone')
        .lean()
        .exec();

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      // Increment views (fire and forget)
      Project.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

      // Format project for response
      const formattedProject = {
        id: project._id,
        title: project.title,
        description: project.description,
        sector: project.sector,
        location: `${project.location}, ${project.province}`,
        province: project.province,
        budget: project.budget,
        revenue: project.revenue,
        jobs: project.jobs,
        profitability: project.profitability,
        goal: project.goal,
        technology: project.technology,
        impact: project.impact,
        incentives: project.incentives ? project.incentives.split('\n').filter(Boolean) : [],
        partners: project.partners,
        image: project.image ? `/uploads/projects/${project.image}` : '/api/placeholder/800/400',
        publishTime: project.publishTime,
        views: project.views + 1, // Include the incremented view
        publishedDate: project.createdAt.toISOString().split('T')[0],
        porteur: project.porteur,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,

        // Formatted data for frontend components
        economicData: [
          {
            label: 'Investissement',
            value: `${project.budget} M Dhs`,
            icon: 'DollarSign',
            rawValue: project.budget
          },
          {
            label: 'Chiffre d\'affaires',
            value: `${project.revenue} M Dhs`,
            icon: 'TrendingUp',
            rawValue: project.revenue
          },
          {
            label: 'Emplois',
            value: project.jobs.toString(),
            icon: 'Users',
            rawValue: project.jobs
          },
          {
            label: 'Ratio de rentabilité',
            value: project.profitability.toString(),
            icon: 'TrendingUp',
            rawValue: project.profitability
          }
        ],

        keyInfo: {
          location: `${project.location}, ${project.province}`,
          sector: project.sector,
          investment: `${project.budget} millions Dhs`,
          expectedJobs: `${project.jobs} emplois`,
          expectedRevenue: `${project.revenue} millions Dhs`
        }
      };

      res.json({
        success: true,
        data: formattedProject
      });

    } catch (error) {
      console.error('Error in getProjectById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du projet',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
      });
    }
  }

  // Get similar projects
  static async getSimilarProjects(req, res) {
    try {
      const { id } = req.params;
      const { limit = 3 } = req.query;

      const currentProject = await Project.findById(id).lean();

      if (!currentProject) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      // Find similar projects based on sector, then province
      const similarProjects = await Project.find({
        _id: { $ne: id },
        status: 'active',
        $or: [
          { sector: currentProject.sector },
          { province: currentProject.province },
          { category: currentProject.category }
        ]
      })
      .limit(parseInt(limit))
      .select('title location province image sector views createdAt')
      .sort({ views: -1, createdAt: -1 })
      .lean()
      .exec();

      const formattedSimilar = similarProjects.map(project => ({
        id: project._id,
        title: project.title,
        location: `${project.location}, ${project.province}`,
        sector: project.sector,
        image: project.image ? `/uploads/projects/${project.image}` : '/api/placeholder/300/200',
        views: project.views
      }));

      res.json({
        success: true,
        data: formattedSimilar
      });

    } catch (error) {
      console.error('Error in getSimilarProjects:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des projets similaires',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
      });
    }
  }

  // Get project statistics
  static async getProjectStats(req, res) {
    try {
      const stats = await Project.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            totalInvestment: { $sum: '$budget' },
            totalJobs: { $sum: '$jobs' },
            totalRevenue: { $sum: '$revenue' },
            avgProfitability: { $avg: '$profitability' },
            totalViews: { $sum: '$views' }
          }
        }
      ]);

      const sectorStats = await Project.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$sector',
            count: { $sum: 1 },
            totalInvestment: { $sum: '$budget' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const provinceStats = await Project.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$province',
            count: { $sum: 1 },
            totalInvestment: { $sum: '$budget' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        data: {
          general: stats[0] || {
            totalProjects: 0,
            totalInvestment: 0,
            totalJobs: 0,
            totalRevenue: 0,
            avgProfitability: 0,
            totalViews: 0
          },
          bySector: sectorStats,
          byProvince: provinceStats
        }
      });

    } catch (error) {
      console.error('Error in getProjectStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
      });
    }
  }

  // Search projects
  static async searchProjects(req, res) {
    try {
      const { q, limit = 10 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.json({
          success: true,
          data: []
        });
      }

      const projects = await Project.find({
        status: 'active',
        $or: [
          { title: { $regex: q.trim(), $options: 'i' } },
          { description: { $regex: q.trim(), $options: 'i' } },
          { sector: { $regex: q.trim(), $options: 'i' } },
          { location: { $regex: q.trim(), $options: 'i' } },
          { province: { $regex: q.trim(), $options: 'i' } }
        ]
      })
      .limit(parseInt(limit))
      .select('title sector location province budget')
      .sort({ views: -1 })
      .lean()
      .exec();

      const results = projects.map(project => ({
        id: project._id,
        title: project.title,
        sector: project.sector,
        location: `${project.location}, ${project.province}`,
        budget: `${project.budget} M Dhs`
      }));

      res.json({
        success: true,
        data: results
      });

    } catch (error) {
      console.error('Error in searchProjects:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
      });
    }
  }
}

module.exports = ProjectController;