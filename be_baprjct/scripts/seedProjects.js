const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
require('dotenv').config();

// Sample projects data that matches your React component
const sampleProjects = [
  {
    title: "Atelier de production de tapis berbères traditionnels",
    description: "Création d'un atelier de production et de formation aux techniques traditionnelles de tissage des tapis berbères. Ce projet vise à préserver le patrimoine artisanal local tout en créant des opportunités économiques pour les artisans de la région.",
    sector: "Artisanat",
    location: "Rissani",
    province: "Errachidia",
    budget: 1.4,
    revenue: 2.8,
    jobs: 35,
    profitability: 2.0,
    goal: "Préserver l'artisanat traditionnel berbère et créer des emplois locaux",
    technology: "Techniques traditionnelles de tissage, métiers à tisser artisanaux",
    impact: "Préservation du patrimoine culturel, développement économique local, formation des jeunes artisans",
    incentives: "Subvention du Fonds de l'Artisanat\nExonération fiscale pendant 5 ans\nFacilités d'accès au crédit artisanal",
    partners: "Coopératives d'artisans locaux, Ministère de l'Artisanat, Centre de formation professionnelle",
    category: "traditional-crafts",
    status: "active"
  },
  {
    title: "Centrale solaire photovoltaïque",
    description: "Extension de la capacité solaire dans la région d'Ouarzazate, profitant de l'ensoleillement exceptionnel de plus de 3000 heures par an. Installation de panneaux photovoltaïques de dernière génération avec système de stockage.",
    sector: "Énergie renouvelable – Énergie solaire",
    location: "Ouarzazate",
    province: "Ouarzazate",
    budget: 12.5,
    revenue: 28.7,
    jobs: 45,
    profitability: 2.3,
    goal: "Augmenter la capacité de production d'énergie solaire dans la région",
    technology: "Panneaux photovoltaïques haute efficacité, système de stockage par batteries",
    impact: "Réduction des émissions de CO2, création d'emplois verts, indépendance énergétique",
    incentives: "Subvention du Fonds de Développement Énergétique jusqu'à 20%\nExonération de TVA sur équipements\nTarifs préférentiels raccordement réseau",
    partners: "ONEE, MASEN, Entreprises locales du secteur énergétique",
    category: "renewable-energy",
    status: "active"
  },
  {
    title: "Centre de formation aux métiers du tourisme",
    description: "Création d'un centre de formation professionnelle spécialisé dans les métiers du tourisme pour répondre aux besoins croissants du secteur touristique dans la région Drâa-Tafilalet.",
    sector: "Éducation",
    location: "Midelt",
    province: "Midelt",
    budget: 5.5,
    revenue: 8.2,
    jobs: 30,
    profitability: 1.5,
    goal: "Former les jeunes aux métiers du tourisme et améliorer la qualité des services touristiques",
    technology: "Équipements pédagogiques modernes, simulateurs, laboratoires pratiques",
    impact: "Amélioration des compétences locales, développement du tourisme régional",
    incentives: "Financement OFPPT\nPartenariat avec établissements hôteliers\nBourses de formation disponibles",
    partners: "OFPPT, Conseil régional, Hôtels et restaurants partenaires",
    category: "education",
    status: "active"
  },
  {
    title: "Clinique médicale mobile pour zones rurales",
    description: "Mise en place d'un service de clinique mobile pour desservir les zones rurales isolées et améliorer l'accès aux soins de santé primaires dans les régions reculées.",
    sector: "Santé",
    location: "Erfoud",
    province: "Errachidia",
    budget: 2.7,
    revenue: 4.1,
    jobs: 18,
    profitability: 1.5,
    goal: "Améliorer l'accès aux soins dans les zones rurales isolées",
    technology: "Véhicules médicalisés équipés, équipements de diagnostic portable, télémédecine",
    impact: "Amélioration de la santé publique, réduction des inégalités d'accès aux soins",
    incentives: "Subvention du Ministère de la Santé\nPartenariat avec RAMED\nExonération fiscale secteur santé",
    partners: "Ministère de la Santé, Délégation provinciale, ONG médicales",
    category: "health",
    status: "active"
  },
  {
    title: "Complexe écotouristique dans les oasis",
    description: "Développement d'un complexe touristique écologique intégré dans les palmeraies, respectueux de l'environnement et valorisant le patrimoine naturel des oasis.",
    sector: "Tourisme",
    location: "Zagora",
    province: "Zagora",
    budget: 8.3,
    revenue: 15.6,
    jobs: 75,
    profitability: 1.9,
    goal: "Développer un tourisme durable et respectueux de l'environnement",
    technology: "Architecture bioclimatique, énergies renouvelables, gestion durable de l'eau",
    impact: "Développement du tourisme durable, préservation des oasis, création d'emplois locaux",
    incentives: "Subvention du Fonds de Développement Touristique\nLabel écotourisme\nFacilités foncières zones touristiques",
    partners: "Ministère du Tourisme, Conseil régional, Associations locales",
    category: "tourism",
    status: "active"
  },
  {
    title: "Réhabilitation des kasbahs historiques",
    description: "Projet de restauration et de valorisation touristique des kasbahs historiques pour préserver le patrimoine architectural et développer le tourisme culturel.",
    sector: "Patrimoine",
    location: "Kelaat M'Gouna",
    province: "Ouarzazate",
    budget: 6.9,
    revenue: 10.4,
    jobs: 40,
    profitability: 1.5,
    goal: "Préserver le patrimoine architectural et développer le tourisme culturel",
    technology: "Techniques de restauration traditionnelles, matériaux locaux, technologies de conservation",
    impact: "Préservation du patrimoine, développement du tourisme culturel, valorisation de l'identité locale",
    incentives: "Subvention du Ministère de la Culture\nClassement patrimoine mondial UNESCO\nPartenariats internationaux",
    partners: "Ministère de la Culture, UNESCO, Experts en restauration, Associations patrimoine",
    category: "heritage",
    status: "active"
  },
  {
    title: "Système d'irrigation goutte-à-goutte",
    description: "Mise en place d'un système d'irrigation moderne et économe en eau pour les palmeraies, utilisant la technologie goutte-à-goutte pour optimiser l'utilisation des ressources hydriques.",
    sector: "Agriculture",
    location: "Tinghir",
    province: "Tinghir",
    budget: 3.2,
    revenue: 5.8,
    jobs: 25,
    profitability: 1.8,
    goal: "Moderniser les systèmes d'irrigation et économiser l'eau",
    technology: "Système d'irrigation goutte-à-goutte, capteurs d'humidité, gestion automatisée",
    impact: "Économie d'eau, amélioration des rendements agricoles, durabilité environnementale",
    incentives: "Subvention Plan Maroc Vert\nAide à la modernisation agricole\nFacilités de crédit agricole",
    partners: "Ministère de l'Agriculture, Office régional de développement agricole, Coopératives agricoles",
    category: "agriculture",
    status: "active"
  },
  {
    title: "Unité de conditionnement des dattes",
    description: "Création d'une unité moderne de conditionnement et de transformation des dattes pour valoriser la production locale et améliorer la chaîne de valeur.",
    sector: "Agriculture",
    location: "Errachidia",
    province: "Errachidia",
    budget: 4.8,
    revenue: 9.2,
    jobs: 60,
    profitability: 1.9,
    goal: "Valoriser la production locale de dattes et créer de la valeur ajoutée",
    technology: "Équipements de tri automatique, machines de conditionnement, chambre froide",
    impact: "Valorisation de la production agricole, création d'emplois, développement des exportations",
    incentives: "Subvention ANDA\nExonération fiscale investissement agricole\nFacilités d'exportation",
    partners: "ANDA, Coopératives de producteurs, Exportateurs, Chambre d'agriculture",
    category: "agriculture",
    status: "active"
  }
];

