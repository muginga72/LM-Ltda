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
          product4: "Rent a Room",
          product5: "Wedding",
          product6: "Beverage",
          product7: "Party Salon",
          product8: "Building Caculo",
          promoText1: "Stop being scammed by “fake realtors”.",
          promoText2: "Enlist your room with us!",
          learnMoreBtn: "Learn More",

          // ---------- Card Sets -----------
          // Set-1
          "button.explore": "Explore",
          "card.left.🍹 Beverages Service": "🍹 Beverages Service",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet for You",
          "card.right.💍 Wedding Events": "💍 Wedding Events",
          // "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Made-to-Order Meals",

          // Do not remove: It is to be used later
          // Set-2
          // "card.left.💍 Wedding Events": "💍 Wedding Events",
          // "card.right.📚 Tutoring": "📚 Tutoring",
          // "card.right.🍔 Hamburgers": "🍔 Hamburgers",

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
            phone:
              "Tel.: (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046",
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
          fullNameId:
            "Your full name or service ID associated with the payment",

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
          dashboard: {
            title: "User dashboard",
            welcome: "Welcome, {{name}}",
            email: "Email",
            role: "Role",
            accessDenied: "Access denied. This area is for users only.",
            loading: "Loading…",
            tabOverview: "Overview",
            tabServices: "Services",
            tabRooms: "Rooms",
            tabBookings: "My Bookings",
            overview: "Overview",
            requested: "📝 Requested services",
            scheduled: "📅 Scheduled services",
            shared: "📧 Shared services",
            requestedType: "Requested",
            scheduledType: "Scheduled",
            sharedType: "Shared",
            requestedShort: "Requested",
            scheduledShort: "Scheduled",
            noServicesShort: "No items",
            noServices: "No {{type}} found.",
            created: "Created",
            payInstructions: "Pay / Upload proof",
            pay: "Pay",
            paid: "Paid",
            view: "View",
            payConfirm: "You will be redirected to a secure payment page.",
            cancel: "Cancel",
            proceedToPay: "Proceed to payment",
            availableRooms: "Available rooms",
            tabOverviewLabel: "Overview",
          },
          modal: {
            paymentInstructions: {
              title: "Payment instructions",
              intro:
                "Please follow the bank transfer instructions below and upload proof of payment.",
              bankName: "Bank name",
              accountName: "Account name",
              accountNumber: "Account number",
              routingNumber: "Routing / IBAN",
              customerName: "Customer name",
              footer:
                "After payment, upload the proof so we can validate your request.",
            },
          },

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

          // ---------------- Modal Profile  ---------------
          "Your Profile": "Your Profile",
          Fullname: "Full name",
          Email: "Email",
          Phone: "Phone",
          "Save Changes": "Save Changes",
          Close: "Close",
          "Profile updated successfully!": "Profile updated successfully!",
          "Failed to update profile": "Failed to update profile",
          "No token found": "No token found",

          // --------------- Contact Page -----------------
          contact: {
            title: "Contact Us",
            name: "Name",
            email: "Email",
            phone: "Phone",
            message: "Message",
            send: "Send",
            sending: "Sending...",
            success: "Message sent successfully!",
            close: "Close",
            phoneError: "Please enter a valid phone number.",
            serverError: "Server error",
            footer: {
              phones: "Phones",
              address: "Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola",
              copyright: "All rights reserved.",
            },
          },

          button: {
            request: "Request",
            schedule: "Schedule",
            share: "Share",
            cancel: "Cancel",
            submit: "Submit",
          },
          notification: {
            success: "Action successful.",
          },
          form: {
            fullName: "Full Name",
            email: "Email",
            serviceType: "Service Type",
            details: "Details",
            date: "Date",
            time: "Time",
          },
          placeholder: {
            fullName: "Your full name",
            emailFor: "Enter your email for {{service}}",
            serviceType: "{{action}} {{service}}",
            details: "Describe your {{service}} request...",
            date: "mm/dd/yyyy",
            time: "10:30 AM",
          },

          // ---------------- Who we are page  ---------------
          whoWeAre: {
            title: "Who We Are",
            description:
              "Laurindo Muginga Retail and Service Provision is a service and retail company offering quality, professionalism, and social responsibility. We aim to provide quality and personalized service. We exist to serve and will continue to serve with responsibility and dedication, showing that the customer is the reason for our existence.",
            missionTitle: "Mission",
            mission:
              "To provide meals to order, buffet services, and beverage sales.\nTo operate profitably, with social responsibility, and to contribute to the country's growth.\nTo provide customers with comfort, well-being, healthy food, and safety.\nTo create value and make a difference wherever we operate.",
            visionTitle: "Vision",
            vision:
              'We want to grow, become profitable, stabilize, and ensure the financial health of the company "CRES."',
            valuesTitle: "Values",
            values: [
              'Ethics: Mutual respect, doing "the right thing" and what you say, and being authentic and saying what you mean.',
              "Capacity: Applying all our training and experience to continuous improvement, every day.",
              "Competence: Doing things well and assuming responsibilities.",
              "Courage: Facing challenges and taking necessary risks.",
              "Creativity: Reinventing the path and seeking alternatives.",
              "Heart: Friendship and team spirit create bonds of fraternity and solidarity.",
              "Commitment: Cherishing and exercising these values at work and in life.",
            ],
            differentiatorsTitle: "Differentiators",
            differentiators:
              "A company that prioritizes moral and spiritual values such as faith, humility, insight, kindness, and altruism. Our policy on Quality, Environment, Safety, Health, and Social Responsibility aims to be innovative, competitive in the domestic market, and harmonious with people and the environment.",
            footer: {
              phones: "Phones",
              address: "Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola",
              copyright: "All rights reserved.",
            },
          },

          // --------------- Learn More Page ------------------
          overview: {
            title: "🧭 Service Overview",
            content:
              "LM-Ltd Services is a modular platform designed to streamline data delivery, image rendering, and service management for scalable web applications...",
          },
          howItWorks: {
            title: "How It Works",
            content:
              "The LM-Ltd flow begins with Express backend routes that expose RESTful endpoints...",
          },
          benefitsValues: {
            title: "Benefits & Value",
            content: [
              "Faster access to promo product data and images",
              "Reliable static image rendering via Express",
              "Scalable architecture built with modular components",
              "Maintainable codebase with defensive patterns and clear separation of concerns",
            ],
          },
          useCases: {
            title: "Use Cases",
            content:
              "LM-Ltd Services is ideal for promotional platforms needing dynamic product displays...",
          },
          techStack: {
            title: "Tech Stack Transparency",
            content:
              "LM-Ltd Services is built using React for the frontend and Express for the backend...",
          },
          developerFeatures: {
            title: "Developer-Friendly Features",
            content:
              "Developers can preview API documentation with clear endpoint descriptions...",
          },
          scalability: {
            title: "Scalability & Reliability",
            content:
              "LM-Ltd Services is designed for high uptime and performance...",
          },
          callToAction: {
            title: "📞 Call to Action",
            content:
              "Ready to explore LM-Ltd Services? Schedule a Demo, Explore Docs, or Contact Us...",
          },
          weddingTitle: "Wedding Testimonials",
          tutoringTitle: "Tutoring Chemistry Testimonials",
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
          product4: "Quarto para Arrendar",
          product5: "Casamento",
          product6: "Bebidas",
          product7: "Salão de Festas",
          product8: "Edificio Caculo",
          promoText1: "Pare de ser aldrabado pelos “matoxeiros”.",
          promoText2: "Aliste o seu quarto conosco!",
          learnMoreBtn: "Explore Mais",

          // ---------------- Card Sets --------------------
          // Set-1
          "button.explore": "Explorar",
          "card.left.🍹 Beverages Service": "🍹 Bebidas a Retalho",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet para Você",
          "card.rigth.💍 Wedding Events": "💍 Eventos de Casamento",
          // "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Refeições por Encomenda",

          // Do not remove: It is to be used later

          // Set-2
          // "card.left.💍 Wedding Events": "💍 Eventos de Casamento",
          // "card.right.📚 Tutoring": "📚 Aulas Particulares",
          // "card.right.🍔 Hamburgers": "🍔 Hambúrgueres",

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
            phone:
              "Tel.: (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046",
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
          fullNameId:
            "Nome completo associado ao pagamento ou seu ID associado ao serviço",

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
          dashboard: {
            title: "Painel do utilizador",
            welcome: "Bem-vindo, {{name}}",
            email: "Email",
            role: "Função",
            accessDenied:
              "Acesso negado. Esta área é apenas para utilizadores.",
            loading: "A carregar…",
            tabOverview: "Visão geral",
            tabServices: "Serviços",
            tabRooms: "Quartos",
            tabBookings: "As minhas reservas",
            overview: "Visão geral",
            requested: "📝 Serviços solicitados",
            scheduled: "📅 Serviços agendados",
            shared: "📧 Serviços partilhados",
            requestedType: "Solicitado",
            scheduledType: "Agendado",
            sharedType: "Partilhado",
            requestedShort: "Solicitados",
            scheduledShort: "Agendados",
            noServicesShort: "Sem itens",
            noServices: "Nenhum {{type}} encontrado.",
            created: "Criado",
            payInstructions: "Pagar / Enviar comprovativo",
            pay: "Pagar",
            paid: "Pago",
            view: "Ver",
            payConfirm:
              "Será redirecionado para uma página de pagamento segura.",
            cancel: "Cancelar",
            proceedToPay: "Ir para o pagamento",
            availableRooms: "Quartos disponíveis",
            tabOverviewLabel: "Visão geral",
          },
          modal: {
            paymentInstructions: {
              title: "Instruções de pagamento",
              intro:
                "Por favor siga as instruções de transferência bancária abaixo e carregue o comprovativo de pagamento.",
              bankName: "Nome do banco",
              accountName: "Nome da conta",
              accountNumber: "Número da conta",
              routingNumber: "Routing / IBAN",
              customerName: "Nome do cliente",
              footer:
                "Após o pagamento, carregue o comprovativo para que possamos validar o seu pedido.",
            },
          },

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

          // ---------------- Modal Profile  ---------------
          "Your Profile": "Seu Perfil",
          Fullname: "Nome completo",
          Email: "E-mail",
          Phone: "Telefone",
          "Save Changes": "Salvar Alterações",
          Close: "Fechar",
          "Profile updated successfully!": "Perfil atualizado com sucesso!",
          "Failed to update profile": "Falha ao atualizar perfil",
          "No token found": "Token não encontrado",

          // --------------- Contact Page -----------------
          contact: {
            title: "Contate-nos",
            name: "Nome",
            email: "Email",
            phone: "Telefone",
            message: "Mensagem",
            send: "Enviar",
            sending: "Enviando...",
            success: "Mensagem enviada com sucesso!",
            close: "Fechar",
            phoneError: "Por favor, insira um número de telefone válido.",
            serverError: "Erro no servidor",
            footer: {
              phones: "Telefones",
              address: "Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola",
              copyright: "Todos os direitos reservados.",
            },
          },

          button: {
            request: "Solicitar",
            schedule: "Agendar",
            share: "Compartilhar",
            cancel: "Cancelar",
            submit: "Enviar",
          },
          notification: {
            success: "Ação concluída com sucesso.",
          },
          form: {
            fullName: "Nome Completo",
            email: "E-mail",
            serviceType: "Tipo de Serviço",
            details: "Detalhes",
            date: "Data",
            time: "Hora",
          },
          placeholder: {
            fullName: "Seu nome completo",
            emailFor: "Insira seu e-mail para {{service}}",
            serviceType: "{{action}} {{service}}",
            details: "Descreva seu pedido de {{service}}...",
            date: "dd/mm/aaaa",
            time: "10:30",
          },

          // ---------------- Who we are page  ---------------
          whoWeAre: {
            title: "Quem Somos",
            description:
              "Laurindo Muginga Comércio e Prestação de Serviços é uma empresa de serviços e comércio que oferece qualidade, profissionalismo e responsabilidade social. Nosso objetivo é fornecer um serviço de qualidade e personalizado. Existimos para servir e continuaremos a servir com responsabilidade e dedicação, mostrando que o cliente é a razão da nossa existência.",
            missionTitle: "Missão",
            mission:
              "Fornecer refeições sob encomenda, serviços de buffet e venda de bebidas.\nOperar de forma lucrativa, com responsabilidade social, e contribuir para o crescimento do país.\nProporcionar aos clientes conforto, bem-estar, alimentação saudável e segurança.\nCriar valor e fazer a diferença onde quer que atuemos.",
            visionTitle: "Visão",
            vision:
              'Queremos crescer, tornar-nos lucrativos, estabilizar e garantir a saúde financeira da empresa "CRES."',
            valuesTitle: "Valores",
            values: [
              'Ética: Respeito mútuo, fazer "a coisa certa" e cumprir o que se diz, sendo autêntico.',
              "Capacidade: Aplicar todo nosso treinamento e experiência na melhoria contínua.",
              "Competência: Fazer bem feito e assumir responsabilidades.",
              "Coragem: Enfrentar desafios e assumir riscos necessários.",
              "Criatividade: Reinventar caminhos e buscar alternativas.",
              "Coração: Amizade e espírito de equipe criam laços de fraternidade e solidariedade.",
              "Compromisso: Valorizar e exercer esses valores no trabalho e na vida.",
            ],
            differentiatorsTitle: "Diferenciais",
            differentiators:
              "Uma empresa que prioriza valores morais e espirituais como fé, humildade, discernimento, bondade e altruísmo. Nossa política de Qualidade, Meio Ambiente, Segurança, Saúde e Responsabilidade Social busca inovação, competitividade e harmonia com as pessoas e o meio ambiente.",
            footer: {
              phones: "Telefones",
              address: "Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola",
              copyright: "Todos os direitos reservados.",
            },
          },

          // --------------- Learn More Page ------------------
          overview: {
            title: "🧭 Visão Geral do Serviço",
            content:
              "LM-Ltda Serviços é uma plataforma modular projetada para otimizar a entrega de dados...",
          },
          howItWorks: {
            title: "Como Funciona",
            content:
              "O fluxo de serviços da LM-Ltda começa com rotas backend Express que expõem endpoints RESTful...",
          },
          benefitsValues: {
            title: "Benefícios & Valor",
            content: [
              "Acesso mais rápido a dados e imagens",
              "Renderização confiável de imagens estáticas via Express",
              "Arquitetura escalável com componentes modulares",
              "Código sustentável com padrões defensivos",
            ],
          },
          useCases: {
            title: "Casos de Uso",
            content:
              "LM-Ltda Serviços é ideal para plataformas promocionais que precisam de exibições dinâmicas...",
          },
          techStack: {
            title: "Transparência da Stack Tecnológica",
            content:
              "LM-Ltda Serviços é construído com React no frontend e Express no backend...",
          },
          developerFeatures: {
            title: "Recursos para Desenvolvedores",
            content:
              "Os desenvolvedores podem visualizar a documentação da API com descrições claras...",
          },
          scalability: {
            title: "Escalabilidade & Confiabilidade",
            content:
              "LM-Ltda Serviços foi projetado para alta disponibilidade e desempenho...",
          },
          callToAction: {
            title: "📞 Chamada para Ação",
            content:
              "Pronto para explorar LM-Ltda Serviços? Agende uma demonstração, explore a documentação ou entre em contato...",
          },
          weddingTitle: "Testemunhos de Casamento",
          tutoringTitle: "Testemunhos das aulas particulares em Química",
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
          product4: "Chambre à louer",
          product5: "Mariage",
          product6: "Boire",
          product7: "Salon de fête",
          product8: "Edificio Calculo",
          promoText1:
            "Cessez de vous faire arnaquer par des “faux agents immobiliers”.",
          promoText2: "Réservez votre chambre chez nous!",
          learnMoreBtn: "Apprendre encore plus",

          // ---------- Card Sets -----------
          // Set-1
          "button.explore": "Explorer",
          "card.left.🍹 Beverages Service": "🍹 Service de Boissons",
          "card.right.💍 Wedding Events": "💍 Événements de Mariage",
          "card.right.🍽️ Buffet for You": "🍽️ Buffet Pour Vous",
          // "card.right.👨‍🍳 Made-to-Order Meals": "👨‍🍳 Repas Sur Mesure",

          // Do not remove: It is to be used later

          // Set-2
          // "card.left.💍 Wedding Events": "💍 Événements de Mariage",
          // "card.right.📚 Tutoring": "📚 Soutien Scolaire",
          // "card.right.🍔 Hamburgers": "🍔 Hamburgers",

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
            phone:
              "Tél.: (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046",
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
          fullNameId:
            "Votre nom complet ou l'ID du service associé au paiement",

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
          dashboard: {
            title: "Tableau de bord utilisateur",
            welcome: "Bienvenue, {{name}}",
            email: "Email",
            role: "Rôle",
            accessDenied:
              "Accès refusé. Cet espace est réservé aux utilisateurs.",
            loading: "Chargement…",
            tabOverview: "Aperçu",
            tabServices: "Services",
            tabRooms: "Chambres",
            tabBookings: "Mes réservations",
            overview: "Aperçu",
            requested: "📝 Services demandés",
            scheduled: "📅 Services programmés",
            shared: "📧 Services partagés",
            requestedType: "Demandé",
            scheduledType: "Programmé",
            sharedType: "Partagé",
            requestedShort: "Demandés",
            scheduledShort: "Programmés",
            noServicesShort: "Aucun élément",
            noServices: "Aucun {{type}} trouvé.",
            created: "Créé",
            payInstructions: "Payer / Télécharger le justificatif",
            pay: "Payer",
            paid: "Payé",
            view: "Voir",
            payConfirm:
              "Vous serez redirigé vers une page de paiement sécurisée.",
            cancel: "Annuler",
            proceedToPay: "Procéder au paiement",
            availableRooms: "Chambres disponibles",
            tabOverviewLabel: "Aperçu",
          },
          modal: {
            paymentInstructions: {
              title: "Instructions de paiement",
              intro:
                "Veuillez suivre les instructions de virement bancaire ci-dessous et télécharger le justificatif de paiement.",
              bankName: "Nom de la banque",
              accountName: "Nom du compte",
              accountNumber: "Numéro de compte",
              routingNumber: "Routing / IBAN",
              customerName: "Nom du client",
              footer:
                "Après le paiement, téléchargez le justificatif afin que nous puissions valider votre demande.",
            },
          },

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

          // ---------------- Modal Profile  ---------------
          "Your Profile": "Votre Profil",
          Fullname: "Nom complet",
          Email: "E-mail",
          Phone: "Téléphone",
          "Save Changes": "Enregistrer",
          Close: "Fermer",
          "Profile updated successfully!": "Profil mis à jour avec succès !",
          "Failed to update profile": "Échec de la mise à jour du profil",
          "No token found": "Jeton introuvable",

          // --------------- Contact Page -----------------
          contact: {
            title: "Contactez-Nous",
            name: "Nom",
            email: "Email",
            phone: "Téléphone",
            message: "Message",
            send: "Envoyer",
            sending: "Envoi...",
            success: "Message envoyé avec succès!",
            close: "Fermer",
            phoneError: "Veuillez entrer un numéro de téléphone valide.",
            serverError: "Erreur du serveur",
            footer: {
              phones: "Téléphones",
              address: "Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola",
              copyright: "Tous droits réservés.",
            },
          },

          button: {
            request: "Demander",
            schedule: "Planifier",
            share: "Partager",
            cancel: "Annuler",
            submit: "Envoyer",
          },
          notification: {
            success: "Action réussie.",
          },
          form: {
            fullName: "Nom Complet",
            email: "E‑mail",
            serviceType: "Type de Service",
            details: "Détails",
            date: "Date",
            time: "Heure",
          },
          placeholder: {
            fullName: "Votre nom complet",
            emailFor: "Saisissez votre e‑mail pour {{service}}",
            serviceType: "{{action}} {{service}}",
            details: "Décrivez votre demande {{service}}...",
            date: "jj/mm/aaaa",
            time: "10:30",
          },

          // ---------------- Who we are page  ---------------
          whoWeAre: {
            title: "Qui Nous Sommes",
            description:
              "Laurindo Muginga Commerce et Prestation de Services est une entreprise de services et de commerce offrant qualité, professionnalisme et responsabilité sociale. Nous visons à fournir un service de qualité et personnalisé. Nous existons pour servir et continuerons à servir avec responsabilité et dévouement, montrant que le client est la raison de notre existence.",
            missionTitle: "Mission",
            mission:
              "Fournir des repas à la commande, des services de buffet et la vente de boissons.\nOpérer de manière rentable, avec responsabilité sociale, et contribuer à la croissance du pays.\nOffrir aux clients confort, bien-être, nourriture saine et sécurité.\nCréer de la valeur et faire la différence partout où nous opérons.",
            visionTitle: "Vision",
            vision:
              'Nous voulons croître, devenir rentables, nous stabiliser et assurer la santé financière de l’entreprise "CRES."',
            valuesTitle: "Valeurs",
            values: [
              'Éthique: Respect mutuel, faire "ce qui est juste" et être authentique.',
              "Capacité: Appliquer notre formation et expérience à l'amélioration continue.",
              "Compétence: Bien faire les choses et assumer les responsabilités.",
              "Courage: Relever les défis et prendre les risques nécessaires.",
              "Créativité: Réinventer le chemin et chercher des alternatives.",
              "Cœur: L’amitié et l’esprit d’équipe créent des liens de fraternité et de solidarité.",
              "Engagement: Valoriser et exercer ces valeurs au travail et dans la vie.",
            ],
            differentiatorsTitle: "Différenciateurs",
            differentiators:
              "Une entreprise qui privilégie des valeurs morales et spirituelles telles que la foi, l’humilité, la perspicacité, la bonté et l’altruisme. Notre politique de Qualité, Environnement, Sécurité, Santé et Responsabilité Sociale vise l’innovation, la compétitivité et l’harmonie avec les personnes et l’environnement.",
            footer: {
              phones: "Téléphones",
              address: "Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola",
              copyright: "Tous droits réservés.",
            },
          },

          // --------------- Learn More Page ------------------
          overview: {
            title: "🧭 Aperçu du service",
            content:
              "LM-Ltd Services est une plateforme modulaire conçue pour rationaliser la livraison de données...",
          },
          howItWorks: {
            title: "Fonctionnement",
            content:
              "Le flux LM-Ltd par des routes backend Express qui exposent des endpoints RESTful...",
          },
          benefitsValues: {
            title: "Avantages & Valeur",
            content: [
              "Accès plus rapide aux données et images",
              "Rendu fiable des images statiques via Express",
              "Architecture évolutive avec composants modulaires",
              "Code maintenable avec séparation claire des responsabilités",
            ],
          },
          useCases: {
            title: "Cas d’utilisation",
            content:
              "LM-Ltd Services est idéal pour les plateformes promotionnelles nécessitant des affichages dynamiques...",
          },
          techStack: {
            title: "Transparence de la stack technique",
            content:
              "LM-Ltd Services est construit avec React pour le frontend et Express pour le backend...",
          },
          developerFeatures: {
            title: "Fonctionnalités pour développeurs",
            content:
              "Les développeurs peuvent consulter la documentation API avec descriptions claires...",
          },
          scalability: {
            title: "Scalabilité & Fiabilité",
            content:
              "LM-Ltd Services est conçu pour une haute disponibilité et performance...",
          },
          callToAction: {
            title: "📞 Appel à l’action",
            content:
              "Prêt à explorer LM-Ltd Services ? Planifiez une démo, consultez la documentation ou contactez-nous...",
          },
          weddingTitle: "Témoignages de mariage",
          tutoringTitle: "Témoignages de tutorat en chimie",
        },
      },
    },
  });

export default i18n;
