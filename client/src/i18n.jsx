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

          // --------- User Dashboard --------------
          "dashboard.availableServices": "Available Services",
          "dashboard.noServices":
            "No requests, schedules, or shared services yet.",
          "dashboard.sendProof": "Send Payment Proof",
          "dashboard.status": "Status",
          "status.paid_full": "Paid in Full",
          "status.paid_half": "Partially Paid",
          "status.unpaid": "Unpaid",

          // ----- Payment Instructions Modal -----
          "modal.paymentInstructions.title": "Payment Instructions",
          "modal.paymentInstructions.intro":
            "Please pay using the bank details below by deposit or transfer:",
          "modal.paymentInstructions.bankName": "Bank Name",
          "modal.paymentInstructions.accountName": "Account Name",
          "modal.paymentInstructions.accountNumber": "Account Number",
          "modal.paymentInstructions.routingNumber": "Routing Number",
          "modal.paymentInstructions.customerName": "Customer Name",
          "modal.paymentInstructions.footer":
            "Once you've completed the payment, please upload the support document or send it via email or 'SEND PAYMENT PROOF' button related to requested, scheduled or shared service.",
          fullNameId: "Your full name or service ID associated with the payment",

          // ---------- UserOnlyDashboard -----------
          "dashboard.title": "User Dashboard",
          "dashboard.welcome": "Welcome, {{name}}",
          "dashboard.email": "Email",
          "dashboard.role": "Role",
          "dashboard.overview": "Your Service Overview",
          "dashboard.accessDenied":
            "Access denied. This dashboard is for regular users only.",
          "dashboard.loading": "Loading...",
          "dashboard.failedRequested": "Failed to load requested services.",
          "dashboard.failedScheduled": "Failed to load scheduled services.",
          "dashboard.failedShared": "Failed to load shared services.",
          "dashboard.requested": "📝 Requested Services",
          "dashboard.scheduled": "📅 Scheduled Services",
          "dashboard.shared": "📧 Shared Services",
          "dashboard.created": "Created",
          "dashboard.paid": "Paid",
          "dashboard.payInstructions": "Pay Instructions",
          "dashboard.noImage": "No image available",
          "footer.rights": "All rights reserved.",

          // ------------- NewAdminDashboard --------------
          adminDashboardTitle: "Administrator Dashboard",
          welcomeUser: "Welcome",
          adminRole: "Role",
          adminAddService: "➕ Service",
          dashboardPreview: "Preview Current Services",
          AdmiNoServices: "No services available.",
          dashboardOverview: "Customer Service Overview",

          // --------------- AdminAddService ----------------
          addServiceTitle: "Add New Service",
          addServiceFieldTitle: "Enter service title",
          addServiceFieldDescription: "Enter a short description",
          addServiceFieldPrice: "e.g. 49.99",
          addServiceFieldImage: "Upload image",
          addServiceButtonCancel: "Cancel",
          addServiceButtonSubmit: "➕ Service",
          addServiceError: "Something went wrong. Please try again.",

          // --------------- AdminDashboard -----------------
          dashboardTitle: "Services",
          dashboardTableServiceTitle: "Service",
          dashboardTablePrice: "Price",
          dashboardStatusLabel: "Status",
          dashboardTableActions: "Actions",
          dashboardOpen: "Open",
          dashboardNoPayments: "No payments found.",
          dashboardPaymentsFor: "Payments for",
          dashboardTablePayer: "Payer",
          dashboardTableEmail: "Email",
          dashboardTableAmount: "Amount",
          dashboardClose: "Close",
          dashboardViewPayments: "Select a service to view payments",
          dashboardActionStatusFailed: "Action failed",
          dashboardStatus: {
            paid_full: "Paid in Full",
            paid_half: "Half Paid",
            unpaid: "Unpaid",
            other: "Other",
          },
          dashboardConfirm: {
            full: "Confirm Full",
            half: "Confirm Half",
          },

          // ------------- ProofAttachment --------------
          proofTitle: "Proof of Payment",
          proofNoService: "this service",
          proofNotFound:
            'Proof not found for "{{service}}". While you re-upload here are a few highlights from LM-Ltd Services.',
          proofTipPrefix: "Tip:",
          proofTip:
            "Re-upload your proof using the Upload Proof button on the service card.",
          proofImageAlt: "Promo image {{index}}",
          proofImageForService: "Proof image for {{service}}",
          proofViewPdf: "View PDF Proof",
          proofDownload: "Download Attachment",
          proofFileLabel: "File",
          proofUnknownFile: "attachment",
          proofUploadedAt: "Uploaded",
          proofNoDate: "—",
          service: {
            Test: { title: "Test" },
            Wedding: { title: "Wedding" },
            Tutoring: { title: "Tutoring" },
          },

          // ---------- User Calendar -----------
          "calendar.myEvents": "My Events",
          "calendar.loading": "Loading events…",
          "calendar.error": "Failed to load calendar events.",
          "calendar.noEvents": "No events found for this user.",
          "calendar.untitled": "Untitled",
          "calendar.eventId": "Event ID",
          "calendar.created": "Created",
          "calendar.title": "Title",
          "calendar.date": "Date",
          "calendar.time": "Time",

          "service.Test.title": "Test",
          "service.Wedding.title": "Wedding",
          "service.Tutoring.title": "Tutoring",

          // ------------- Service Calendat ----------------
          calendar: {
            heading: "Available slots",
            loading: "Loading availability…",
            noAvailability: "No availability found.",
            lastTried: "Last tried endpoint",
            endpointHint: "Tried endpoints: {{endpoints}}",
            retry: "Retry",
            reload: "Reload page",
            error: {
              not_found:
                "Availability endpoint not found. Tried: {{endpoints}}",
              server: "Server error: {{message}}",
              unknown: "Failed to fetch availability: {{message}}",
            },
            table: {
              date: "Date",
              time: "Time",
              available: "Available",
              yes: "Yes",
              no: "No",
              allDay: "All day",
            },
          },
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

          // ---------------- Card Sets ------------------
          "button.explore": "Explorar",
          "card.left.🍹 Beverages Service": "🍹 Bebidas a Retalho",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet para Você",
          "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Refeições por Encomenda",
          "card.left.💍 Wedding Events": "💍 Eventos de Casamento",
          "card.right.📚 Tutoring": "📚 Aulas Particulares",
          "card.right.🍔 Hamburgers": "🍔 Hambúrgueres",

          // -------------- Services Page ------------------
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
            "Um salão de festas vibrante projetado para celebrações como aniversários e outros eventos.",
          "service.🍹 Retail Beverages.title": "🍹 Bebidas",
          "service.🍹 Retail Beverages.description":
            "Oferecendo uma grande variedade de bebidas e refrescos.",
          "service.🍽️ Buffet services.title": "🍽️ Serviço de Buffet",
          "service.🍽️ Buffet services.description":
            "Refeições self-service deliciosas para eventos e reuniões por pessoa.",

          // --------- User Dashboard --------------
          "dashboard.availableServices": "Serviços Disponíveis",
          "dashboard.noServices":
            "Nenhum pedido, agendamento ou serviço compartilhado ainda.",
          "dashboard.sendProof": "Envie o Comprovativo de Pagamento",
          "dashboard.status": "Condição",
          "status.paid_full": "Pago",
          "status.paid_half": "Pago parcialmente",
          "status.unpaid": "Não pago",

          // ----- Payment Instructions Modal -----
          "modal.paymentInstructions.title": "Instruções de Pagamento",
          "modal.paymentInstructions.intro":
            "Por favor, pague usando os dados bancários abaixo por depósito ou transferência:",
          "modal.paymentInstructions.bankName": "Nome do Banco",
          "modal.paymentInstructions.accountName": "Nome da Conta",
          "modal.paymentInstructions.accountNumber": "Número da Conta",
          "modal.paymentInstructions.routingNumber": "Número de Roteamento",
          "modal.paymentInstructions.customerName": "Nome do Cliente",
          "modal.paymentInstructions.footer":
            "Após concluir o pagamento, envie em anexo o comprovante por e-mail ou aperta no botão 'ENVIAR COMPROVATIVO DE PAGAMENTO' relacionado ao serviço solicitado, agendado ou compartilhado.",
          fullNameId: "Nome completo associado ao pagamento ou seu ID associado ao serviço",

          // ---------- UserOnlyDashboard -----------
          "dashboard.title": "Painel do Usuário",
          "dashboard.welcome": "Bem-vindo, {{name}}",
          "dashboard.email": "Email",
          "dashboard.role": "Função",
          "dashboard.overview": "Visão Geral dos Seus Serviços",
          "dashboard.accessDenied":
            "Acesso negado. Este painel é apenas para usuários regulares.",
          "dashboard.loading": "Carregando...",
          "dashboard.failedRequested":
            "Falha ao carregar serviços solicitados.",
          "dashboard.failedScheduled": "Falha ao carregar serviços agendados.",
          "dashboard.failedShared":
            "Falha ao carregar serviços compartilhados.",
          "dashboard.requested": "📝 Serviços Solicitados",
          "dashboard.scheduled": "📅 Serviços Agendados",
          "dashboard.shared": "📧 Serviços Compartilhados",
          "dashboard.created": "Criado",
          "dashboard.paid": "Pago",
          "dashboard.payInstructions": "Instruções de Pagamento",
          "dashboard.noImage": "Nenhuma imagem disponível",
          "footer.rights": "Todos os direitos reservados.",

          // ------------- NewAdminDashboard --------------
          adminDashboardTitle: "Painel de Administração",
          welcomeUser: "Bem-vindo",
          adminRole: "Função",
          adminAddService: "➕ Serviço",
          dashboardPreview: "Pré-visualização dos Serviços Atuais",
          admiNoServices: "Nenhum serviço disponível.",
          dashboardOverview: "Visão Geral dos Usuários",

          // --------------- AdminAddService ----------------
          addServiceTitle: "Adicionar Novo Serviço",
          addServiceFieldTitle: "Insira o título do serviço",
          addServiceFieldDescription: "Insira uma breve descrição",
          addServiceFieldPrice: "ex: 49.99",
          addServiceFieldImage: "Enviar imagem",
          addServiceButtonCancel: "Cancelar",
          addServiceButtonSubmit: "➕ Serviço",
          addServiceError: "Algo deu errado. Tente novamente.",

          // --------------- AdminDashboard -----------------
          dashboardTitle: "Serviços",
          dashboardTableServiceTitle: "Serviço",
          dashboardTablePrice: "Preço",
          dashboardStatusLabel: "Estado",
          dashboardTableActions: "Ações",
          dashboardOpen: "Abrir",
          dashboardNoPayments: "Nenhum pagamento encontrado.",
          dashboardPaymentsFor: "Pagamentos de",
          dashboardTablePayer: "Pagador",
          dashboardTableEmail: "Email",
          dashboardTableAmount: "Valor",
          dashboardClose: "Fechar",
          dashboardViewPayments: "Selecione um serviço para ver pagamentos",
          dashboardActionStatusFailed: "A ação falhou",
          dashboardStatus: {
            paid_full: "Pago integralmente",
            paid_half: "Pago parcialmente",
            unpaid: "Não pago",
            other: "Outro",
          },
          dashboardConfirm: {
            full: "Confirmar integral",
            half: "Confirmar parcial",
          },

          // ------------- ProofAttachment --------------
          proofTitle: "Comprovativo de Pagamento",
          proofNoService: "este serviço",
          proofNotFound:
            'Comprovativo não encontrado para "{{service}}". Enquanto aguarda o recarregamento, aqui estão alguns destaques dos serviços da LM-Ltda.',
          proofTipPrefix: "Dica:",
          proofTip:
            "Reenvie o comprovativo usando o botão Enviar Comprovativo no cartão do serviço.",
          proofImageAlt: "Imagem promocional {{index}}",
          proofImageForService: "Imagem do comprovativo para {{service}}",
          proofViewPdf: "Ver comprovativo PDF",
          proofDownload: "Descarregar Anexo",
          proofFileLabel: "Arquivo",
          proofUnknownFile: "anexo",
          proofUploadedAt: "Enviado",
          proofNoDate: "—",
          service: {
            Test: { title: "Teste" },
            Wedding: { title: "Casamento" },
            Tutoring: { title: "Aulas particulares" },
          },

          // ---------- User Calendar -----------
          "calendar.myEvents": "Meus Eventos",
          "calendar.loading": "Carregando eventos…",
          "calendar.error": "Falha ao carregar eventos do calendário.",
          "calendar.noEvents": "Nenhum evento encontrado para este usuário.",
          "calendar.untitled": "Sem título",
          "calendar.eventId": "ID do Evento",
          "calendar.created": "Criado",
          "calendar.title": "Título",
          "calendar.date": "Data",
          "calendar.time": "Hora",

          "service.Test.title": "Teste",
          "service.Wedding.title": "Casamento",
          "service.Tutoring.title": "Aulas Particulares",

          // ------------- Service Calendat ----------------
          calendar: {
            heading: "Horários disponíveis",
            loading: "Carregando disponibilidade…",
            noAvailability: "Nenhuma disponibilidade encontrada.",
            lastTried: "Último endpoint tentado",
            endpointHint: "Endpoints tentados: {{endpoints}}",
            retry: "Tentar novamente",
            reload: "Recarregar página",
            error: {
              not_found:
                "Ponto de extremidade de disponibilidade não encontrado. Tentado: {{endpoints}}",
              server: "Erro do servidor: {{message}}",
              unknown: "Falha ao obter disponibilidade: {{message}}",
            },
            table: {
              date: "Data",
              time: "Hora",
              available: "Disponível",
              yes: "Sim",
              no: "Não",
              allDay: "Todo dia",
            },
          },
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

          // --------- User Dashboard --------------
          "dashboard.availableServices": "Services Disponibles",
          "dashboard.noServices":
            "Aucune demande, planification ou service partagé pour l'instant.",
          "dashboard.sendProof": "Envoyer la Preuve de Paiement",
          "dashboard.status": "État",
          "status.paid_full": "Payé",
          "status.paid_half": "Payé partiellement",
          "status.unpaid": "Non payé",

          // ----- Payment Instructions Modal -----
          "modal.paymentInstructions.title": "Instructions de Paiement",
          "modal.paymentInstructions.intro":
            "Veuillez payer en utilisant les coordonnées bancaires ci-dessous par dépôt ou virement :",
          "modal.paymentInstructions.bankName": "Nom de la Banque",
          "modal.paymentInstructions.accountName": "Nom du Compte",
          "modal.paymentInstructions.accountNumber": "Numéro de Compte",
          "modal.paymentInstructions.routingNumber": "Numéro de Routage",
          "modal.paymentInstructions.customerName": "Nom du Client",
          "modal.paymentInstructions.footer":
            "Une fois le paiement effectué, veuillez télécharger le document justificatif ou l'envoyer par e-mail ou via le bouton 'ENVOYER LA PREUVE DE PAIEMENT' lié au service demandé, planifié ou partagé.",
          fullNameId: "Votre nom complet ou l'ID du service associé au paiement",

          // ---------- UserOnlyDashboard -----------
          "dashboard.title": "Tableau de Bord Utilisateur",
          "dashboard.welcome": "Bienvenue, {{name}}",
          "dashboard.email": "Email",
          "dashboard.role": "Rôle",
          "dashboard.overview": "Aperçu de Vos Services",
          "dashboard.accessDenied":
            "Accès refusé. Ce tableau de bord est réservé aux utilisateurs réguliers.",
          "dashboard.loading": "Chargement...",
          "dashboard.failedRequested":
            "Échec du chargement des services demandés.",
          "dashboard.failedScheduled":
            "Échec du chargement des services planifiés.",
          "dashboard.failedShared":
            "Échec du chargement des services partagés.",
          "dashboard.requested": "📝 Services Demandés",
          "dashboard.scheduled": "📅 Services Planifiés",
          "dashboard.shared": "📧 Services Partagés",
          "dashboard.created": "Créé",
          "dashboard.paid": "Payé",
          "dashboard.payInstructions": "Instructions de Paiement",
          "dashboard.noImage": "Aucune image disponible",
          "footer.rights": "Tous droits réservés.",

          // ------------- NewAdminDashboard --------------
          adminDashboardTitle: "Tableau de Bord Administrateur",
          welcomeUser: "Bienvenue",
          adminRole: "Rôle",
          adminAddService: "➕ Service",
          dashboardPreview: "Aperçu des Services Actuels",
          AdmiNoServices: "Aucun service disponible.",
          dashboardOverview: "Aperçu de l'utilisateur",

          // --------------- AdminAddService ----------------
          addServiceTitle: "Ajouter un Nouveau Service",
          addServiceFieldTitle: "Entrez le titre du service",
          addServiceFieldDescription: "Entrez une brève description",
          addServiceFieldPrice: "ex : 49.99",
          addServiceFieldImage: "Télécharger une image",
          addServiceButtonCancel: "Annuler",
          addServiceButtonSubmit: "➕ Service",
          addServiceError: "Une erreur s'est produite. Veuillez réessayer.",

          // --------------- AdminDashboard -----------------
          dashboardTitle: "Services",
          dashboardTableServiceTitle: "Service",
          dashboardTablePrice: "Prix",
          dashboardStatusLabel: "Statut",
          dashboardTableActions: "Actions",
          dashboardOpen: "Ouvrir",
          dashboardNoPayments: "Aucun paiement trouvé.",
          dashboardPaymentsFor: "Paiements pour",
          dashboardTablePayer: "Payeur",
          dashboardTableEmail: "Email",
          dashboardTableAmount: "Montant",
          dashboardClose: "Fermer",
          dashboardViewPayments:
            "Sélectionnez un service pour voir les paiements",
          dashboardActionStatusFailed: "Action échouée",
          dashboardStatus: {
            paid_full: "Payé en totalité",
            paid_half: "Payé partiellement",
            unpaid: "Non payé",
            other: "Autre",
          },
          dashboardConfirm: {
            full: "Confirmer complet",
            half: "Confirmer partiel",
          },

          // ------------- ProofAttachment --------------
          proofTitle: "Preuve de paiement",
          proofNoService: "ce service",
          proofNotFound:
            'Preuve introuvable pour "{{service}}". En attendant le rechargement, voici quelques points saillants des services de LM-Ltd.',
          proofTipPrefix: "Astuce :",
          proofTip:
            "Ré-uploadez votre preuve en utilisant le bouton Téléverser la preuve sur la carte du service.",
          proofImageAlt: "Image promo {{index}}",
          proofImageForService: "Image de la preuve pour {{service}}",
          proofViewPdf: "Voir la preuve PDF",
          proofDownload: "Télécharger la pièce jointe",
          proofFileLabel: "Fichier",
          proofUnknownFile: "pièce jointe",
          proofUploadedAt: "Téléversé",
          proofNoDate: "—",
          service: {
            Test: { title: "Test" },
            Wedding: { title: "Mariage" },
            Tutoring: { title: "Cours particuliers" },
          },

          // ---------- User Calendar -----------
          "calendar.myEvents": "Mes Événements",
          "calendar.loading": "Chargement des événements…",
          "calendar.error": "Échec du chargement des événements du calendrier.",
          "calendar.noEvents": "Aucun événement trouvé pour cet utilisateur.",
          "calendar.untitled": "Sans titre",
          "calendar.eventId": "ID de l'Événement",
          "calendar.created": "Créé",
          "calendar.title": "Titre",
          "calendar.date": "Date",
          "calendar.time": "Heure",

          "service.Test.title": "Test",
          "service.Wedding.title": "Mariage",
          "service.Tutoring.title": "Cours Particuliers",

          // ------------- Service Calendat ----------------
          calendar: {
            heading: "Créneaux disponibles",
            loading: "Chargement des disponibilités…",
            noAvailability: "Aucune disponibilité trouvée.",
            lastTried: "Dernier endpoint essayé",
            endpointHint: "Endpoints essayés : {{endpoints}}",
            retry: "Réessayer",
            reload: "Recharger la page",
            error: {
              not_found:
                "Point de terminaison de disponibilité introuvable. Tenté : {{endpoints}}",
              server: "Erreur du serveur : {{message}}",
              unknown:
                "Échec de la récupération des disponibilités : {{message}}",
            },
            table: {
              date: "Date",
              time: "Heure",
              available: "Disponible",
              yes: "Oui",
              no: "Non",
              allDay: "Toute la journée",
            },
          },
        },
      },
    },
  });

export default i18n;
