import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Automatically detects browser language
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes
    },
    resources: {
      en: {
        translation: {
          // ----- Home page -------
          whoWeAreBtn: "Who We Are",
          contactUsBtn: "Contact Us",
          seasonMessage:
            "Love served fresh. From intimate dinners to grand wedding celebrations — this season is made to be savored.",

          // ----- Welcome Banner -------
          welcomeTo: "Welcome to",
          lmLtd: "LM-Ltd Services",
          welcomeToSubt:
            "Explore our mission, values, and what makes us different.",

          // ----- Services Promo -------
          product1: "Wedding Salon",
          product2: "Dinner",
          product3: "Buffet",
          product4: "Chemistry Tutor",
          product5: "Wedding",
          product6: "Beverage",
          promoText1: "Buy for Half Price",
          promoText2: "Select from our Products List",
          learnMoreBtn: "Learn More",

          // ---------- Card Sets -----------
          "button.explore": "Explore",
          "card.left.🍹 Beverages Service": "🍹 Beverages Service",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet for You",
          "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Made-to-Order Meals",
          "card.left.💍 Wedding Events": "💍 Wedding Events",
          "card.right.📚 Tutoring": "📚 Tutoring",
          "card.right.🍔 Hamburgers": "🍔 Hamburgers",

          // ----------- Services Page ---------------
          services: {
            title: "Our Services",
            empty: "No services available.",
            loading: "Loading services...",
            error: "Failed to load services. Please try again later.",
          },
          season: {
            message:
              "Love served fresh. From intimate dinners to grand wedding celebrations—this season is made to be savored.",
          },
          footer: {
            phone: "Tel. : (+244) 222 022 351; (+244) 975 957 847",
            rights: "All rights reserved.",
          },

          // ---------- Services Available -----------
          // Buttons
          "button.request": "Request",
          "button.schedule": "Schedule",
          "button.share": "Share",
          "button.submit": "Submit",
          "button.cancel": "Cancel",

          // Price label (used if you want a localized label before/after price)
          "label.price": "$ {{price}}",

          // Services (use DB title as key fallback)
          "service.🍹 Beverages Service.title": "🍹 Beverages Service",
          "service.🍹 Beverages Service.description":
            "Refreshing beverages for events and gatherings.",
          "service.🍽️ Buffet for You.title": "🍽️ Buffet for You",
          "service.🍽️ Buffet for You.description":
            "Delicious self-serve meals for events and gatherings.",
          "service.👨‍🍳 Made-to-Order Meals.title": "👨‍🍳 Made-to-Order Meals",
          "service.👨‍🍳 Made-to-Order Meals.description":
            "Custom chef-prepared meals tailored to your event.",
          "service.💍 Wedding Events.title": "💍 Wedding Events",
          "service.💍 Wedding Events.description":
            "Elegant planning and coordination for unforgettable weddings.",
          "service.📚 Tutoring.title": "📚 Tutoring",
          "service.📚 Tutoring.description":
            "Personalized academic support for students.",
          "service.🍔 Hamburgers.title": "🍔 Hamburgers",
          "service.🍔 Hamburgers.description": "Classic burgers made to order.",
          "service.🎉 Party Salon.title": "🎉 Party Salon",
          "service.🎉 Party Salon.description":
            "A party salon is a vibrant space designed for celebration birthdays, b…",
          "service.🍹 Retail Beverages.title": "🍹 Retail Beverages",
          "service.🍹 Retail Beverages.description":
            "Offering a wide variety of drinks and refreshments.",
          "service.🍽️ Buffet services.title": "🍽️ Buffet services",
          "service.🍽️ Buffet services.description":
            'Delicious self-serve meals for events and gatherings "per person."',
        },
      },
      pt: {
        translation: {
          // --------- Home page --------------
          whoWeAreBtn: "Quem Somos",
          contactUsBtn: "Contate-nos",
          seasonMessage:
            "Servimos com amor num ambiente ameno. Desde jantares íntimos a grandes celebrações de casamento, esta estação foi feita para ser apreciada.",

          // -------- Welcome Banner ----------
          welcomeTo: "Bem-vindo à",
          lmLtd: "LM-Ltda Serviços",
          welcomeToSubt:
            "Descubra a nossa missão, os nossos valores e o que nos diferencia.",

          // --------- Services Promo ---------
          product1: "Salão de Casamento",
          product2: "Jantar",
          product3: "Buffet",
          product4: "Professor de Química",
          product5: "Casamento",
          product6: "Bebidas",
          promoText1: "Compre Pela Metade do Preço",
          promoText2: "Acesse a nossa lista de produtos disponíveis.",
          learnMoreBtn: "Explore Mais",

          // ---------- Card Sets ------------
          "button.explore": "Explorar",
          "card.left.🍹 Beverages Service": "🍹 Bebidas a Retalho",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet para Você",
          "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Refeições por Encomenda",
          "card.left.💍 Wedding Events": "💍 Eventos de Casamento",
          "card.right.📚 Tutoring": "📚 Aulas Particulares",
          "card.right.🍔 Hamburgers": "🍔 Hambúrgueres",

          // ----------- Services Page ---------------
          services: {
            title: "Os Nossos Serviços",
            empty: "Nenhum serviço disponível.",
            loading: "A carregar serviços...",
            error:
              "Falha ao carregar serviços. Por favor, tente novamente mais tarde.",
          },
          season: {
            message:
              "Servimos com amor num ambiente ameno. Desde jantares íntimos a grandes celebrações de casamento, esta estação é feita para ser saboreada.",
          },
          footer: {
            phone: "Tel. : (+244) 222 022 351; (+244) 975 957 847",
            rights: "Todos os direitos reservados.",
          },

          // ---------- Services Available -----------
          "button.request": "Solicitar",
          "button.schedule": "Agendar",
          "button.share": "Compartilhar",
          "button.submit": "Enviar",
          "button.cancel": "Cancelar",

          "label.price": "AOA {{price}}",

          "service.🍹 Beverages Service.title": "🍹 Serviço de Bebidas",
          "service.🍹 Beverages Service.description":
            "Bebidas refrescantes para eventos e reuniões.",
          "service.🍽️ Buffet for You.title": "🍽️ Buffet Para Você",
          "service.🍽️ Buffet for You.description":
            "Deliciosas refeições self-service para eventos e reuniões.",
          "service.👨‍🍳 Made-to-Order Meals.title": "👨‍🍳 Refeições por Encomenda",
          "service.👨‍🍳 Made-to-Order Meals.description":
            "Refeições personalizadas e preparadas pelo cozinheiro chefe.",
          "service.💍 Wedding Events.title": "💍 Eventos de Casamento",
          "service.💍 Wedding Events.description":
            "Planejamento e coordenação elegantes para casamentos inesquecíveis.",
          "service.📚 Tutoring.title": "📚 Aulas Particulares",
          "service.📚 Tutoring.description":
            "Apoio acadêmico personalizado para estudantes.",
          "service.🍔 Hamburgers.title": "🍔 Hambúrgueres",
          "service.🍔 Hamburgers.description":
            "Hambúrgueres clássicos feitos sob encomenda.",
          "service.🎉 Party Salon.title": "🎉 Salão de Festas",
          "service.🎉 Party Salon.description":
            "Um salão de festas vibrante projetado para celebrações como aniversários e eventos.",
          "service.🍹 Retail Beverages.title": "🍹 Bebidas",
          "service.🍹 Retail Beverages.description":
            "Oferecendo uma grande variedade de bebidas e refrescos.",
          "service.🍽️ Buffet services.title": "🍽️ Serviço de Buffet",
          "service.🍽️ Buffet services.description":
            "Refeições self-service deliciosas para eventos e reuniões por pessoa.",
        },
      },
      fr: {
        translation: {
          // ----- Home page -------
          whoWeAreBtn: "Qui sommes-nous",
          contactUsBtn: "Contactez-nous",
          seasonMessage:
            "Servi avec amour et fraîcheur. Les dîners intimes aux grandes célébrations de mariage, cette saison est faite pour être savourée.",

          // ----- Welcome Banner -------
          welcomeTo: "Bienvenue chez",
          lmLtd: "LM-Ltd Services",
          welcomeToSubt:
            "Découvrez notre mission, nos valeurs et ce qui nous distingue.",

          // ----- Services Promo -------
          product1: "Salle de Mariage",
          product2: "Déjeuner",
          product3: "Buffet",
          product4: "Tuteur en Chimie",
          product5: "Mariage",
          product6: "Boire",
          promoText1: "Achetez à moitié prix",
          promoText2: "Consultez notre liste de produits disponibles.",
          learnMoreBtn: "Apprendre encore plus",

          // ---------- Card Sets -----------
          "button.explore": "Explorer",
          "card.left.🍹 Beverages Service": "🍹 Service de Boissons",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet Pour Vous",
          "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Repas Sur Mesure",
          "card.left.💍 Wedding Events": "💍 Événements de Mariage",
          "card.right.📚 Tutoring": "📚 Soutien Scolaire",
          "card.right.🍔 Hamburgers": "🍔 Hamburgers",

          // ----------- Services Page ---------------
          services: {
            title: "Nos Services",
            empty: "Aucun service disponible.",
            loading: "Chargement des services...",
            error:
              "Échec du chargement des services. Veuillez réessayer plus tard.",
          },
          season: {
            message:
              "L’amour servi frais. Des dîners intimes aux grandes célébrations de mariage — cette saison est faite pour être savourée.",
          },
          footer: {
            phone: "Tél. : (+244) 222 022 351; (+244) 975 957 847",
            rights: "Tous droits réservés.",
          },

          // ---------- Services Available -----------
          "button.request": "Demander",
          "button.schedule": "Planifier",
          "button.share": "Partager",
          "button.submit": "Envoyer",
          "button.cancel": "Annuler",

          "label.price": "€ {{price}}",

          "service.🍹 Beverages Service.title": "🍹 Service de Boissons",
          "service.🍹 Beverages Service.description":
            "Boissons rafraîchissantes pour événements et rassemblements.",
          "service.🍽️ Buffet for You.title": "🍽️ Buffet Pour Vous",
          "service.🍽️ Buffet for You.description":
            "Repas en self-service délicieux pour événements et réunions.",
          "service.👨‍🍳 Made-to-Order Meals.title": "👨‍🍳 Repas Sur Mesure",
          "service.👨‍🍳 Made-to-Order Meals.description":
            "Repas préparés par un chef, adaptés à votre événement.",
          "service.💍 Wedding Events.title": "💍 Événements de Mariage",
          "service.💍 Wedding Events.description":
            "Organisation élégante et coordination pour des mariages inoubliables.",
          "service.📚 Tutoring.title": "📚 Soutien Scolaire",
          "service.📚 Tutoring.description":
            "Soutien académique personnalisé pour les élèves.",
          "service.🍔 Hamburgers.title": "🍔 Hamburgers",
          "service.🍔 Hamburgers.description":
            "Burgers classiques préparés à la demande.",
          "service.🎉 Party Salon.title": "🎉 Salon de Fêtes",
          "service.🎉 Party Salon.description":
            "Un salon de fête dynamique conçu pour célébrations, anniversaires et événements.",
          "service.🍹 Retail Beverages.title": "🍹 Boissons",
          "service.🍹 Retail Beverages.description":
            "Propose une grande variété de boissons et de rafraîchissements.",
          "service.🍽️ Buffet services.title": "🍽️ Service Buffet",
          "service.🍽️ Buffet services.description":
            "Repas en self-service délicieux pour événements et réunions par personne.",
        },
      },
    },
  });

export default i18n;
