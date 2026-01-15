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

          // --------- Rooms Management --------------
          rooms: "Rooms",
          room: "Room",
          addRoom: "Add Room",
          addNewRoom: "Add New Room",
          editRoom: "Edit Room",
          adminOnly: "Admin Only",
          sessionExpired: "Session expired. Please log in again.",
          errorOccurred: "An error occurred.",
          noRoomsFound: "No rooms found.",
          deleteConfirm: "Delete this room?",
          uploadProgress: "Upload Progress",

          // --------- Room Details Modal -----------
          loading: "Loading ...",
          loadingRoomDetails: "Loading room details ...",
          error: "Error",
          failedToLoad: "Failed to load",
          noData: "No data",
          noRoomData: "No room data available.",
          untitledRoom: "Untitled room",
          noImages: "No images",
          description: "Description",
          noDescription: "No description provided.",
          location: "Location",
          availability: "Availability",
          from: "From",
          to: "To",
          details: "Details",
          price: "Price",
          capacity: "Capacity",
          guests: "guests",
          bedrooms: "Bedrooms",
          bathrooms: "Bathrooms",
          amenities: "Amenities",
          rules: "Rules",
          close: "Close",
          nA: "N/A",
          open: "Open",
          edit: "Edit",
          delete: "Delete",

          // -------- Room Form Modal -----------
          mustBeAdmin: "You must be an admin to create rooms.",
          provideTitleAndPrice: "Please provide at least a title and price.",
          mustBeSignedIn: "You must be signed in to create a room.",
          roomCreated: "Room created successfully.",
          failedToCreateRoom: "Failed to create room",
          title: "Title",
          roomTitlePlaceholder: "Room title",
          descriptionPlaceholder: "Short description",
          address: "Address",
          addressPlaceholder: "Street address",
          city: "City",
          country: "Country",
          pricePerNight: "Price per night",
          pricePreview: "Price preview",
          minNights: "Min nights",
          maxNights: "Max nights",
          addAmenityPlaceholder: "Add amenity (e.g. Wifi)",
          addRulePlaceholder: "Add rule (e.g. No smoking)",
          add: "Add",
          images: "Images",
          imagesHelp: "It's possible to select up to 12 images, 5MB each.",
          cancel: "Cancel",
          saving: "Saving",
          createRoom: "Create Room",
          updateRoom: "Update Room",
          failedToUpdateRoom: "Failed to update room",
          roomUpdated: "Room updated successfully.",
          confirmDeleteRoom: "Are you sure you want to delete this room?",
          deletingRoom: "Deleting room...",
          roomDeleted: "Room deleted successfully.",
          failedToDeleteRoom: "Failed to delete room",

          // ---------- RoomCardWithPay -----------
          priceNA: "Price: N/A",
          bedroomsShort: "br",
          bathroomsShort: "ba",
          book: "Book",
          pay: "Pay",

          // ----------- Room Card ------------------
          previous: "Previous",
          next: "Next",
          night: "night",
          view: "View",
          editAria: "Edit {{title}}",

          // ---------------- RoomListingRequest --------------
          "Room Listing Request": "Room Listing Request",
          "Room Title": "Room Title",
          Description: "Description",
          Capacity: "Capacity",
          Bedrooms: "Bedrooms",
          Bathrooms: "Bathrooms",
          "Instant Book": "Instant Book",
          "Min Nights": "Min Nights",
          "Max Nights": "Max Nights",
          Terms: "Terms",
          "Select term": "Select term",
          Selected: "Selected",
          Pricing: "Pricing",
          "Price Amount": "Price Amount",
          Currency: "Currency",
          "Select Currency": "Select Currency",
          Location: "Location",
          Address: "Address",
          City: "City",
          Region: "Region",
          Country: "Country",
          "Coordinates (lat, lng)": "Coordinates (lat, lng)",
          "Amenities (comma separated)": "Amenities (comma separated)",
          "Rules (comma separated)": "Rules (comma separated)",
          "You can upload up to 12 images.": "You can upload up to 12 images.",
          Contact: "Contact",
          "Your Name": "Your Name",
          Email: "Email",
          Phone: "Phone",
          "I acknowledge the contract for listing and agree to the terms.":
            "I acknowledge the contract for listing and agree to the terms.",
          "listing contract": "listing contract",
          "Submitting ...": "Submitting ...",
          "Submit Listing": "Submit Listing",
          Reset: "Reset",
          "Thank you for booking!": "Thank you for booking!",
          "Payment Instructions": "Payment Instructions",
          Notice: "Notice",
          Bank: "Bank",
          "Account name": "Account name",
          "Account number": "Account number",
          IBAN: "IBAN",
          Reference: "Reference",
          "Please include your listing ID or email":
            "Please include your listing ID or email",
          "After you complete the payment, please reply to the confirmation email or contact support at":
            "After you complete the payment, please reply to the confirmation email or contact support at",
          Close: "Close",
          "Required:": "Required:",
          Saved: "Saved",
          "Price per night is required.": "Price per night is required.",
          "Room title is required.": "Room title is required.",
          "Description is required.": "Description is required.",
          "Your name is required.": "Your name is required.",
          "Email is required.": "Email is required.",
          "Phone is required.": "Phone is required.",
          "You must acknowledge the listing terms.":
            "You must acknowledge the listing terms.",
          "Invalid email address.": "Invalid email address.",
          "Invalid phone number.": "Invalid phone number.",
          "Select term placeholder": "Select term",
          "Select Currency placeholder": "Select Currency",

          // ----------- Contracts Page ----------------
          // Page title and meta
          "page.title": "Listing Agreement — LM-Ltd Services and Owner",
          "effectiveDate.label": "Effective date:",
          "owner.label": "Owner:",
          "phone.label": "Phone:",

          // Sections and their full text
          "term.title": "Term",
          "term.text":
            "Owner selects 1 (13.5%) / 3 (10.5%) / 6 (8.5%) months (circle one). The selected term governs the initial duration of this Listing Agreement.",

          "fees.title": "Fees and payment",
          "fees.text":
            "Owner agrees to pay the commission percentage or one-time fee described in the chosen plan. For hybrid plans, an upfront listing fee of $20 × months is charged at listing start; commission applies to rent collected.",

          "billing.title": "Billing timing",
          "billing.text":
            "Per-booking commissions are charged at the time of each rent collection. One-time fees are charged at listing start. Processing fees are passed through as applicable.",

          "payouts.title": "Payouts to owner",
          "payouts.text":
            "Platform remits owner payouts 7 days after confirmed check-in/receipt. The exact payout timing will be displayed in the owner's payout settings.",

          "refunds.title": "Refunds and prorating",
          "refunds.text":
            "If owner terminates early, fees are prorated on a daily basis for the unused portion; platform retains fees for services rendered. Platform may withhold refunds for unresolved disputes or outstanding chargebacks.",

          "cancellations.title": "Cancellations and disputes",
          "cancellations.text":
            "Cancellation rules follow the published cancellation policy. Disputes must be submitted within 3 days of checkout.",

          "taxes.title": "Taxes and compliance",
          "taxes.text":
            "Owner is responsible for local lodging taxes unless platform is contracted to collect and remit them. Platform will display taxes at checkout where required by law.",

          "damage.title": "Damage and security deposits",
          "damage.text":
            "Platform may require a card pre-authorization or hold for incidental damages; capture will occur only on validated claims.",

          "data.title": "Data and privacy",
          "data.text":
            "Platform will process owner and guest data in accordance with its privacy policy.",

          "termination.title": "Termination and renewal",
          "termination.text":
            "This Agreement auto-renews unless either party gives 30 days' notice prior to the term end.",

          "governing.title": "Governing law and dispute resolution",
          "governing.text":
            "This Agreement is governed by the laws of Luanda, Angola. Any disputes will be resolved under those laws.",

          "signatures.title": "Signatures",
          "signatures.text":
            "By clicking Agree and Acknowledge, the Owner digitally agrees to and acknowledges the terms of this Listing Agreement.",

          // Buttons / UI
          "button.agree": "Agree and Acknowledge",
          "button.saving": "Saving...",
          "spinner.saving.aria": "Saving",

          // Notices / errors
          "notice.acknowledgeSaveFailed":
            "We were unable to save your acknowledgement to the server. Your agreement is stored locally.",

          // ----------- Room Page -------------------
          // Dashboard / tabs
          "dashboard.tabOverview": "Overview",
          "dashboard.tabBookings": "My Bookings",
          "dashboard.availableRooms": "Available rooms",
          "dashboard.pay": "Pay",
          "dashboard.payConfirm":
            "You will be redirected to a secure payment page.",
          "dashboard.cancel": "Cancel",
          "dashboard.proceedToPay": "Proceed to payment",
          "dashboard.accessDenied":
            "Access denied. This area is for users only.",

          // Room page messages
          "roomPage.noRooms": "No rooms available.",
          "roomPage.noDescription": "No description available.",
          "roomPage.detailsTitle": "Room details",
          "roomPage.bookRoom": "Book room",
          "roomPage.bookThisRoom": "Book this room",
          "roomPage.close": "Close",
          "roomPage.maxGuests": "Max guests:",

          // Errors and messages
          "roomPage.errors.loadRooms": "Failed to load rooms.",
          "roomPage.errors.loadBookings": "Failed to load bookings.",
          "roomPage.messages.bookingsEndpointUnavailable":
            "Bookings endpoint not available on the server. You can still create bookings; they will appear here after creation.",

          // Bank modal
          "roomPage.paymentInstructionsTitle": "Payment instructions",
          "roomPage.bankModal.thankYou":
            "Thank you for your booking. Pay the booking in the next 48 hours to avoid cancellation.",
          "roomPage.bankModal.contactSupport":
            "If you need help contact the support team",
          "roomPage.bankModal.bank": "Bank:",
          "roomPage.bankModal.accountName": "Account name:",
          "roomPage.bankModal.accountNumber": "Account number:",
          "roomPage.bankModal.iban": "IBAN:",
          "roomPage.bankModal.reference": "Reference:",
          "roomPage.bankModal.amount": "Amount:",
          "roomPage.bankModal.loading": "Loading payment details...",
          "roomPage.bankModal.close": "Close",

          // ------------- RoomBookingModal --------------
          "roomBooking.title": "Book {{roomName}}",
          "roomBooking.startDate": "Start Date",
          "roomBooking.endDate": "End Date",
          "roomBooking.dateOfBirth": "Date of Birth",
          "roomBooking.guests": "Guests",
          "roomBooking.idDocumentLabel":
            "ID Document (passport or government ID)",
          "roomBooking.cancel": "Cancel",
          "roomBooking.book": "Book",
          "roomBooking.booking": "Booking...",
          "roomBooking.success": "Booking successful",
          "roomBooking.error.uploadId": "Please upload an ID document",
          "roomBooking.error.dates": "Please select start and end dates",
          "roomBooking.error.dob": "Please enter date of birth",
          "roomBooking.error.generic": "Booking failed",
          "roomBooking.file.accept": "image/*,application/pdf",

          // ------------- BookingForm -----------------
          // Form labels
          "booking.startDate": "Start date",
          "booking.endDate": "End date",
          "booking.guests": "Guests",
          "booking.primaryGuestName": "Primary guest name",
          "booking.primaryGuestEmail": "Primary guest email",
          "booking.secondaryGuestName": "Secondary guest name (optional)",
          "booking.secondaryGuestEmail": "Secondary guest email (optional)",
          "booking.primaryGuestPhone": "Primary guest phone",
          "booking.dateOfBirth": "Date of birth",
          "booking.paymentMethod": "Payment method",
          "booking.paymentMethod.card": "Card",
          "booking.paymentMethod.bank": "Bank transfer",
          "booking.notes": "Notes (optional)",
          "booking.idDocumentLabel": "ID Document / Passport (required)",
          "booking.idDocumentHelp": "Max 10MB. PDF or image formats accepted.",
          "booking.cancel": "Cancel",
          "booking.submit": "Book room",
          "booking.submitting": "Booking...",
          "booking.progressLabel": "Upload progress",

          // Success / info
          "booking.success": "Booking created successfully.",
          "booking.bookingsEndpointUnavailable":
            "Bookings endpoint not available on the server. You can still create bookings; they will appear here after creation.",

          // Validation / errors
          "booking.error.noRoom": "No room selected.",
          "booking.error.noUser": "No user available. Please sign in.",
          "booking.error.datesRequired":
            "Start date and end date are required.",
          "booking.error.invalidDate": "Invalid date format.",
          "booking.error.endBeforeStart": "End date must be after start date.",
          "booking.error.guestsPositive": "Guests must be a positive integer.",
          "booking.error.primaryNameRequired":
            "Primary guest name is required.",
          "booking.error.dobRequired": "Date of birth is required.",
          "booking.error.invalidDob": "Invalid date of birth.",
          "booking.error.ageMinimum":
            "Guest must be at least 18 years old to book.",
          "booking.error.idRequired":
            "Government ID / passport upload (idDocument) is required.",
          "booking.error.idTooLarge":
            "ID file is too large. Maximum 10MB allowed.",
          "booking.error.invalidEmail": "Primary guest email is invalid.",
          "booking.error.invalidEmailSecondary":
            "Secondary guest email is invalid.",
          "booking.error.createFailed":
            "Failed to create booking. Please try again.",

          // ----------- Bookings -----------------
          bookings: {
            title: "My Bookings",
            empty: "No bookings yet.",
            confirmCancel: "Cancel this booking?",
            error: {
              load: "Failed to load bookings",
              cancel: "Cancel failed",
              details: "Failed to load booking details",
            },
          },

          // ------------ BookingFormWithModal ---------------
          bookingModal: {
            payTitle: "Pay: {{roomName}}",
            paymentInstructions: "Payment instructions",
            bankTransferTitle: "Bank transfer instructions",
            bank: "Bank",
            accountName: "Account name",
            accountNumber: "Account number",
            routing: "Routing / Sort code",
            iban: "IBAN",
            reference: "Reference",
            amount: "Amount",
            copy: "Copy",
            copied: "Copied {{field}}",
            copyHint: "Use the Copy buttons to copy details to clipboard.",
            close: "Close",
            room: "room",
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
          // "dashboard.sendProof": "Send Payment Proof",
          "dashboard.status": "Status",
          "status.paid_full": "Paid in Full",
          "status.paid_half": "Partially Paid",
          "status.unpaid": "Unpaid",
          "dashboard.payService": "Pay Service",
          "dashboard.sendProof": "Send Proof",

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

          "payment.instructionsTitle": "Bank transfer instructions",
          "payment.reference": "Reference",
          "payment.bankName": "Bank",
          "payment.accountName": "Account name",
          "payment.accountNumber": "Account number",
          "payment.routingNumber": "Routing/IBAN",
          "payment.amount": "Amount",
          "payment.close": "Close",
          "payment.instructionsNote":
            "After you complete the transfer or deposit, please upload the proof of payment using the UPLOAD PROOF button. If you need help contact the support team",

          "payment.paymentError": "Payment failed",
          "payment.title": "Pay for service",
          "payment.method.card": "Card",
          "payment.method.bank": "Bank transfer",
          "payment.cancel": "Cancel",
          "payment.pay": "Pay details",

          // ---------- UserOnlyDashboard -----------
          "dashboard.title": "User Dashboard",
          "dashboard.welcome": "Welcome, {{name}}",
          "dashboard.email": "Email",
          "dashboard.role": "Role",
          "dashboard.overview": "Your Service Overview",
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
            pay: "Bank details",
            paid: "Paid",
            view: "View",
            payConfirm: "You will be redirected to a secure payment page.",
            cancel: "Cancel",
            proceedToPay: "Proceed to payment",
            availableRooms: "Available rooms",
            tabOverviewLabel: "Overview",
            noImage: "No image available",
            sendProof: "Send Proof",
            scheduleService: "Schedule Service",
            requestService: "Request Service",
            failedRequested: "Failed to load requested services.",
            failedScheduled: "Failed to load scheduled services.",
            failedShared: "Failed to load shared services",
          },
          schedule: {
            title: "Schedule Service",
            fullName: "Full name",
            email: "Email",
            date: "Date",
            time: "Time",
            optionalTime: "Optional — pick a time if you prefer",
            cancel: "Cancel",
            confirm: "Confirm",
            saving: "Saving...",
            errors: {
              dateRequired: "Please select a date.",
              submitFailed: "Failed to schedule service. Try again.",
            },
          },
          request: {
            title: "Request Service",
            fullName: "Full name",
            email: "Email",
            details: "Details",
            detailsPlaceholder: "Describe what you need",
            cancel: "Cancel",
            confirm: "Submit request",
            saving: "Submitting...",
            errors: {
              detailsRequired: "Please provide details for your request.",
              submitFailed: "Failed to submit request. Try again.",
            },
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
          // Email: "Email",
          // Phone: "Phone",
          "Save Changes": "Save Changes",
          // Close: "Close",
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

        //---------------------------------------------
        //  RequestServiceModal
        //---------------------------------------------
        request: {
          title: "Request Service",
          unknownService: "Service",
          fullName: "Full name",
          email: "Email",
          details: "Details",
          detailsPlaceholder: "Describe what you need...",
          sharedEmailPlaceholder: "No shared email provided",
          sharedEmailMissing:
            "No shared email is associated with this service.",
          cancel: "Cancel",
          saving: "Saving...",
          confirm: "Confirm",
          errors: {
            detailsRequired: "Please provide details for your request.",
            submitFailed: "Failed to submit request. Please try again.",
          },
          requestedAt: "Requested date",
        },
      },

      //================================================================
      //                 PORTUGUESE
      //================================================================
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

          // --------- Rooms Management -----------
          rooms: "Quartos",
          room: "Quarto",
          addRoom: "Adicionar quarto",
          addNewRoom: "Adicionar novo quarto",
          editRoom: "Editar quarto",
          adminOnly: "Apenas administrador",
          sessionExpired: "Sessão expirada. Por favor, faça login novamente.",
          errorOccurred: "Ocorreu um erro.",
          noRoomsFound: "Nenhum quarto encontrado.",
          deleteConfirm: "Excluir este quarto?",
          uploadProgress: "Progresso do envio",

          // --------- Room Details Modal -----------

          loading: "Carregando ...",
          loadingRoomDetails: "Carregando detalhes do quarto ...",
          error: "Erro",
          failedToLoad: "Falha ao carregar",
          noData: "Sem dados",
          noRoomData: "Nenhum dado do quarto disponível.",
          untitledRoom: "Quarto sem título",
          noImages: "Sem imagens",
          description: "Descrição",
          noDescription: "Nenhuma descrição fornecida.",
          location: "Localização",
          availability: "Disponibilidade",
          from: "De",
          to: "Até",
          details: "Detalhes",
          price: "Preço",
          capacity: "Capacidade",
          guests: "hóspedes",
          bedrooms: "Quartos",
          bathrooms: "Banheiros",
          amenities: "Comodidades",
          rules: "Regras",
          close: "Fechar",
          nA: "N/D",
          open: "Abrir",
          edit: "Editar",
          delete: "Excluir",

          // -------- Room Form Modal -----------
          mustBeAdmin: "Você deve ser administrador para criar quartos.",
          provideTitleAndPrice:
            "Por favor, forneça pelo menos um título e preço.",
          mustBeSignedIn: "Você deve estar conectado para criar um quarto.",
          failedToCreateRoom: "Falha ao criar o quarto",
          title: "Título",
          roomTitlePlaceholder: "Título do quarto",
          descriptionPlaceholder: "Descrição curta",
          address: "Endereço",
          addressPlaceholder: "Endereço",
          city: "Cidade",
          country: "País",
          pricePerNight: "Preço por noite",
          pricePreview: "Pré-visualização do preço",
          minNights: "Mínimo de noites",
          maxNights: "Máximo de noites",
          addAmenityPlaceholder: "Adicionar comodidade (ex.: Wifi)",
          addRulePlaceholder: "Adicionar regra (ex.: Proibido fumar)",
          add: "Adicionar",
          images: "Imagens",
          imagesHelp: "É possível selecionar até 12 imagens, 5MB cada.",
          cancel: "Cancelar",
          saving: "Salvando",
          createRoom: "Criar Quarto",
          updateRoom: "Atualizar Quarto",
          deleteRoom: "Excluir Quarto",
          confirmDelete: "Tem certeza de que deseja excluir este quarto?",
          deleting: "Excluindo...",
          failedToDeleteRoom: "Falha ao excluir o quarto.",
          failedToUpdateRoom: "Falha ao atualizar o quarto.",

          // ---------- RoomCardWithPay -----------
          priceNA: "Preço: N/D",
          bedroomsShort: "qd",
          bathroomsShort: "wc",
          book: "Reservar",
          pay: "Pagar",

          // ----------- Room Card ------------------
          previous: "Anterior",
          next: "Seguinte",
          night: "noite",
          view: "Ver",
          editAria: "Editar {{title}}",

          // ---------------- RoomListingRequest --------------
          "Room Listing Request": "Pedido para Anúnciar Quarto",
          "Room Title": "Título do quarto",
          Description: "Descrição",
          Capacity: "Capacidade",
          Bedrooms: "Quartos",
          Bathrooms: "Casas de banho",
          "Instant Book": "Reserva instantânea",
          "Min Nights": "Noites mín.",
          "Max Nights": "Noites máx.",
          Terms: "Condições",
          "Select term": "Selecionar prazo",
          Selected: "Selecionado",
          Pricing: "Preços",
          "Price Amount": "Valor",
          Currency: "Moeda",
          "Select Currency": "Selecionar moeda",
          Location: "Localização",
          Address: "Endereço",
          City: "Cidade",
          Region: "Região",
          Country: "País",
          "Coordinates (lat, lng)": "Coordenadas (lat, lng)",
          "Amenities (comma separated)": "Comodidades (separadas por vírgula)",
          "Rules (comma separated)": "Regras (separadas por vírgula)",
          "You can upload up to 12 images.": "Pode carregar até 12 imagens.",
          Contact: "Contacto",
          "Your Name": "O seu nome",
          Email: "Email",
          Phone: "Telefone",
          "I acknowledge the contract for listing and agree to the terms.":
            "Reconheço o contrato de anúncio e concordo com os termos.",
          "listing contract": "contrato de anúncio",
          "Submitting ...": "A submeter ...",
          "Submit Listing": "Submeter pedido",
          Reset: "Repor",
          "Thank you for booking!": "Obrigado pela submissão!",
          "Payment Instructions": "Instruções de pagamento",
          Notice: "Aviso",
          Bank: "Banco",
          "Account name": "Nome da conta",
          "Account number": "Número da conta",
          IBAN: "IBAN",
          Reference: "Referência",
          "Please include your listing ID or email":
            "Por favor inclua o ID do anúncio ou o seu e-mail",
          "After you complete the payment, please reply to the confirmation email or contact support at":
            "Após efetuar o pagamento, responda ao e-mail de confirmação ou contacte o suporte em",
          Close: "Fechar",
          "Required:": "Obrigatório:",
          Saved: "Guardado",
          "Price per night is required.": "O preço por noite é obrigatório.",
          "Room title is required.": "O título do quarto é obrigatório.",
          "Description is required.": "A descrição é obrigatória.",
          "Your name is required.": "O seu nome é obrigatório.",
          "Email is required.": "O e-mail é obrigatório.",
          "Phone is required.": "O telefone é obrigatório.",
          "You must acknowledge the listing terms.":
            "Deve aceitar os termos do anúncio.",
          "Invalid email address.": "Endereço de e-mail inválido.",
          "Invalid phone number.": "Número de telefone inválido.",
          "Select term placeholder": "Selecionar prazo",
          "Select Currency placeholder": "Selecionar moeda",

          // ----------
          // Page title and meta
          "page.title": "Contrato de Anúncio — LM-Ltd Services e Proprietário",
          "effectiveDate.label": "Data de vigência:",
          "owner.label": "Proprietário:",
          "phone.label": "Telefone:",

          // Sections and their full text
          "term.title": "Prazo",
          "term.text":
            "O proprietário seleciona 1 (13,5%) / 3 (10,5%) / 6 (8,5%) meses (circule um). O prazo selecionado rege a duração inicial deste Contrato de Anúncio.",

          "fees.title": "Taxas e pagamento",
          "fees.text":
            "O proprietário concorda em pagar a percentagem de comissão ou a taxa única descrita no plano escolhido. Para planos híbridos, uma taxa inicial de listagem de $20 × meses é cobrada no início; a comissão aplica-se ao aluguer cobrado.",

          "billing.title": "Momento de faturação",
          "billing.text":
            "As comissões por reserva são cobradas no momento de cada cobrança de aluguer. As taxas únicas são cobradas no início da listagem. As taxas de processamento são repassadas conforme aplicável.",

          "payouts.title": "Pagamentos ao proprietário",
          "payouts.text":
            "A plataforma efetua os pagamentos ao proprietário 7 dias após o check-in/recebimento confirmado. O tempo exato de pagamento será exibido nas definições de pagamento do proprietário.",

          "refunds.title": "Reembolsos e rateio",
          "refunds.text":
            "Se o proprietário rescindir antecipadamente, as taxas são prorrogadas diariamente para a parte não utilizada; a plataforma retém taxas pelos serviços prestados. A plataforma pode reter reembolsos por litígios não resolvidos ou estornos pendentes.",

          "cancellations.title": "Cancelamentos e litígios",
          "cancellations.text":
            "As regras de cancelamento seguem a política de cancelamento publicada. Litígios devem ser apresentados dentro de 3 dias após o check-out.",

          "taxes.title": "Impostos e conformidade",
          "taxes.text":
            "O proprietário é responsável pelos impostos locais de alojamento, salvo se a plataforma estiver contratada para os recolher e entregar. A plataforma exibirá impostos no checkout quando exigido por lei.",

          "damage.title": "Danos e depósitos de segurança",
          "damage.text":
            "A plataforma pode exigir uma pré-autorização de cartão ou retenção para danos incidentais; a captura ocorrerá apenas em reclamações validadas.",

          "data.title": "Dados e privacidade",
          "data.text":
            "A plataforma processará os dados do proprietário e do hóspede de acordo com a sua política de privacidade.",

          "termination.title": "Rescisão e renovação",
          "termination.text":
            "Este Acordo renova-se automaticamente, salvo se qualquer das partes der aviso prévio de 30 dias antes do término do prazo.",

          "governing.title": "Lei aplicável e resolução de litígios",
          "governing.text":
            "Este Acordo é regido pelas leis de Luanda, Angola. Quaisquer litígios serão resolvidos ao abrigo dessas leis.",

          "signatures.title": "Assinaturas",
          "signatures.text":
            "Ao clicar em Concordar e Reconhecer, o Proprietário concorda digitalmente e reconhece os termos deste Contrato de Anúncio.",

          // Buttons / UI
          "button.agree": "Concordo e Assino",
          "button.saving": "A gravar...",
          "spinner.saving.aria": "A gravar",

          // Notices / errors
          "notice.acknowledgeSaveFailed":
            "Não foi possível guardar o seu reconhecimento no servidor. O seu acordo está armazenado localmente.",

          // ------------- Room Page ------------------
          // Dashboard / tabs
          "dashboard.tabOverview": "Visão geral",
          "dashboard.tabBookings": "Minhas Reservas",
          "dashboard.availableRooms": "Quartos disponíveis",
          "dashboard.pay": "Pagar",
          "dashboard.payConfirm":
            "Será redirecionado para uma página de pagamento segura.",
          "dashboard.cancel": "Cancelar",
          "dashboard.proceedToPay": "Prosseguir para pagamento",
          "dashboard.accessDenied":
            "Acesso negado. Esta área é apenas para utilizadores.",

          // Room page messages
          "roomPage.noRooms": "Nenhum quarto disponível.",
          "roomPage.noDescription": "Nenhuma descrição disponível.",
          "roomPage.detailsTitle": "Detalhes do quarto",
          "roomPage.bookRoom": "Reservar quarto",
          "roomPage.bookThisRoom": "Reservar este quarto",
          "roomPage.close": "Fechar",
          "roomPage.maxGuests": "Máx. hóspedes:",

          // Errors and messages
          "roomPage.errors.loadRooms": "Falha ao carregar quartos.",
          "roomPage.errors.loadBookings": "Falha ao carregar reservas.",
          "roomPage.messages.bookingsEndpointUnavailable":
            "Ponto de extremidade de reservas não disponível no servidor. Ainda pode criar reservas; elas aparecerão aqui após a criação.",

          // Bank modal
          "roomPage.paymentInstructionsTitle": "Instruções de pagamento",
          "roomPage.bankModal.thankYou":
            "Obrigado pela sua reserva. Pague a reserva nas próximas 48 horas para evitar o cancelamento.",
          "roomPage.bankModal.contactSupport":
            "Se precisar de ajuda contacte a equipa de suporte",
          "roomPage.bankModal.bank": "Banco:",
          "roomPage.bankModal.accountName": "Nome da conta:",
          "roomPage.bankModal.accountNumber": "Número da conta:",
          "roomPage.bankModal.iban": "IBAN:",
          "roomPage.bankModal.reference": "Referência:",
          "roomPage.bankModal.amount": "Montante:",
          "roomPage.bankModal.loading": "A carregar detalhes de pagamento...",
          "roomPage.bankModal.close": "Fechar",

          // ----------- RoomBookingModal ----------------
          "roomBooking.title": "Reservar {{roomName}}",
          "roomBooking.startDate": "Data de início",
          "roomBooking.endDate": "Data de fim",
          "roomBooking.dateOfBirth": "Data de nascimento",
          "roomBooking.guests": "Hóspedes",
          "roomBooking.idDocumentLabel":
            "Documento de identificação (passaporte ou documento do governo)",
          "roomBooking.cancel": "Cancelar",
          "roomBooking.book": "Reservar",
          "roomBooking.booking": "A reservar...",
          "roomBooking.success": "Reserva bem-sucedida",
          "roomBooking.error.uploadId":
            "Por favor carregue um documento de identificação",
          "roomBooking.error.dates":
            "Por favor selecione as datas de início e fim",
          "roomBooking.error.dob": "Por favor introduza a data de nascimento",
          "roomBooking.error.generic": "A reserva falhou",
          "roomBooking.file.accept": "image/*,application/pdf",

          // ------------ BookingForm ----------------
          "booking.startDate": "Data de início",
          "booking.endDate": "Data de fim",
          "booking.guests": "Hóspedes",
          "booking.primaryGuestName": "Nome do hóspede principal",
          "booking.primaryGuestEmail": "Email do hóspede principal",
          "booking.secondaryGuestName": "Nome do segundo hóspede (opcional)",
          "booking.secondaryGuestEmail": "Email do segundo hóspede (opcional)",
          "booking.primaryGuestPhone": "Telefone do hóspede principal",
          "booking.dateOfBirth": "Data de nascimento",
          "booking.paymentMethod": "Método de pagamento",
          "booking.paymentMethod.card": "Cartão",
          "booking.paymentMethod.bank": "Transferência bancária",
          "booking.notes": "Notas (opcional)",
          "booking.idDocumentLabel":
            "Documento de identificação / Passaporte (obrigatório)",
          "booking.idDocumentHelp":
            "Máx. 10MB. Formatos PDF ou imagem aceites.",
          "booking.cancel": "Cancelar",
          "booking.submit": "Reservar quarto",
          "booking.submitting": "A reservar...",
          "booking.progressLabel": "Progresso do envio",

          // Success / info
          "booking.success": "Reserva criada com sucesso.",
          "booking.bookingsEndpointUnavailable":
            "Ponto de extremidade de reservas não disponível no servidor. Ainda pode criar reservas; elas aparecerão após a criação.",

          // Validation / errors
          "booking.error.noRoom": "Nenhum quarto selecionado.",
          "booking.error.noUser":
            "Nenhum utilizador disponível. Por favor inicie sessão.",
          "booking.error.datesRequired":
            "As datas de início e fim são obrigatórias.",
          "booking.error.invalidDate": "Formato de data inválido.",
          "booking.error.endBeforeStart":
            "A data de fim deve ser posterior à data de início.",
          "booking.error.guestsPositive":
            "Os hóspedes devem ser um inteiro positivo.",
          "booking.error.primaryNameRequired":
            "O nome do hóspede principal é obrigatório.",
          "booking.error.dobRequired": "A data de nascimento é obrigatória.",
          "booking.error.invalidDob": "Data de nascimento inválida.",
          "booking.error.ageMinimum":
            "O hóspede deve ter pelo menos 18 anos para reservar.",
          "booking.error.idRequired":
            "É obrigatório carregar um documento de identificação / passaporte.",
          "booking.error.idTooLarge":
            "O ficheiro de identificação é demasiado grande. Máximo 10MB permitido.",
          "booking.error.invalidEmail":
            "O email do hóspede principal é inválido.",
          "booking.error.invalidEmailSecondary":
            "O email do segundo hóspede é inválido.",
          "booking.error.createFailed":
            "Falha ao criar a reserva. Por favor tente novamente.",

          // ----------- Bookings -----------------
          bookings: {
            title: "Minhas Reservas",
            empty: "Ainda não existem reservas.",
            confirmCancel: "Cancelar esta reserva?",
            error: {
              load: "Falha ao carregar reservas",
              cancel: "Falha ao cancelar",
              details: "Falha ao carregar detalhes da reserva",
            },
          },

          // ------------ BookingFormWithModal ---------------
          bookingModal: {
            payTitle: "Pagar: {{roomName}}",
            paymentInstructions: "Instruções de pagamento",
            bankTransferTitle: "Instruções para transferência bancária",
            bank: "Banco",
            accountName: "Nome da conta",
            accountNumber: "Número da conta",
            routing: "Código de rota / Sort code",
            iban: "IBAN",
            reference: "Referência",
            amount: "Montante",
            copy: "Copiar",
            copied: "{{field}} copiado",
            copyHint: "Use os botões Copiar para copiar os detalhes.",
            close: "Fechar",
            room: "quarto",
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
          // "dashboard.sendProof": "Envie o Comprovativo de Pagamento",
          "dashboard.status": "Condição",
          "status.paid_full": "Pago",
          "status.paid_half": "Pago parcialmente",
          "status.unpaid": "Não pago",
          "dashboard.payService": "Pagamento",
          "dashboard.sendProof": "Enviar comprovativo",

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

          "payment.instructionsTitle": "Instruções para transferência bancária",
          "payment.reference": "Referência",
          "payment.bankName": "Banco",
          "payment.accountName": "Nome da conta",
          "payment.accountNumber": "Número da conta",
          "payment.routingNumber": "Routing/IBAN",
          "payment.amount": "Valor",
          "payment.close": "Fechar",
          "payment.instructionsNote":
            "Após concluir a transferência ou o depósito, carregue o comprovativo de pagamento através do botão CARREGAR COMPROVATIVO. Se precisar de ajuda, contacte a equipa de suporte",
          "payment.paymentError": "Pagamento falhou",
          "payment.title": "Pagar o serviço",
          "payment.method.card": "Cartão",
          "payment.method.bank": "Transferência bancária",
          "payment.cancel": "Cancelar",
          "payment.pay": "Como Pagar",

          // ---------- UserOnlyDashboard -----------
          "dashboard.title": "Painel do Usuário",
          "dashboard.welcome": "Bem-vindo, {{name}}",
          "dashboard.email": "Email",
          "dashboard.role": "Função",
          "dashboard.overview": "Visão Geral dos Seus Serviços",
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
            noImage: "A image não esta disponível",
            sendProof: "Enviar Comprovativo",
            scheduleService: "Agendar Serviço",
            requestService: "Solicitar Serviço",
            failedRequested: "Falha ao carregar serviços solicitados.",
            failedScheduled: "Falha ao carregar serviços agendados.",
            failedShared: "Falha ao carregar serviços partilhados.",
          },
          schedule: {
            title: "Agendar Serviço",
            fullName: "Nome completo",
            email: "Email",
            date: "Data",
            time: "Hora",
            optionalTime: "Opcional — escolha uma hora se preferir",
            cancel: "Cancelar",
            confirm: "Confirmar",
            saving: "A gravar...",
            errors: {
              dateRequired: "Por favor selecione uma data.",
              submitFailed: "Falha ao agendar o serviço. Tente novamente.",
            },
          },
          request: {
            title: "Solicitar Serviço",
            fullName: "Nome completo",
            email: "Email",
            details: "Detalhes",
            detailsPlaceholder: "Descreva o que precisa",
            cancel: "Cancelar",
            confirm: "Enviar pedido",
            saving: "A enviar...",
            errors: {
              detailsRequired: "Por favor forneça detalhes para o seu pedido.",
              submitFailed: "Falha ao enviar o pedido. Tente novamente.",
            },
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
          // Email: "E-mail",
          // Phone: "Telefone",
          "Save Changes": "Salvar Alterações",
          // Close: "Fechar",
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

        //---------------------------------------------
        //  RequestServiceModal
        //---------------------------------------------
        request: {
          title: "Solicitar Serviço",
          unknownService: "Serviço",
          fullName: "Nome completo",
          email: "Email",
          details: "Detalhes",
          detailsPlaceholder: "Descreva o que você precisa...",
          sharedEmailPlaceholder: "Nenhum email compartilhado fornecido",
          sharedEmailMissing:
            "Nenhum email compartilhado está associado a este serviço.",
          cancel: "Cancelar",
          saving: "Salvando...",
          confirm: "Confirmar",
          errors: {
            detailsRequired:
              "Por favor, forneça detalhes para sua solicitação.",
            submitFailed: "Falha ao enviar a solicitação. Tente novamente.",
          },
          requestedAt: "Data solicitada",
        },
      },

      //================================================================
      //                 FRANCH
      //================================================================
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

          // --------- Rooms Management -------------
          rooms: "Chambres",
          room: "Chambre",
          addRoom: "Ajouter une chambre",
          addNewRoom: "Ajouter une nouvelle chambre",
          editRoom: "Modifier la chambre",
          adminOnly: "Administrateur uniquement",
          sessionExpired: "Session expirée. Veuillez vous reconnecter.",
          errorOccurred: "Une erreur s'est produite.",
          noRoomsFound: "Aucune chambre trouvée.",
          deleteConfirm: "Supprimer cette chambre?",
          uploadProgress: "Progression du téléchargement",

          // --------- Room Details Modal -----------

          loading: "Chargement ...",
          loadingRoomDetails: "Chargement des détails de la chambre ...",
          error: "Erreur",
          failedToLoad: "Échec du chargement",
          noData: "Aucune donnée",
          noRoomData: "Aucune donnée de chambre disponible.",
          untitledRoom: "Chambre sans titre",
          noImages: "Pas d'images",
          description: "Description",
          noDescription: "Aucune description fournie.",
          location: "Emplacement",
          availability: "Disponibilité",
          from: "De",
          to: "À",
          details: "Détails",
          price: "Prix",
          capacity: "Capacité",
          guests: "invités",
          bedrooms: "Chambres",
          bathrooms: "Salles de bain",
          amenities: "Équipements",
          rules: "Règles",
          close: "Fermer",
          nA: "N/D",
          open: "Ouvrir",
          edit: "Modifier",
          delete: "Supprimer",

          // -------- Room Form Modal -----------
          mustBeAdmin:
            "Vous devez être administrateur pour créer des chambres.",
          provideTitleAndPrice:
            "Veuillez fournir au moins un titre et un prix.",
          mustBeSignedIn: "Vous devez être connecté pour créer une chambre.",
          roomCreated: "Chambre créée avec succès.",
          failedToCreateRoom: "Échec de la création de la chambre",
          title: "Titre",
          roomTitlePlaceholder: "Titre de la chambre",
          descriptionPlaceholder: "Brève description",
          address: "Adresse",
          addressPlaceholder: "Adresse",
          city: "Ville",
          country: "Pays",
          pricePerNight: "Prix par nuit",
          pricePreview: "Aperçu du prix",
          minNights: "Nuits min",
          maxNights: "Nuits max",
          addAmenityPlaceholder: "Ajouter un équipement (ex.: Wifi)",
          addRulePlaceholder: "Ajouter une règle (ex.: Interdit de fumer)",
          add: "Ajouter",
          images: "Images",
          imagesHelp:
            "Il est possible de sélectionner jusqu'à 12 images, 5 Mo chacune.",
          cancel: "Annuler",
          saving: "Enregistrement",
          createRoom: "Créer la chambre",
          updateRoom: "Mettre à jour la chambre",
          deleteRoom: "Supprimer la chambre",
          confirmDelete: "Confirmer la suppression",
          deleting: "Suppression...",
          failedToUpdateRoom: "Échec de la mise à jour de la chambre",
          roomUpdated: "Chambre mise à jour avec succès.",
          roomDeleted: "Chambre supprimée avec succès.",

          // --------- RoomCardWithPay -----------
          priceNA: "Prix : N/D",
          bedroomsShort: "ch",
          bathroomsShort: "wc",
          book: "Réserver",
          pay: "Payer",

          // ----------- Room Card ------------------
          previous: "Précédent",
          next: "Suivant",
          // priceNA: "Prix non disponible",
          night: "nuit",
          view: "Voir",
          editAria: "Modifier {{title}}",

          // ---------------- RoomListingRequest --------------
          "Room Listing Request": "Demande de mise en location",
          "Room Title": "Titre du logement",
          Description: "Description",
          Capacity: "Capacité",
          Bedrooms: "Chambres",
          Bathrooms: "Salles de bain",
          "Instant Book": "Réservation instantanée",
          "Min Nights": "Nuits min.",
          "Max Nights": "Nuits max.",
          Terms: "Conditions",
          "Select term": "Sélectionner la durée",
          Selected: "Sélectionné",
          Pricing: "Tarification",
          "Price Amount": "Montant",
          Currency: "Devise",
          "Select Currency": "Sélectionner la devise",
          Location: "Emplacement",
          Address: "Adresse",
          City: "Ville",
          Region: "Région",
          Country: "Pays",
          "Coordinates (lat, lng)": "Coordonnées (lat, lng)",
          "Amenities (comma separated)":
            "Équipements (séparés par des virgules)",
          "Rules (comma separated)": "Règles (séparées par des virgules)",
          "You can upload up to 12 images.":
            "Vous pouvez télécharger jusqu'à 12 images.",
          Contact: "Contact",
          "Your Name": "Votre nom",
          Email: "Email",
          Phone: "Téléphone",
          "I acknowledge the contract for listing and agree to the terms.":
            "Je reconnais le contrat de mise en location et j'accepte les conditions.",
          "listing contract": "contrat de mise en location",
          "Submitting ...": "Envoi ...",
          "Submit Listing": "Soumettre l'annonce",
          Reset: "Réinitialiser",
          "Thank you for booking!": "Merci pour votre inscription !",
          "Payment Instructions": "Instructions de paiement",
          Notice: "Avis",
          Bank: "Banque",
          "Account name": "Nom du compte",
          "Account number": "Numéro de compte",
          IBAN: "IBAN",
          Reference: "Référence",
          "Please include your listing ID or email":
            "Veuillez inclure votre identifiant d'annonce ou votre e-mail",
          "After you complete the payment, please reply to the confirmation email or contact support at":
            "Après avoir effectué le paiement, veuillez répondre à l'e-mail de confirmation ou contacter le support à",
          Close: "Fermer",
          "Required:": "Requis :",
          Saved: "Enregistré",
          "Price per night is required.": "Le prix par nuit est requis.",
          "Room title is required.": "Le titre du logement est requis.",
          "Description is required.": "La description est requise.",
          "Your name is required.": "Votre nom est requis.",
          "Email is required.": "L'email est requis.",
          "Phone is required.": "Le téléphone est requis.",
          "You must acknowledge the listing terms.":
            "Vous devez accepter les conditions de l'annonce.",
          "Invalid email address.": "Adresse e-mail invalide.",
          "Invalid phone number.": "Numéro de téléphone invalide.",
          "Select term placeholder": "Sélectionner la durée",
          "Select Currency placeholder": "Sélectionner la devise",

          // ---------- ContractPageListing ------------
          // Page title and meta
          "page.title":
            "Contrat de mise en location — LM-Ltd Services et Propriétaire",
          "effectiveDate.label": "Date d'entrée en vigueur :",
          "owner.label": "Propriétaire :",
          "phone.label": "Téléphone :",

          // Sections and their full text
          "term.title": "Durée",
          "term.text":
            "Le propriétaire choisit 1 (13,5 %) / 3 (10,5 %) / 6 (8,5 %) mois (entourez votre choix). La durée choisie régit la durée initiale du présent contrat de mise en location.",

          "fees.title": "Frais et paiement",
          "fees.text":
            "Le propriétaire accepte de payer le pourcentage de commission ou les frais uniques décrits dans le plan choisi. Pour les plans hybrides, des frais de mise en ligne initiaux de 20 $ × mois sont facturés au début de l'annonce ; la commission s'applique aux loyers perçus.",

          "billing.title": "Moment de facturation",
          "billing.text":
            "Les commissions par réservation sont facturées au moment de chaque encaissement de loyer. Les frais uniques sont facturés au début de l'annonce. Les frais de traitement sont répercutés le cas échéant.",

          "payouts.title": "Paiements au propriétaire",
          "payouts.text":
            "La plateforme verse les paiements au propriétaire 7 jours après l'enregistrement/confirmation du check-in. Le calendrier exact des paiements sera affiché dans les paramètres de paiement du propriétaire.",

          "refunds.title": "Remboursements et prorata",
          "refunds.text":
            "Si le propriétaire met fin au contrat de manière anticipée, les frais sont proratisés au jour pour la portion non utilisée ; la plateforme conserve les frais pour les services rendus. La plateforme peut retenir les remboursements en cas de litiges non résolus ou de rétrofacturations en cours.",

          "cancellations.title": "Annulations et litiges",
          "cancellations.text":
            "Les règles d'annulation suivent la politique d'annulation publiée. Les litiges doivent être soumis dans les 3 jours suivant le départ.",

          "taxes.title": "Taxes et conformité",
          "taxes.text":
            "Le propriétaire est responsable des taxes locales d'hébergement sauf si la plateforme est contractuellement chargée de les collecter et de les reverser. La plateforme affichera les taxes au paiement lorsque la loi l'exige.",

          "damage.title": "Dommages et dépôts de garantie",
          "damage.text":
            "La plateforme peut exiger une pré-autorisation de carte ou une retenue pour dommages éventuels ; la capture n'aura lieu qu'en cas de réclamations validées.",

          "data.title": "Données et confidentialité",
          "data.text":
            "La plateforme traitera les données du propriétaire et des invités conformément à sa politique de confidentialité.",

          "termination.title": "Résiliation et renouvellement",
          "termination.text":
            "Le présent accord est renouvelé automatiquement sauf si l'une des parties donne un préavis de 30 jours avant la fin de la période.",

          "governing.title": "Droit applicable et résolution des litiges",
          "governing.text":
            "Le présent accord est régi par les lois de Luanda, Angola. Tout litige sera résolu conformément à ces lois.",

          "signatures.title": "Signatures",
          "signatures.text":
            "En cliquant sur Accepter et reconnaître, le propriétaire accepte numériquement et reconnaît les termes du présent contrat de mise en location.",

          // Buttons / UI
          "button.agree": "Accepter et reconnaître",
          "button.saving": "Enregistrement...",
          "spinner.saving.aria": "Enregistrement",

          // Notices / errors
          "notice.acknowledgeSaveFailed":
            "Nous n'avons pas pu enregistrer votre accord sur le serveur. Votre accord est stocké localement.",

          // ------------ Room Page -------------------
          // Dashboard / tabs
          "dashboard.tabOverview": "Aperçu",
          "dashboard.tabBookings": "Mes réservations",
          "dashboard.availableRooms": "Chambres disponibles",
          "dashboard.pay": "Payer",
          "dashboard.payConfirm":
            "Vous serez redirigé vers une page de paiement sécurisée.",
          "dashboard.cancel": "Annuler",
          "dashboard.proceedToPay": "Procéder au paiement",
          "dashboard.accessDenied":
            "Accès refusé. Cette zone est réservée aux utilisateurs.",

          // Room page messages
          "roomPage.noRooms": "Aucune chambre disponible.",
          "roomPage.noDescription": "Aucune description disponible.",
          "roomPage.detailsTitle": "Détails de la chambre",
          "roomPage.bookRoom": "Réserver la chambre",
          "roomPage.bookThisRoom": "Réserver cette chambre",
          "roomPage.close": "Fermer",
          "roomPage.maxGuests": "Nombre max d'invités:",

          // Errors and messages
          "roomPage.errors.loadRooms": "Échec du chargement des chambres.",
          "roomPage.errors.loadBookings":
            "Échec du chargement des réservations.",
          "roomPage.messages.bookingsEndpointUnavailable":
            "Le point de terminaison des réservations n'est pas disponible sur le serveur. Vous pouvez toujours créer des réservations ; elles apparaîtront ici après création.",

          // Bank modal
          "roomPage.paymentInstructionsTitle": "Instructions de paiement",
          "roomPage.bankModal.thankYou":
            "Merci pour votre réservation. Payez la réservation dans les 48 heures pour éviter l'annulation.",
          "roomPage.bankModal.contactSupport":
            "Si vous avez besoin d'aide, contactez l'équipe de support",
          "roomPage.bankModal.bank": "Banque :",
          "roomPage.bankModal.accountName": "Nom du compte :",
          "roomPage.bankModal.accountNumber": "Numéro de compte :",
          "roomPage.bankModal.iban": "IBAN :",
          "roomPage.bankModal.reference": "Référence :",
          "roomPage.bankModal.amount": "Montant :",
          "roomPage.bankModal.loading": "Chargement des détails de paiement...",
          "roomPage.bankModal.close": "Fermer",

          // ------------ RoomBookingModal -------------------
          "roomBooking.title": "Réserver {{roomName}}",
          "roomBooking.startDate": "Date de début",
          "roomBooking.endDate": "Date de fin",
          "roomBooking.dateOfBirth": "Date de naissance",
          "roomBooking.guests": "Invités",
          "roomBooking.idDocumentLabel":
            "Document d'identité (passeport ou pièce d'identité)",
          "roomBooking.cancel": "Annuler",
          "roomBooking.book": "Réserver",
          "roomBooking.booking": "En cours de réservation...",
          "roomBooking.success": "Réservation réussie",
          "roomBooking.error.uploadId":
            "Veuillez télécharger un document d'identité",
          "roomBooking.error.dates":
            "Veuillez sélectionner les dates de début et de fin",
          "roomBooking.error.dob": "Veuillez saisir la date de naissance",
          "roomBooking.error.generic": "La réservation a échoué",
          "roomBooking.file.accept": "image/*,application/pdf",

          // ------------ BookingForm -------------------
          "booking.startDate": "Date de début",
          "booking.endDate": "Date de fin",
          "booking.guests": "Invités",
          "booking.primaryGuestName": "Nom du voyageur principal",
          "booking.primaryGuestEmail": "Email du voyageur principal",
          "booking.secondaryGuestName": "Nom du second voyageur (optionnel)",
          "booking.secondaryGuestEmail": "Email du second voyageur (optionnel)",
          "booking.primaryGuestPhone": "Téléphone du voyageur principal",
          "booking.dateOfBirth": "Date de naissance",
          "booking.paymentMethod": "Méthode de paiement",
          "booking.paymentMethod.card": "Carte",
          "booking.paymentMethod.bank": "Virement bancaire",
          "booking.notes": "Notes (optionnel)",
          "booking.idDocumentLabel":
            "Document d'identité / Passeport (obligatoire)",
          "booking.idDocumentHelp": "Max 10 Mo. Formats PDF ou image acceptés.",
          "booking.cancel": "Annuler",
          "booking.submit": "Réserver la chambre",
          "booking.submitting": "Réservation en cours...",
          "booking.progressLabel": "Progression du téléchargement",

          // Success / info
          "booking.success": "Réservation créée avec succès.",
          "booking.bookingsEndpointUnavailable":
            "Le point de terminaison des réservations n'est pas disponible sur le serveur. Vous pouvez toujours créer des réservations ; elles apparaîtront ici après création.",

          // Validation / errors
          "booking.error.noRoom": "Nenhum quarto selecionado.",
          "booking.error.noUser":
            "Nenhum utilizador disponível. Por favor inicie sessão.",
          "booking.error.datesRequired":
            "As datas de início e fim são obrigatórias.",
          "booking.error.invalidDate": "Formato de data inválido.",
          "booking.error.endBeforeStart":
            "A data de fim deve ser posterior à data de início.",
          "booking.error.guestsPositive":
            "Os hóspedes devem ser um inteiro positivo.",
          "booking.error.primaryNameRequired":
            "O nome do hóspede principal é obrigatório.",
          "booking.error.dobRequired": "A data de nascimento é obrigatória.",
          "booking.error.invalidDob": "Data de nascimento inválida.",
          "booking.error.ageMinimum":
            "O hóspede deve ter pelo menos 18 anos para reservar.",
          "booking.error.idRequired":
            "É obrigatório carregar um documento de identificação / passaporte.",
          "booking.error.idTooLarge":
            "O ficheiro de identificação é demasiado grande. Máximo 10MB permitido.",
          "booking.error.invalidEmail":
            "O email do hóspede principal é inválido.",
          "booking.error.invalidEmailSecondary":
            "O email do segundo hóspede é inválido.",
          "booking.error.createFailed":
            "Falha ao criar a reserva. Por favor tente novamente.",

          // ------------- Bookings ------------------

          bookings: {
            title: "Mes Réservations",
            empty: "Aucune réservation pour le moment.",
            confirmCancel: "Annuler cette réservation ?",
            error: {
              load: "Échec du chargement des réservations",
              cancel: "Échec de l'annulation",
              details: "Échec du chargement des détails de la réservation",
            },
          },

          // ------------ BookingFormWithModal -------------------
          bookingModal: {
            payTitle: "Payer : {{roomName}}",
            paymentInstructions: "Instructions de paiement",
            bankTransferTitle: "Instructions pour virement bancaire",
            bank: "Banque",
            accountName: "Nom du compte",
            accountNumber: "Numéro de compte",
            routing: "Code de routage / Sort code",
            iban: "IBAN",
            reference: "Référence",
            amount: "Montant",
            copy: "Copier",
            copied: "{{field}} copié",
            copyHint:
              "Utilisez les boutons Copier pour copier les informations.",
            close: "Fermer",
            room: "chambre",
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
          // "dashboard.sendProof": "Envoyer la Preuve de Paiement",
          "dashboard.status": "État",
          "status.paid_full": "Payé",
          "status.paid_half": "Payé partiellement",
          "status.unpaid": "Non payé",
          "dashboard.payService": "Paiement",
          "dashboard.sendProof": "Envoyer à prix réduit",

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

          "payment.instructionsTitle": "Instructions pour le virement bancaire",
          "payment.reference": "Référence",
          "payment.bankName": "Banque",
          "payment.accountName": "Nom du compte",
          "payment.accountNumber": "Numéro de compte",
          "payment.routingNumber": "Code banque/IBAN",
          "payment.amount": "Montant",
          "payment.close": "Fermer",
          "payment.instructionsNote":
            "Après avoir effectué le virement ou le dépôt, veuillez télécharger la preuve de paiement en utilisant le bouton TÉLÉCHARGER LA PREUVE. Si vous avez besoin d'aide, veuillez contacter l'équipe d'assistance.",
          "payment.paymentError": "Échec du paiement",
          "payment.title": "Payer le service",
          "payment.method.card": "Carte bancaire",
          "payment.method.bank": "Virement bancaire",
          "payment.cancel": "Annuler",
          "payment.pay": "Détails du paiement",

          // ---------- UserOnlyDashboard -----------
          "dashboard.title": "Tableau de Bord Utilisateur",
          "dashboard.welcome": "Bienvenue, {{name}}",
          "dashboard.email": "Email",
          "dashboard.role": "Rôle",
          "dashboard.overview": "Aperçu de Vos Services",
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
            noImage: "Aucune image disponible",
            sendProof: "Envoyer justificatif",
            scheduleService: "Planifier le service",
            requestService: "Demander le service",
            failedRequested: "Échec du chargement des services demandés.",
            failedScheduled: "Échec du chargement des services planifiés.",
            failedShared: "Échec du chargement des services partagés.",
          },
          schedule: {
            title: "Planifier le service",
            fullName: "Nom complet",
            email: "Email",
            date: "Date",
            time: "Heure",
            optionalTime: "Optionnel — choisissez une heure si vous préférez",
            cancel: "Annuler",
            confirm: "Confirmer",
            saving: "Enregistrement...",
            errors: {
              dateRequired: "Veuillez sélectionner une date.",
              submitFailed: "Échec de la planification du service. Réessayez.",
            },
          },
          request: {
            title: "Demander un service",
            fullName: "Nom complet",
            email: "Email",
            details: "Détails",
            detailsPlaceholder: "Décrivez ce dont vous avez besoin",
            cancel: "Annuler",
            confirm: "Soumettre la demande",
            saving: "Envoi...",
            errors: {
              detailsRequired:
                "Veuillez fournir des détails pour votre demande.",
              submitFailed: "Échec de l'envoi de la demande. Réessayez.",
            },
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
          // Email: "E-mail",
          // Phone: "Téléphone",
          "Save Changes": "Enregistrer",
          // Close: "Fermer",
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

        //---------------------------------------------
        //  RequestServiceModal
        //---------------------------------------------
        request: {
          title: "Demander un service",
          unknownService: "Service",
          fullName: "Nom complet",
          email: "Email",
          details: "Détails",
          detailsPlaceholder: "Décrivez ce dont vous avez besoin...",
          sharedEmailPlaceholder: "Aucun email partagé fourni",
          sharedEmailMissing: "Aucun email partagé n'est associé à ce service.",
          cancel: "Annuler",
          saving: "Enregistrement...",
          confirm: "Confirmer",
          errors: {
            detailsRequired: "Veuillez fournir des détails pour votre demande.",
            submitFailed: "Échec de l'envoi de la demande. Veuillez réessayer.",
          },
          requestedAt: "Date demandée",
        },
      },
    },
  });

export default i18n;
