import React, { useEffect } from 'react';

function Home() {
    const loadScript = (src) =>
        new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });

    useEffect(() => {
        // Add CSS reset and styles.css
        const cssReset = document.createElement('style');
        cssReset.id = 'home-css-reset';
        cssReset.textContent = `
      /* Reset all styles for home page */
      .home-isolated {
        all: unset;
        display: block;
        font-family: inherit;
      }
      
      .home-isolated * {
        all: unset;
        display: revert;
        box-sizing: border-box;
      }
      
      /* Preserve some essential styles */
      .home-isolated a { cursor: pointer; }
      .home-isolated button { cursor: pointer; }
      .home-isolated input, .home-isolated textarea { cursor: text; }
    `;
        document.head.appendChild(cssReset);

        // Load styles.css specifically
        const stylesLink = document.createElement('link');
        stylesLink.id = 'home-styles-css';
        stylesLink.rel = 'stylesheet';
        stylesLink.href = process.env.PUBLIC_URL + '/css/styles.css';
        document.head.appendChild(stylesLink);

        // Load scripts
        const loadHomeScripts = async () => {
            try {
                await loadScript(process.env.PUBLIC_URL + '/js/jquery.min.js');
                await loadScript(process.env.PUBLIC_URL + '/js/bootstrap.min.js');
                await loadScript(process.env.PUBLIC_URL + '/js/popper.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js');
                await loadScript(process.env.PUBLIC_URL + '/js/jquery.magnific-popup.js');
                await loadScript(process.env.PUBLIC_URL + '/js/morphext.min.js');
                await loadScript(process.env.PUBLIC_URL + '/js/isotope.pkgd.min.js');
                await loadScript(process.env.PUBLIC_URL + '/js/validator.min.js');
                await loadScript(process.env.PUBLIC_URL + '/js/scripts.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js');

                initializeAnimations();
            } catch (error) {
                console.error('Failed to load scripts:', error);
            }
        };

        loadHomeScripts();

        // Cleanup
        return () => {
            // Remove added CSS
            const resetStyle = document.getElementById('home-css-reset');
            const stylesCSS = document.getElementById('home-styles-css');

            if (resetStyle) resetStyle.remove();
            if (stylesCSS) stylesCSS.remove();

            // Remove scripts
            const scriptsToRemove = [
                process.env.PUBLIC_URL + '/js/jquery.min.js',
                process.env.PUBLIC_URL + '/js/bootstrap.min.js',
                process.env.PUBLIC_URL + '/js/popper.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js',
                process.env.PUBLIC_URL + '/js/jquery.magnific-popup.js',
                process.env.PUBLIC_URL + '/js/morphext.min.js',
                process.env.PUBLIC_URL + '/js/isotope.pkgd.min.js',
                process.env.PUBLIC_URL + '/js/validator.min.js',
                process.env.PUBLIC_URL + '/js/scripts.js',
                'https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js'
            ];

            scriptsToRemove.forEach(src => {
                const script = document.querySelector(`script[src="${src}"]`);
                if (script) script.remove();
            });
        };
    }, []);

    const initializeAnimations = () => {
        setTimeout(() => {
            if (typeof window.anime !== 'undefined') {
                const textWrapper = document.querySelector('#js-rotating');
                if (!textWrapper) {
                    console.error("Element #js-rotating not found");
                    return;
                }

                textWrapper.style.opacity = '0';

                const phrases = [
                    "D'INVESTISSEMENT",
                    "D'ACCOMPAGNEMENT",
                    "DE PROJETS"
                ];
                let currentPhraseIndex = 0;

                function setPhrase() {
                    const cleanText = phrases[currentPhraseIndex].trim();
                    textWrapper.innerHTML = cleanText.replace(/\S/g, "<span class='letter'>$&</span>");
                }

                function animatePhrase() {
                    setPhrase();
                    window.anime.timeline({ loop: false })
                        .add({
                            targets: '#js-rotating .letter',
                            opacity: [0, 1],
                            easing: "easeInOutQuad",
                            duration: 2250,
                            delay: (el, i) => 150 * (i + 1),
                            begin: () => {
                                textWrapper.style.opacity = '1';
                            }
                        })
                        .add({
                            targets: '#js-rotating',
                            opacity: 0,
                            duration: 1000,
                            easing: "easeOutExpo",
                            delay: 1000,
                            complete: () => {
                                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                                animatePhrase();
                            }
                        });
                }

                animatePhrase();
            }
        }, 1000);
    };

    // start the return 
    return (
        <div>


            {/* Preloader */}
            <div className="spinner-wrapper">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
            {/* end of preloader */}


            {/* Navbar */}
            <nav className="navbar navbar-expand-md navbar-dark navbar-custom fixed-top">
                {/* Image Logo */}
                <div className="container">
                    <a className="navbar-brand logo-image" href="index.html"><img src="images/logo.png" alt="alternative" /></a>

                    {/* Mobile Menu Toggle Button */}
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-awesome fas fa-bars"></span>
                        <span className="navbar-toggler-awesome fas fa-times"></span>
                    </button>
                    {/* end of mobile menu toggle button */}

                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <a className="nav-link page-scroll" href="#intro">INTRO</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link page-scroll" href="#projects">PROJECTS</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link page-scroll" href="#about">ABOUT</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link page-scroll" href="#contact">CONTACT</a>
                            </li>
                        </ul>
                        <div className="connect-button">
                            <a className="btn-solid-lg" href="/login">CONNECT</a>
                        </div>
                    </div>
                </div>
            </nav> {/* end of navbar */}
            {/* end of navbar */}



            {/* Header */}
            <header id="header" className="header">
                <video autoPlay muted loop playsInline className="bg-video">
                    <source src="images/videoplayback.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="header-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-container">

                                    <h1>PLATEFORME <span id="js-rotating">D'INVESTISSEMENT, D'ACCOMPAGNEMENT, DE PROJETS</span></h1>
                                    <p className="p-heading p-large">Une solution web pour digitaliser les parcours d’accompagnement à l’investissement et référencer les initiatives touristiques et économiques dans la région Drâa-Tafilalet.</p>
                                    <a className="btn-solid-lg page-scroll" href="#intro">DÉCOUVRIR</a>
                                </div>
                            </div> {/* end of col */}
                        </div> {/* end of row */}
                    </div> {/* end of container */}
                </div> {/* end of header-content */}
            </header> {/* end of header */}
            {/* end of header */}



            {/* Intro */}
            <div id="intro" className="basic-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="text-container">
                                <div className="section-title">INTRO</div>
                                <h2>Nous offrons certains des meilleurs services pour le développement économique de la région</h2>
                                <p>Lancer de nouveaux projets ou renforcer la position économique d’une région peut parfois être un défi complexe et exigeant.</p>
                                <p className="testimonial-text">« Notre mission ici est d’accompagner tous les acteurs de la région grâce à l’expertise de notre équipe pour favoriser la création et la croissance durable. »</p>
                                <div className="testimonial-author">Allal El BAZ - Directeur CRI - Darâa-Tafilalet</div>
                            </div> {/* end of text-container */}
                        </div> {/* end of col */}
                        <div className="col-lg-7">
                            <div className="image-container">
                                <img className="img-fluid" src="images/intro-office.jpg" alt="alternative" />
                            </div> {/* end of image-container */}
                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of basic-1 */}
            {/* end of intro */}


            {/* Description */}
            <div className="cards-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">

                            {/* Card 1*/}
                            <div className="card">
                                <span className="fa-stack">
                                    <span className="hexagon"></span>
                                    <i className="fas fa-binoculars fa-stack-1x"></i>
                                </span>
                                <div className="card-body">
                                    <h4 className="card-title">Analyse de l’environnement</h4>
                                    <p>Nous étudions les réalités économiques et sociales locales pour poser les bases d’un développement adapté et durable.</p>
                                </div>
                            </div>
                            {/* end of card */}

                            {/* Card 2*/}
                            <div className="card">
                                <span className="fa-stack">
                                    <span className="hexagon"></span>
                                    <i className="fas fa-list-alt fa-stack-1x"></i>
                                </span>
                                <div className="card-body">
                                    <h4 className="card-title">Accompagnement au développement</h4>
                                    <p>Nous concevons des plans sur mesure et accompagnons les porteurs de projets dans chaque étape stratégique.</p>
                                </div>
                            </div>
                            {/* end of card */}

                            {/* Card 3*/}
                            <div className="card">
                                <span className="fa-stack">
                                    <span className="hexagon"></span>
                                    <i className="fas fa-chart-pie fa-stack-1x"></i>
                                </span>
                                <div className="card-body">
                                    <h4 className="card-title">Exécution & Évaluation</h4>
                                    <p>Nous assurons le suivi et l’évaluation des actions pour garantir leur efficacité et ajuster les démarches si nécessaire.</p>
                                </div>
                            </div>
                            {/* end of card */}

                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of cards-1 */}
            {/* end of description */}


            {/* Services */}
            <div id="services" className="cards-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title"> Nos Accompagnements</div>
                            <h2>Trouvez l'accompagnement adapté à votre projet,<br /> quel que soit son niveau d’avancement.</h2>
                        </div> {/* end of col */}
                    </div> {/* end of row */}
                    <div className="row">
                        <div className="col-lg-12">

                            {/* Card 1*/}
                            <div className="card">
                                <div className="card-image">
                                    <img className="img-fluid" src="images/services-1.jpg" alt="alternative" />
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">🔍 Identification d’Opportunités</h3>
                                    <ul className="list-unstyled li-space-lg">
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Accès à un catalogue complet de projets multisectoriels (santé, tourisme, infrastructure, agriculture, etc.)</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Filtres avancés pour trouver les projets selon secteur, budget, localisation et critères de durabilité</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Informations détaillées sur chaque projet (retour sur investissement, impact social, création d’emplois</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* end of card */}

                            {/* Card 2*/}
                            <div className="card">
                                <div className="card-image">
                                    <img className="img-fluid" src="images/services-2.jpg" alt="alternative" />
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">🔄 Gestion des Demandes et Suivi des Projets</h3>
                                    <ul className="list-unstyled li-space-lg">
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Soumission simplifiée des demandes d’investissement et validation par les gestionnaires</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Suivi en temps réel de l’état des projets et notifications automatiques</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Workflow sécurisé avec authentification et gestion des rôles (investisseur, porteur, admin)</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* end of card */}

                            {/* Card 3*/}
                            <div className="card">
                                <div className="card-image">
                                    <img className="img-fluid" src="images/services-3.jpg" alt="alternative" />
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">📊 Tableaux de Bord et Analyses</h3>
                                    <ul className="list-unstyled li-space-lg">
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Visualisation interactive des KPIs financiers et des tendances sectorielles</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Outils d’aide à la décision basés sur les données en temps réel</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Rapports personnalisés pour investisseurs et autorités régionales</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* end of card */}

                            {/* Card 4*/}
                            <div className="card">
                                <div className="card-image">
                                    <img className="img-fluid" src="images/services-4.jpg" alt="alternative" />
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">🌐 Accompagnement et Collaboration</h3>
                                    <ul className="list-unstyled li-space-lg">
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Annuaire des partenaires régionaux pour faciliter les contacts et partenariats</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Forums et modules communautaires pour échanges et évaluations</div>
                                        </li>
                                        <li className="media">
                                            <i className="fas fa-square"></i>
                                            <div className="media-body">Assistance multilingue avec chatbot intelligent pour répondre aux questions réglementaires et techniques</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* end of card */}

                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of cards-2 */}
            {/* end of services */}


            {/* Details 1 */}
            <div id="details" className="accordion">
                <div className="area-1">
                </div>{/* end of area-1 on same line and no space between comments to eliminate margin white space */}<div className="area-2">

                    {/* Accordion */}
                    <div className="accordion-container" id="accordionOne">
                        <h2>Accélérez la croissance de votre projet et amplifiez son impact régional.</h2>
                        <div className="item">
                            <div id="headingOne">
                                <span data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" role="button">
                                    <span className="circle-numbering">1</span><span className="accordion-title">Un Accompagnement Complet</span>
                                </span>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionOne">
                                <div className="accordion-body">
                                    La Banque de Projets Drâa-Tafilalet vous guide à chaque étape : identification, structuration, validation et mise en œuvre. Elle connecte porteurs de projets, investisseurs et partenaires autour d'une vision partagée.
                                </div>
                            </div>
                        </div> {/* end of item */}

                        <div className="item">
                            <div id="headingTwo">
                                <span className="collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" role="button">
                                    <span className="circle-numbering">2</span><span className="accordion-title">Structuration Stratégique</span>
                                </span>
                            </div>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionOne">
                                <div className="accordion-body">
                                    Déposez, suivez et développez votre projet via un workflow clair et transparent, aligné sur les priorités régionales.
                                </div>
                            </div>
                        </div> {/* end of item */}

                        <div className="item">
                            <div id="headingThree">
                                <span className="collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" role="button">
                                    <span className="circle-numbering">3</span><span className="accordion-title">Visibilité & Attractivité</span>
                                </span>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionOne">
                                <div className="accordion-body">
                                    Valorisez votre projet grâce à des fiches détaillées, des visites virtuelles, des labels durables et des recommandations intelligentes.
                                </div>
                            </div>
                        </div> {/* end of item */}
                    </div> {/* end of accordion-container */}
                    {/* end of accordion */}

                </div> {/* end of area-2 */}
            </div> {/* end of accordion */}
            {/* end of details 1 */}


            {/* Details 2 */}
            <div className="tabs">
                <div className="area-1">
                    <div className="tabs-container">

                        {/* Tabs Links */}
                        <ul className="nav nav-tabs" id="ariaTabs" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="nav-tab-1" data-toggle="tab" href="#tab-1" role="tab" aria-controls="tab-1" aria-selected="true"><i className="fas fa-th"></i> Intervention</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="nav-tab-2" data-toggle="tab" href="#tab-2" role="tab" aria-controls="tab-2" aria-selected="false"><i className="fas fa-th"></i> Expertise</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="nav-tab-3" data-toggle="tab" href="#tab-3" role="tab" aria-controls="tab-3" aria-selected="false"><i className="fas fa-th"></i> Qualité</a>
                            </li>
                        </ul>
                        {/* end of tabs links */}

                        {/* Tabs Content */}
                        <div className="tab-content" id="ariaTabsContent">

                            {/* Tab */}
                            <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="tab-1">
                                <h4>Interventions au Service du Développement Régional</h4>
                                <p>La Banque de Projets Drâa-Tafilalet propose des outils innovants et adaptés pour soutenir les initiatives de développement dans tous les secteurs stratégiques. Cette section illustre la diversité et l'efficacité de nos domaines d’intervention.</p>

                                {/* Progress Bars */}
                                <div className="progress-container">
                                    <div className="title">Développement de Projets – 100%</div>
                                    <div className="progress">
                                        <div className="progress-bar first" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div className="title">Identification d’Opportunités – 76%</div>
                                    <div className="progress">
                                        <div className="progress-bar second" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div className="title">Valorisation Digitale – 90%</div>
                                    <div className="progress">
                                        <div className="progress-bar third" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div> {/* end of progress-container */}
                                {/* end of progress bars */}

                            </div> {/* end of tab-pane */}
                            {/* end of tab */}

                            {/* Tab */}
                            <div className="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="tab-2">
                                <ul className="list-unstyled li-space-lg first">
                                    <li className="media">
                                        <div className="media-bullet">1</div>
                                        <div className="media-body"><strong>High quality</strong> is on top of our list when it comes to the way we deliver the services</div>
                                    </li>
                                    <li className="media">
                                        <div className="media-bullet">2</div>
                                        <div className="media-body"><strong>Maximum impact</strong> is what we look for in our actions</div>
                                    </li>
                                    <li className="media">
                                        <div className="media-bullet">3</div>
                                        <div className="media-body"><strong>Quality standards</strong> are important but meant to be exceeded</div>
                                    </li>
                                </ul>
                                <ul className="list-unstyled li-space-lg last">
                                    <li className="media">
                                        <div className="media-bullet">4</div>
                                        <div className="media-body"><strong>We're always looking</strong> for industry leaders to help them win their market position</div>
                                    </li>
                                    <li className="media">
                                        <div className="media-bullet">5</div>
                                        <div className="media-body"><strong>Evaluation</strong> is a key aspect of this business and important</div>
                                    </li>
                                    <li className="media">
                                        <div className="media-bullet">6</div>
                                        <div className="media-body"><strong>Ethic</strong> procedures ar alwasy at the base of everything we do</div>
                                    </li>
                                </ul>
                            </div> {/* end of tab-pane */}
                            {/* end of tab */}

                            {/* Tab */}
                            <div className="tab-pane fade" id="tab-3" role="tabpanel" aria-labelledby="tab-3">
                                <p><strong>We strive to achieve</strong> 100% customer satisfaction for both types of customers: hiring companies and job seekers. Types of customers: <a className="green" href="#your-link">with huge potential</a></p>
                                <p><strong>Our goal is to help</strong> your company achieve its full potential and establish long term stability for <a className="green" href="#your-link">the stakeholders</a></p>
                                <ul className="list-unstyled li-space-lg">
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">It's easy to get a quotation, just call our office anytime</div>
                                    </li>
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">We'll get back to you with an initial estimate soon</div>
                                    </li>
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">Get ready to see results even after only 30 days</div>
                                    </li>
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">Ask for a quote and start improving your business</div>
                                    </li>
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">Just fill out the form and we'll call you right away</div>
                                    </li>
                                </ul>
                            </div> {/* end of tab-pane */}
                            {/* end of tab */}

                        </div> {/* end of tab-content */}
                        {/* end of tabs content */}

                    </div> {/* end of tabs-container */}
                </div>{/* end of area-1 on same line and no space between comments to eliminate margin white space */}<div className="area-2"></div> {/* end of area-2 */}
            </div> {/* end of tabs */}
            {/* end of details 2 */}


            {/* Testimonials */}
            <div className="slider">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h2>Découvrez les Témoignages de Nos Utilisateurs</h2>
                            <p className="p-heading">Nos porteurs de projets et investisseurs sont au cœur de notre mission. Leur succès est la meilleure preuve de l’efficacité et de l’impact de la plateforme pour le développement régional.</p>
                        </div> {/* end of col */}
                    </div> {/* end of row */}
                    <div className="row">
                        <div className="col-lg-12">

                            {/* Card Slider */}
                            <div className="slider-container">
                                <div className="swiper-container card-slider">
                                    <div className="swiper-wrapper">

                                        {/* Slide */}
                                        <div className="swiper-slide">
                                            <div className="card">
                                                <img className="card-image" src="images/testimonial-1.jpg" alt="alternative" />
                                                <div className="card-body">
                                                    <div className="testimonial-text">Ma démarche a été structurée grâce à la plateforme, et a attiré les bons partenaires pour créer un réel impact local.</div>
                                                    <div className="testimonial-author">Youssef El Amrani – Porteur de Projet</div>
                                                </div>
                                            </div>
                                        </div> {/* end of swiper-slide */}
                                        {/* end of slide */}

                                        {/* Slide */}
                                        <div className="swiper-slide">
                                            <div className="card">
                                                <img className="card-image" src="images/testimonial-2.jpg" alt="alternative" />
                                                <div className="card-body">
                                                    <div className="testimonial-text">La plateforme m’a aidé à trouver des projets fiables et à investir durablement à Drâa-Tafilalet. </div>
                                                    <div className="testimonial-author">Karim El Fassi – Investisseur</div>
                                                </div>
                                            </div>
                                        </div> {/* end of swiper-slide */}
                                        {/* end of slide */}

                                        {/* Slide */}
                                        <div className="swiper-slide">
                                            <div className="card">
                                                <img className="card-image" src="images/testimonial-3.jpg" alt="alternative" />
                                                <div className="card-body">
                                                    <div className="testimonial-text">Le directeur intervient directement pour guider les porteurs de projets.</div>
                                                    <div className="testimonial-author">Rachid Smail – Développeur</div>
                                                </div>
                                            </div>
                                        </div> {/* end of swiper-slide */}
                                        {/* end of slide */}

                                        {/* Slide */}
                                        <div className="swiper-slide">
                                            <div className="card">
                                                <img className="card-image" src="images/testimonial-4.jpg" alt="alternative" />
                                                <div className="card-body">
                                                    <div className="testimonial-text">La plateforme m’a aidée à découvrir de nouveaux projets et à soutenir le développement de la région.</div>
                                                    <div className="testimonial-author">Samira El Fassi – Porteuse de Projet</div>
                                                </div>
                                            </div>
                                        </div> {/* end of swiper-slide */}
                                        {/* end of slide */}

                                        {/* Slide */}
                                        <div className="swiper-slide">
                                            <div className="card">
                                                <img className="card-image" src="images/testimonial-5.jpg" alt="alternative" />
                                                <div className="card-body">
                                                    <div className="testimonial-text">je recommande cette plateforme à tous les porteurs de projets.</div>
                                                    <div className="testimonial-author">Aghjedim Ayoub - Manager</div>
                                                </div>
                                            </div>
                                        </div> {/* end of swiper-slide */}
                                        {/* end of slide */}

                                        {/* Slide */}
                                        <div className="swiper-slide">
                                            <div className="card">
                                                <img className="card-image" src="images/testimonial-6.jpg" alt="alternative" />
                                                <div className="card-body">
                                                    <div className="testimonial-text">Un outil essentiel pour soutenir les projets de Drâa-Tafilalet.</div>
                                                    <div className="testimonial-author">Lina Bensalah – Gestionnaire de Projets</div>
                                                </div>
                                            </div>
                                        </div> {/* end of swiper-slide */}
                                        {/* end of slide */}

                                    </div> {/* end of swiper-wrapper */}

                                    {/* Add Arrows */}
                                    <div className="swiper-button-next"></div>
                                    <div className="swiper-button-prev"></div>
                                    {/* end of add arrows */}

                                </div> {/* end of swiper-container */}
                            </div> {/* end of sliedr-container */}
                            {/* end of card slider */}

                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of slider */}
            {/* end of testimonials */}


            {/* Projects */}
            <div id="projects" className="filter">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title"> Projets</div>
                            <h2>Aperçu des Projets Régionaux</h2>
                        </div> {/* end of col */}
                    </div> {/* end of row */}
                    <div className="row">
                        <div className="col-lg-12">
                            {/* Filter */}
                            <div className="button-group filters-button-group">
                                <a className="button is-checked" data-filter="*"><span>Afficher tout</span></a>
                                <a className="button" data-filter=".design"><span>MINES</span></a>
                                <a className="button" data-filter=".development"><span>TOURISME</span></a>
                                <a className="button" data-filter=".marketing"><span>ENERGIE</span></a>
                                <a className="button" data-filter=".seo"><span>Industrie créative</span></a>
                            </div> {/* end of button group */}
                            <div className="grid">
                                <div className="element-item development">
                                    <a className="popup-with-move-anim" href="#project-1"><div className="element-item-overlay"><span>Traitement de Barite</span></div><img src="images/project-1.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item development">
                                    <a className="popup-with-move-anim" href="#project-2"><div className="element-item-overlay"><span>Cartographie Géologique</span></div><img src="images/project-2.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item design development marketing">
                                    <a className="popup-with-move-anim" href="#project-3"><div className="element-item-overlay"><span>Écolodge – Vallée du Ziz</span></div><img src="images/project-3.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item design development marketing">
                                    <a className="popup-with-move-anim" href="#project-4"><div className="element-item-overlay"><span>Restauration d’une Kasbah</span></div><img src="images/project-4.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item design development marketing seo">
                                    <a className="popup-with-move-anim" href="#project-5"><div className="element-item-overlay"><span>Centrale Solaire</span></div><img src="images/project-5.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item design marketing seo">
                                    <a className="popup-with-move-anim" href="#project-6"><div className="element-item-overlay"><span>Éoliennes Communautaires</span></div><img src="images/project-6.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item design marketing">
                                    <a className="popup-with-move-anim" href="#project-7"><div className="element-item-overlay"><span>Atelier Artisanat Numérique</span></div><img src="images/project-7.jpg" alt="alternative" /></a>
                                </div>
                                <div className="element-item design marketing">
                                    <a className="popup-with-move-anim" href="#project-8"><div className="element-item-overlay"><span>Festival Culturel Régional</span></div><img src="images/project-8.jpg" alt="alternative" /></a>
                                </div>
                            </div> {/* end of grid */}
                            {/* end of filter */}

                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of filter */}
            {/* end of projects */}


            {/* Project Lightboxes */}
            {/* Lightbox */}
            <div id="project-1" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-1.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Traitement de Barite</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Mines</h6>
                        <p>Objectif : Mettre en place une unité locale de traitement de barite pour augmenter la valeur ajoutée dans la région.</p>
                        <p>Résumé :<br />Le projet vise à exploiter les gisements disponibles à Drâa-Tafilalet et à transformer la matière première sur place afin de limiter les exportations brutes et créer de l’emploi local.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Ce projet est une vraie opportunité pour dynamiser la filière minière locale.</p>
                            <p className="testimonial-author">M. Idrissi, directeur</p>
                        </div>
                        <a className="btn-outline-reg mfp-close as-button" href="#projects">RETOUR</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-2" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-2.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Cartographie Géologique</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Mines</h6>
                        <p>Objectif : Réaliser des études géologiques approfondies pour identifier de nouveaux gisements miniers.</p>
                        <p>Résumé :<br />Le projet consiste à mener une campagne de prospection géologique dans les zones prometteuses de la région. Il vise à améliorer la connaissance du sous-sol, attirer des investisseurs et planifier un développement minier maîtrisé.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Un projet stratégique pour révéler le potentiel minier encore inexploité de Drâa-Tafilalet.</p>
                            <p className="testimonial-author">– Y. Benomar, responsable technique</p>
                        </div>
                        <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-3" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-3.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Écolodge – Vallée du Ziz</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Tourisme durable</h6>
                        <p>Objectif : Créer un hébergement écoresponsable valorisant les paysages naturels et les traditions locales.</p>
                        <p>Résumé :<br />Projet d’écotourisme intégrant des matériaux locaux, des pratiques durables et l’implication des habitants.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Tourisme responsable et création d’emplois locaux.</p>
                            <p className="testimonial-author">– S. Ouakrim</p>
                        </div>
                        <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-4" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-4.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Restauration d’une Kasbah</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Tourisme patrimonial</h6>
                        <p>Objectif : Réhabiliter une kasbah traditionnelle pour en faire un lieu culturel intégré à un circuit touristique.</p>
                        <p>Résumé :<br />Restauration, création d’un espace muséal, et formation de guides locaux pour valoriser le patrimoine.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Préservation du patrimoine et développement local.</p>
                            <p className="testimonial-author">– F. El Mouden</p>
                        </div>
                        <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-5" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-5.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Centrale Solaire </h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Énergies renouvelables</h6>
                        <p>Objectif : Installer une centrale photovoltaïque pour alimenter localement en énergie propre et durable.</p>
                        <p>Résumé :<br />Projet visant à réduire la dépendance aux énergies fossiles et à favoriser l’autonomie énergétique de la région.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Énergie propre pour un avenir durable.</p>
                            <p className="testimonial-author">– A. El Ghazali</p>
                        </div>
                        <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-6" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-6.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Éoliennes Communautaires</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Énergie éolienne</h6>
                        <p>Objectif : Mettre en place des parcs éoliens à petite échelle pour fournir de l’électricité aux zones rurales.</p>
                        <p>Résumé :<br />Initiative locale soutenant l’accès à l’énergie renouvelable et la création d’emplois verts.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Un souffle nouveau pour la région.</p>
                            <p className="testimonial-author">– M. Benbrahim</p>
                        </div>
                        <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-7" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-7.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Atelier Artisanat Numérique</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Industrie créative</h6>
                        <p>Objectif : Créer un espace dédié à la production et à la valorisation de l’artisanat local mêlant techniques traditionnelles et outils numériques.</p>
                        <p>Résumé :<br />Projet favorisant l’innovation tout en préservant le savoir-faire local et en créant des opportunités pour les jeunes créateurs.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text"> Innovation au service de la tradition.</p>
                            <p className="testimonial-author">– L. El Amrani</p>
                        </div>
                        <a className="btn-solid-reg" href="#your-link">DETAILS</a> <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}

            {/* Lightbox */}
            <div id="project-8" className="lightbox-basic zoom-anim-dialog mfp-hide">
                <div className="row">
                    <button title="Close (Esc)" type="button" className="mfp-close x-button">×</button>
                    <div className="col-lg-8">
                        <img className="img-fluid" src="images/project-8.jpg" alt="alternative" />
                    </div> {/* end of col */}
                    <div className="col-lg-4">
                        <h3>Festival Culturel Régional</h3>
                        <hr className="line-heading" />
                        <h6>Secteur : Événementiel et arts vivants</h6>
                        <p>Objectif : Organiser un festival annuel mettant en avant les arts, la musique et les cultures locales pour dynamiser le tourisme culturel.</p>
                        <p>Résumé :<br />Une initiative pour valoriser la richesse culturelle et créer un rendez-vous incontournable pour les habitants et visiteurs.</p>
                        <div className="testimonial-container">
                            <p className="testimonial-text">Célébrer la culture et renforcer le lien social.</p>
                            <p className="testimonial-author">– S. Zahraoui</p>
                        </div>
                        <a className="btn-solid-reg" href="#your-link">DETAILS</a> <a className="btn-outline-reg mfp-close as-button" href="#projects">BACK</a>
                    </div> {/* end of col */}
                </div> {/* end of row */}
            </div> {/* end of lightbox-basic */}
            {/* end of lightbox */}
            {/* end of project lightboxes */}


            {/* About */}
            <div id="about" className="counter">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-xl-6">
                            <div className="image-container">
                                <img className="img-fluid" src="images/about.jpg" alt="Banque de Projets" />
                            </div> {/* end of image-container */}
                        </div> {/* end of col */}
                        <div className="col-lg-7 col-xl-6">
                            <div className="text-container">
                                <div className="section-title">À PROPOS</div>
                                <h2>Une Plateforme au Service du Développement Régional</h2>
                                <p>
                                    La Banque de Projets du CRI Drâa-Tafilalet accompagne les initiatives locales en facilitant la connexion entre porteurs de projets, investisseurs et partenaires. Elle soutient une croissance durable, inclusive et ancrée dans les réalités de la région.
                                </p>
                                <ul className="list-unstyled li-space-lg">
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">Favoriser l’investissement local et national dans tous les secteurs clés</div>
                                    </li>
                                    <li className="media">
                                        <i className="fas fa-square"></i>
                                        <div className="media-body">Valoriser les projets porteurs d’impact social, culturel et environnemental</div>
                                    </li>
                                </ul>

                                {/* Counter */}
                                <div id="counter">
                                    <div className="cell">
                                        <div className="counter-value number-count" data-count="30">1</div>
                                        <div className="counter-info">Projets<br />Référencés</div>
                                    </div>
                                    <div className="cell">
                                        <div className="counter-value number-count" data-count="10">1</div>
                                        <div className="counter-info">Porteurs<br />Accompagnés</div>
                                    </div>
                                    <div className="cell">
                                        <div className="counter-value number-count" data-count="6">1</div>
                                        <div className="counter-info">Secteurs<br />Couverts</div>
                                    </div>
                                </div>
                                {/* end of counter */}


                            </div> {/* end of text-container */}
                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of counter */}
            {/* end of about */}

            {/* Footer */}
            <div className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="text-container about">
                                <h4>Few Words About Aria</h4>
                                <p className="white">We're passionate about delivering the best business growth services for companies just starting out as startups or industry players that have established their market position a long tima ago.</p>
                            </div> {/* end of text-container */}
                        </div> {/* end of col */}
                        <div className="col-md-2">
                            <div className="text-container">
                                <h4>Links</h4>
                                <ul className="list-unstyled li-space-lg white">
                                    <li>
                                        <a className="white" href="#your-link">startupguide.com</a>
                                    </li>
                                    <li>
                                        <a className="white" href="terms-conditions.html">Terms & Conditions</a>
                                    </li>
                                    <li>
                                        <a className="white" href="privacy-policy.html">Privacy Policy</a>
                                    </li>
                                </ul>
                            </div> {/* end of text-container */}
                        </div> {/* end of col */}
                        <div className="col-md-2">
                            <div className="text-container">
                                <h4>Tools</h4>
                                <ul className="list-unstyled li-space-lg">
                                    <li>
                                        <a className="white" href="#your-link">businessgrowth.com</a>
                                    </li>
                                    <li>
                                        <a className="white" href="#your-link">influencers.com</a>
                                    </li>
                                    <li className="media">
                                        <a className="white" href="#your-link">optimizer.net</a>
                                    </li>
                                </ul>
                            </div> {/* end of text-container */}
                        </div> {/* end of col */}
                        <div className="col-md-2">
                            <div className="text-container">
                                <h4>Partners</h4>
                                <ul className="list-unstyled li-space-lg">
                                    <li>
                                        <a className="white" href="#your-link">unicorns.com</a>
                                    </li>
                                    <li>
                                        <a className="white" href="#your-link">staffmanager.com</a>
                                    </li>
                                    <li>
                                        <a className="white" href="#your-link">association.gov</a>
                                    </li>
                                </ul>
                            </div> {/* end of text-container */}
                        </div> {/* end of col */}
                    </div> {/* end of row */}
                </div> {/* end of container */}
            </div> {/* end of footer */}
            {/* end of footer */}


            {/* Copyright */}
            <div className="copyright">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <p className="p-small">Copyright © 2020 <a href="https://inovatik.com">Template by Inovatik</a></p>
                        </div> {/* end of col */}
                    </div> {/* enf of row */}
                </div> {/* end of container */}
            </div> {/* end of copyright */}
            {/* end of copyright */}

        </div>
    )
}

export default Home