async function seedProjects() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banque_projets');
    console.log('✅ Connecté à MongoDB');

    // Check if we have users to assign projects to
    const users = await User.find({ role: 'porteur' }).limit(3);

    if (users.length === 0) {
      console.log('⚠️  Aucun utilisateur porteur trouvé. Créez d\'abord des utilisateurs.');

      // Create a default porteur if none exists
      const bcrypt = require('bcryptjs');
      const defaultPorteur = new User({
        name: 'Porteur Demo',
        email: 'porteur@demo.com',
        password: await bcrypt.hash('password123', 12),
        role: 'porteur',
        phone: '+212600000000'
      });

      await defaultPorteur.save();
      users.push(defaultPorteur);
      console.log('✅ Utilisateur porteur par défaut créé');
    }

    // Clear existing projects
    await Project.deleteMany({});
    console.log('🗑️  Projets existants supprimés');

    // Add porteur to each project and save
    const projectsWithPorteur = sampleProjects.map((project, index) => ({
      ...project,
      porteur: users[index % users.length]._id, // Distribute projects among available users
      views: Math.floor(Math.random() * 500) + 50, // Random views between 50-550
      publishTime: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` // Random time between 8:00-19:59
    }));

    const createdProjects = await Project.insertMany(projectsWithPorteur);

    console.log(`✅ ${createdProjects.length} projets créés avec succès`);

    // Display summary
    console.log('\n📊 Résumé des projets créés:');
    const summary = await Project.aggregate([
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    summary.forEach(item => {
      console.log(`   ${item._id}: ${item.count} projet(s) - ${item.totalBudget}M Dhs`);
    });

    console.log(`\n💰 Investment total: ${sampleProjects.reduce((sum, p) => sum + p.budget, 0)}M Dhs`);
    console.log(`👥 Emplois totaux: ${sampleProjects.reduce((sum, p) => sum + p.jobs, 0)}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des projets:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Connexion fermée');
    process.exit(0);
  }
}

// Run the seeder
if (require.main === module) {
  seedProjects();
}

module.exports = { sampleProjects, seedProjects };