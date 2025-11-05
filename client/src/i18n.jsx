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
          learnMoreBtn1: "Learn More",
        },
      },
      pt: {
        translation: {
          // ----- Home page -------
          whoWeAreBtn: "Quem Somos",
          contactUsBtn: "Contate-nos",
          seasonMessage:
            "Servido com amor e frescura. Desde jantares íntimos a grandes celebrações de casamento, esta estação foi feita para ser apreciada.",
          // ----- Welcome Banner -------
          welcomeTo: "Bem-vindo à",
          lmLtd: "LM-Ltda Serviços",
          welcomeToSubt:
            "Descubra a nossa missão, os nossos valores e o que nos diferencia.",

          // ----- Services Promo -------
          product1: "Salão de Casamento",
          product2: "Jantar",
          product3: "Buffet",
          product4: "Professor de Química",
          product5: "Casamento",
          product6: "Bebidas",
          promoText1: "Compre Pela Metade do Preço",
          promoText2: "Acesse a nossa lista de produtos disponíveis.",
          learnMoreBtn: "Explore Mais",
          learnMoreBtn1: "Explore Mais",
        },
      },
      fr: {
        translation: {
          // ----- Home page -------
          whoWeAreBtn: "Qui sommes-nous",
          contactUsBtn: "Contactez-nous",
          seasonMessage:
            "Servi avec amour et fraîcheur. Des dîners intimes aux grandes célébrations de mariage, cette saison est faite pour être savourée.",
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
          learnMoreBtn1: "Apprendre encore plus",
        },
      },
    },
  });

export default i18n;
