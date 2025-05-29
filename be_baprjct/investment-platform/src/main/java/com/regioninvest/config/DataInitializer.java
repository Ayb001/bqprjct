package com.regioninvest.config;

import com.regioninvest.entity.*;
import com.regioninvest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Initialisation des données pour le catalogue de projets...");
        initializeRoles();
        initializeSectors();
        initializeUsers();
        initializeSampleProjects();
        System.out.println("✅ Initialisation terminée!");
    }

    private void initializeRoles() {
        List<String> roleNames = Arrays.asList("ADMIN", "GESTIONNAIRE", "PORTEUR", "INVESTISSEUR");

        for (String roleName : roleNames) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role(roleName);
                roleRepository.save(role);
                System.out.println("➕ Rôle créé: " + roleName);
            }
        }
    }

    private void initializeSectors() {
        if (sectorRepository.count() == 0) {
            List<String> sectors = Arrays.asList(
                    "Énergie renouvelable – Énergie solaire",
                    "Énergie renouvelable – Énergie éolienne",
                    "Agriculture",
                    "Tourisme",
                    "Technologie",
                    "Santé",
                    "Éducation",
                    "Artisanat",
                    "Industrie",
                    "Patrimoine"
            );

            for (String sectorName : sectors) {
                Sector sector = new Sector();
                sector.setName(sectorName);
                sector.setIsActive(true);
                sectorRepository.save(sector);
            }

            System.out.println("✅ " + sectors.size() + " secteurs créés");
        }
    }

    private void initializeUsers() {
        // Créer seulement des porteurs si ils n'existent pas déjà
        createUserIfNotExists("porteur1", "porteur1@example.com", "PORTEUR");
        createUserIfNotExists("porteur2", "porteur2@example.com", "PORTEUR");

        System.out.println("✅ Utilisateurs porteurs vérifiés/créés");
    }

    private void createUserIfNotExists(String username, String email, String roleName) {
        if (userRepository.findByUsername(username).isEmpty()) {
            try {
                Optional<Role> roleOpt = roleRepository.findByName(roleName);
                if (roleOpt.isPresent()) {
                    User user = new User();
                    user.setUsername(username);
                    user.setEmail(email);
                    user.setPasswordHash(passwordEncoder.encode("password123"));
                    user.setRole(roleOpt.get()); // ManyToOne relationship
                    user.setIsEnabled(true);

                    userRepository.save(user);
                    System.out.println("➕ Utilisateur créé: " + username);
                }
            } catch (Exception e) {
                System.out.println("⚠️ Erreur création utilisateur " + username + ": " + e.getMessage());
            }
        }
    }

    private void initializeSampleProjects() {
        if (projectRepository.count() == 0) {
            Optional<User> porteur1 = userRepository.findByUsername("porteur1");
            Optional<User> porteur2 = userRepository.findByUsername("porteur2");

            if (porteur1.isPresent() && porteur2.isPresent()) {
                createSampleProjects(porteur1.get(), porteur2.get());
                System.out.println("✅ 8 projets d'exemple créés");
            } else {
                System.out.println("⚠️ Impossible de créer les projets - porteurs manquants");
            }
        }
    }

    private void createSampleProjects(User porteur1, User porteur2) {
        // Projet 1: Atelier de tapis berbères
        createProject(
                "Atelier de production de tapis berbères traditionnels",
                "Création d'un atelier de production et de formation aux techniques traditionnelles de tissage des tapis berbères. Ce projet vise à préserver le patrimoine artisanal local tout en créant des opportunités économiques pour les artisans de la région.",
                "Artisanat", "Rissani", "Errachidia",
                new BigDecimal("1.4"), new BigDecimal("2.8"), 35, new BigDecimal("2.0"),
                "Préserver l'artisanat traditionnel berbère et créer des emplois locaux",
                "Techniques traditionnelles de tissage, métiers à tisser artisanaux",
                "Préservation du patrimoine culturel, développement économique local, formation des jeunes artisans",
                "• Subvention du Fonds de l'Artisanat\n• Exonération fiscale pendant 5 ans\n• Facilités d'accès au crédit artisanal",
                "Coopératives d'artisans locaux, Ministère de l'Artisanat, Centre de formation professionnelle",
                ProjectCategory.TRADITIONAL_CRAFTS, porteur1, 156
        );

        // Projet 2: Centrale solaire
        createProject(
                "Centrale solaire photovoltaïque",
                "Extension de la capacité solaire dans la région d'Ouarzazate, profitant de l'ensoleillement exceptionnel de plus de 3000 heures par an. Installation de panneaux photovoltaïques de dernière génération avec système de stockage.",
                "Énergie renouvelable – Énergie solaire", "Ouarzazate", "Ouarzazate",
                new BigDecimal("12.5"), new BigDecimal("28.7"), 45, new BigDecimal("2.3"),
                "Augmenter la capacité de production d'énergie solaire dans la région",
                "Panneaux photovoltaïques haute efficacité, système de stockage par batteries",
                "Réduction des émissions de CO2, création d'emplois verts, indépendance énergétique",
                "• Subvention du Fonds de Développement Énergétique jusqu'à 20%\n• Exonération de TVA sur équipements\n• Tarifs préférentiels raccordement réseau",
                "ONEE, MASEN, Entreprises locales du secteur énergétique",
                ProjectCategory.RENEWABLE_ENERGY, porteur2, 245
        );

        // Projet 3: Centre de formation tourisme
        createProject(
                "Centre de formation aux métiers du tourisme",
                "Création d'un centre de formation professionnelle spécialisé dans les métiers du tourisme pour répondre aux besoins croissants du secteur touristique dans la région Drâa-Tafilalet.",
                "Éducation", "Midelt", "Midelt",
                new BigDecimal("5.5"), new BigDecimal("8.2"), 30, new BigDecimal("1.5"),
                "Former les jeunes aux métiers du tourisme et améliorer la qualité des services touristiques",
                "Équipements pédagogiques modernes, simulateurs, laboratoires pratiques",
                "Amélioration des compétences locales, développement du tourisme régional",
                "• Financement OFPPT\n• Partenariat avec établissements hôteliers\n• Bourses de formation disponibles",
                "OFPPT, Conseil régional, Hôtels et restaurants partenaires",
                ProjectCategory.EDUCATION, porteur1, 123
        );

        // Projet 4: Complexe écotouristique
        createProject(
                "Complexe écotouristique dans les oasis",
                "Développement d'un complexe touristique écologique intégré dans les palmeraies, respectueux de l'environnement et valorisant le patrimoine naturel des oasis.",
                "Tourisme", "Zagora", "Zagora",
                new BigDecimal("8.3"), new BigDecimal("15.6"), 75, new BigDecimal("1.9"),
                "Développer un tourisme durable et respectueux de l'environnement",
                "Architecture bioclimatique, énergies renouvelables, gestion durable de l'eau",
                "Développement du tourisme durable, préservation des oasis, création d'emplois locaux",
                "• Subvention du Fonds de Développement Touristique\n• Label écotourisme\n• Facilités foncières zones touristiques",
                "Ministère du Tourisme, Conseil régional, Associations locales",
                ProjectCategory.TOURISM, porteur2, 198
        );

        // Projet 5: Unité de conditionnement des dattes
        createProject(
                "Unité de conditionnement des dattes",
                "Création d'une unité moderne de conditionnement et de transformation des dattes pour valoriser la production locale et améliorer la chaîne de valeur.",
                "Agriculture", "Errachidia", "Errachidia",
                new BigDecimal("4.8"), new BigDecimal("9.2"), 60, new BigDecimal("1.9"),
                "Valoriser la production locale de dattes et créer de la valeur ajoutée",
                "Équipements de tri automatique, machines de conditionnement, chambre froide",
                "Valorisation de la production agricole, création d'emplois, développement des exportations",
                "• Subvention ANDA\n• Exonération fiscale investissement agricole\n• Facilités d'exportation",
                "ANDA, Coopératives de producteurs, Exportateurs, Chambre d'agriculture",
                ProjectCategory.AGRICULTURE, porteur1, 87
        );

        // Projet 6: Clinique médicale mobile
        createProject(
                "Clinique médicale mobile pour zones rurales",
                "Mise en place d'un service de clinique mobile pour desservir les zones rurales isolées et améliorer l'accès aux soins de santé primaires dans les régions reculées.",
                "Santé", "Erfoud", "Errachidia",
                new BigDecimal("2.7"), new BigDecimal("4.1"), 18, new BigDecimal("1.5"),
                "Améliorer l'accès aux soins dans les zones rurales isolées",
                "Véhicules médicalisés équipés, équipements de diagnostic portable, télémédecine",
                "Amélioration de la santé publique, réduction des inégalités d'accès aux soins",
                "• Subvention du Ministère de la Santé\n• Partenariat avec RAMED\n• Exonération fiscale secteur santé",
                "Ministère de la Santé, Délégation provinciale, ONG médicales",
                ProjectCategory.HEALTH, porteur2, 156
        );

        // Projet 7: Réhabilitation des kasbahs
        createProject(
                "Réhabilitation des kasbahs historiques",
                "Projet de restauration et de valorisation touristique des kasbahs historiques pour préserver le patrimoine architectural et développer le tourisme culturel.",
                "Patrimoine", "Kelaat M'Gouna", "Ouarzazate",
                new BigDecimal("6.9"), new BigDecimal("10.4"), 40, new BigDecimal("1.5"),
                "Préserver le patrimoine architectural et développer le tourisme culturel",
                "Techniques de restauration traditionnelles, matériaux locaux, technologies de conservation",
                "Préservation du patrimoine, développement du tourisme culturel, valorisation de l'identité locale",
                "• Subvention du Ministère de la Culture\n• Classement patrimoine mondial UNESCO\n• Partenariats internationaux",
                "Ministère de la Culture, UNESCO, Experts en restauration, Associations patrimoine",
                ProjectCategory.HERITAGE, porteur1, 134
        );

        // Projet 8: Système d'irrigation
        createProject(
                "Système d'irrigation goutte-à-goutte",
                "Mise en place d'un système d'irrigation moderne et économe en eau pour les palmeraies, utilisant la technologie goutte-à-goutte pour optimiser l'utilisation des ressources hydriques.",
                "Agriculture", "Tinghir", "Tinghir",
                new BigDecimal("3.2"), new BigDecimal("5.8"), 25, new BigDecimal("1.8"),
                "Moderniser les systèmes d'irrigation et économiser l'eau",
                "Système d'irrigation goutte-à-goutte, capteurs d'humidité, gestion automatisée",
                "Économie d'eau, amélioration des rendements agricoles, durabilité environnementale",
                "• Subvention Plan Maroc Vert\n• Aide à la modernisation agricole\n• Facilités de crédit agricole",
                "Ministère de l'Agriculture, Office régional de développement agricole, Coopératives agricoles",
                ProjectCategory.AGRICULTURE, porteur2, 98
        );
    }

    private void createProject(String title, String description, String sectorName,
                               String location, String province, BigDecimal budget,
                               BigDecimal revenue, Integer jobs, BigDecimal profitability,
                               String goal, String technology, String impact,
                               String incentives, String partners,
                               ProjectCategory category, User porteur, Integer views) {

        Optional<Sector> sectorOpt = sectorRepository.findByName(sectorName);
        if (sectorOpt.isPresent()) {
            Project project = new Project();
            project.setTitle(title);
            project.setDescription(description);
            project.setSector(sectorOpt.get());
            project.setLocation(location);
            project.setProvince(province);
            project.setBudget(budget);
            project.setRevenue(revenue);
            project.setJobs(jobs);
            project.setProfitability(profitability);
            project.setGoal(goal);
            project.setTechnology(technology);
            project.setImpact(impact);
            project.setIncentives(incentives);
            project.setPartners(partners);
            project.setCategory(category);
            project.setStatus(ProjectStatus.ACTIVE);
            project.setPorteur(porteur);
            project.setViews(views);

            projectRepository.save(project);
        }
    }
}