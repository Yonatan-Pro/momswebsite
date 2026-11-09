// --- LIVE FORMSPREE ENDPOINTS ---
const ORDER_WEBHOOK_URL_IL = "https://formspree.io/f/xbgrwoay";
const ORDER_WEBHOOK_URL_US = "https://formspree.io/f/xkjwkvly";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyB4KgMmVovCiBAIE2PQ7xuGX1DjGjoEH6g",
    authDomain: "double-redemption.firebaseapp.com",
    projectId: "double-redemption",
    storageBucket: "double-redemption.firebasestorage.app",
    messagingSenderId: "664820211845",
    appId: "1:664820211845:web:8e0a511f3e648d547549ec",
    measurementId: "G-3XTBZTJ364"
};

// Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// State Variables 
let currentStep = 'lang'; // 'lang', 'loc', or 'store'
let userRegion = 'Israel';
let userLanguage = 'he';
let selectedEdition = 'he'; 
let selectedPayment = 'Cash';
let selectedFulfillment = 'Delivery'; // 'Delivery' or 'Pickup'
let orderQuantity = 1;
let liveReviews = [];
let reviewsListenerInitialized = false;
let stepTransitionTimeout = null;

// Pricing Constants
const PRICE_IL = 80;
const SHIPPING_IL = 35;
const PRICE_US = 40;

const translations = {
    en: {
        badge: "TRUE STORY & MEMOIR",
        title: "Double Redemption",
        description: `<p>The sisters’ boundless love and devotion to one another and to their mother, as well as their profound faith in the Almighty, which gave them strength and support in a new and unfamiliar land, resonate deeply in the heart of everyone who opens this book. The heroines’ lives were far from easy, yet their story is told so compellingly that the book is impossible to put down, from the very first page to the last. The lives and destinies of those closest to them have a profound impact on Hana and Hagit, and we can almost physically feel an inner strength, a Jewish sense of identity, and a clear understanding of their purpose in this world being forged within these fragile young women, who will later become mature women and mothers. Passing through external changes and profound inner transformations, they face life’s trials with dignity and courage.</p>
        <p>The culmination of this story is the extraordinary account of transferring their mother’s remains from Belarus for reburial in the Land of Israel. It takes the sisters years to complete this immensely difficult mission, yet they never give up or lose heart. Remarkably, the reader does not experience this event as tragic at all; on the contrary, it becomes a source of genuine inspiration and fills one with a powerful, life-affirming energy.</p>
        <p>In the book Double Geula (the word geula has deliberately been left untranslated by the publishers, since no single Russian word can fully convey the depth of the concept of “redemption”), the twin sisters sincerely and movingly share their understanding of how the Creator guides their destiny and the lives of those around them. This honest and touching story inspires and gives strength to overcome any of life’s hardships. Above all, however, Hana and Hagit speak of the immense value of gratitude to the Creator, blessed be He, and remind us how important it is to appreciate everything that happens in our lives.</p>`,
        locTitle: "Welcome",
        locSub: "Where are you ordering from?",
        btnIl: "🇮🇱 Israel",
        btnUs: "🇺🇸 United States",
        editionLabel: "Select Edition:",
        heEdition: "📖 Hebrew",
        ruEdition: "📖 Russian",
        quantityLabel: "Quantity:",
        priceLabel: "Total Price",
        namePlaceholder: "Full Name",
        phonePlaceholder: "Phone Number",
        addressPlaceholder: "Delivery Address (Street, City, Apartment)",
        pickupPlaceholder: "Self-Pickup (Address not required - Optional notes)",
        paymentLabel: "Payment Method:",
        cash: "Cash",
        cartBtn: "Place Order",
        submittingBtn: "Sending Order...",
        alertError: "Please fill out your name and phone number.",
        alertErrorAddress: "Please enter your delivery address.",
        cashInst: "Pay in cash upon delivery or pickup.",
        fulfillmentLabel: "Delivery Option:",
        btnDelivery: "Delivery (+35 ₪)",
        btnPickup: "Self-Pickup (Free)",
        reviewsBtn: "Reviews", 
        reviewsTitle: "Reviews",
        spSummary: "Reader Reviews",
        spCta: "Click to read or leave a review →",
        zoomHint: "🔍 Click to enlarge",
        addReviewTitle: "Add a Review",
        revName: "Your Name",
        revText: "Write your review here...",
        submitRevBtn: "Submit Review",
        noReviews: "No reviews yet. Be the first to review!",
        revError: "Please fill out your name and a review.",
        revSuccess: "Thank you! Your review is live.",
        loadingReviews: "Translating reviews...",
        copyBtn: "📋 Copy",
        copiedToast: "Copied to clipboard!",
        tyTitle: "Thank You!",
        tyMsg: "Your order has been successfully placed.",
        tyReviewBtn: "★ Leave a Review",
        tyCloseBtn: "Back to Store"
    },
    he: {
        badge: "סיפור אמיתי ומעורר השראה",
        title: "הגאולה הכפולה",
        description: `<p>אהבתן ומסירותן האינסופיות של האחיות זו לזו ולאימן, ואמונתן בבורא עולם שנתנה להן אחיזה בארץ לא מוכרת – כל אלה יוצרות בלב הקוראות הזדהות עם התאומות. חייהן לא היו קלים, אבל סיפורן כתוב בצורה מרתקת כל כך שהספר נקרא בנשימה אחת, מן העמוד הראשון ועד האחרון. גורלם של אנשים שונים הקרובים לחנה ולחגית משפיע עליהן השפעה עמוקה, והקוראות חשות באופן מוחשי ופיזי כיצד מתגבשים בתוך נערות שבריריות – ולאחר מכן נשים בוגרות, אימהות – חוסן פנימי, מודעות עצמית יהודית והבנה של דרכן בעולם הזה. הן עוברות תהפוכות חיצוניות ופנימיות, ובסופו של דבר מצליחות לעמוד בכל הניסיונות בעוז ובנחישות.</p>
        <p>שיאו של מה שקורה לגיבורות הספר אפשר ככל הנראה לראות בסיפור העתקת מקום קבורתה של אימן מבלרוס לישראל. שנים אחדות עוברות עד שהן מצליחות להשלים את המשימה המורכבת הזאת, אבל הן לא מוותרות ולא מתייאשות. באופן מפתיע, אירוע זה אינו נתפס כעצוב בעיני הקוראות; אדרבה, יש בו כדי לעורר השראה ולהטעין את הקוראות באנרגיה חיובית.</p>
        <p>בספר הגאולה הכפולה האחיות התאומות חולקות עם הקוראות את הבנתן של השפעת הבורא על גורלן ועל גורל של אנשים אחרים בסביבתן, ועושות זאת באופן שובה לב. סיפור חייהן, המסופר בכנות ובצורה חיה ומרגשת, מעורר בקוראות השראה, מעצים אותן ומעניק להן כוחות להתמודדות עם אתגרי החיים. וחשוב מכול – חנה וחגית מעלות על נס את ערך ההודיה לקדוש ברוך הוא ואת החשיבות של הכרת הטוב על כל הדברים שקורים בחיינו</p>`,
        locTitle: "ברוכים הבאים",
        locSub: "מאיפה אתם מזמינים?",
        btnIl: "🇮🇱 ישראל",
        btnUs: "🇺🇸 ארצות הברית",
        editionLabel: "בחר מהדורה:",
        heEdition: "📖 עברית",
        ruEdition: "📖 רוסית",
        quantityLabel: "כמות ספרים:",
        priceLabel: "סה״כ לתשלום",
        namePlaceholder: "שם מלא",
        phonePlaceholder: "מספר טלפון",
        addressPlaceholder: "כתובת למשלוח (רחוב, מספר בית, עיר)",
        pickupPlaceholder: "איסוף עצמי (אין צורך בכתובת - ניתן להוסיף הערה)",
        paymentLabel: "אמצעי תשלום:",
        cash: "מזומן",
        cartBtn: "בצע הזמנה",
        submittingBtn: "שולח הזמנה...",
        alertError: "אנא מלא/י שם ומספר טלפון לפני ביצוע ההזמנה.",
        alertErrorAddress: "אנא הזן/הזיני כתובת למשלוח.",
        cashInst: "התשלום במזומן בעת המסירה / האיסוף.",
        fulfillmentLabel: "אפשרות קבלה:",
        btnDelivery: "משלוח (35+ ₪)",
        btnPickup: "איסוף עצמי (חינם)",
        reviewsBtn: "ביקורות", 
        reviewsTitle: "ביקורות",
        spSummary: "ביקורות קוראים",
        spCta: "לחצו לקריאה או להוספת ביקורת ←",
        zoomHint: "🔍 לחצו להגדלה",
        addReviewTitle: "הוסף ביקורת",
        revName: "השם שלך",
        revText: "כתוב את הביקורת שלך כאן...",
        submitRevBtn: "שלח ביקורת",
        noReviews: "אין עדיין ביקורות. היה הראשון לכתוב ביקורת!",
        revError: "אנא מלא/י את שמך ואת הביקורת.",
        revSuccess: "תודה! הביקורת שלך פורסמה.",
        loadingReviews: "מתרגם ביקורות...",
        copyBtn: "📋 העתק",
        copiedToast: "הועתק ללוח!",
        tyTitle: "תודה רבה!",
        tyMsg: "ההזמנה שלך התקבלה בהצלחה.",
        tyReviewBtn: "★ השאר ביקורת",
        tyCloseBtn: "חזרה לחנות"
    },
    ru: {
        badge: "РЕАЛЬНАЯ ИСТОРИЯ И МЕМУАРЫ",
        title: "Двойная геула",
        description: `<p>Бесконечная любовь и преданность сестёр друг другу и своей маме, а также их глубокая вера во Всевышнего, подарившая им опору на новой, незнакомой земле, — всё это находит живой отклик в сердце каждого, открывающего книгу. Жизнь героинь не была простой, но эта история написана настолько захватывающе, что читается на одном дыхании, от первой и до последней страницы. Судьбы близких людей оказывают на Хану и Хагит глубокое влияние, и мы буквально физически ощущаем, как внутри этих хрупких девушек — а в будущем зрелых женщин и матерей — выковываются внутренний стержень, еврейское самосознание и ясное понимание своего предназначения в этом мире. Проходя через внешние перемены и глубокие внутренние трансформации, они с честью и мужеством выдерживают жизненные испытания.</p>
        <p>Кульминацией этой истории становится невероятный сюжет о переносе захоронения их мамы из Беларуси на Землю Израиля. У сестёр уходят годы на то, чтобы завершить эту сложнейшую миссию, но они не сдаются и не опускают руки. Удивительно, но это событие совершенно не воспринимается читателем как трагическое; напротив, оно дарит подлинное вдохновение и заряжает мощной созидательной энергией.</p>
        <p>В книге «Двойная геула» (слово «геула» сознательно оставлено издательством без перевода, так как ни одно русское слово не способно полностью передать всю глубину понятия "избавление") сёстры-близнецы искренне и проникновенно делятся своим осознанием того, как Творец направляет их судьбу и жизни окружающих людей. Эта честная, трогательная история вдохновляет и даёт силы для преодоления любых жизненных невзгод. Но главное — Хана и Хагит говорят о великой ценности благодарности Творцу, Благословен Он, и напоминают о том, как важно уметь ценить всё, что происходит в нашей жизни.</p>`,
        locTitle: "Добро пожаловать",
        locSub: "Откуда вы заказываете?",
        btnIl: "🇮🇱 Израиль",
        btnUs: "🇺🇸 США",
        editionLabel: "Выберите издание:",
        heEdition: "📖 Иврит",
        ruEdition: "📖 Русский",
        quantityLabel: "Количество:",
        priceLabel: "Итого к оплате",
        namePlaceholder: "Полное Имя",
        phonePlaceholder: "Номер телефона",
        addressPlaceholder: "Адрес доставки (Улица, дом, город)",
        pickupPlaceholder: "Самовывоз (адрес не требуется)",
        paymentLabel: "Способ оплаты:",
        cash: "Наличные",
        cartBtn: "Оформить заказ",
        submittingBtn: "Отправка...",
        alertError: "Пожалуйста, введите ваше имя и телефон перед заказом.",
        alertErrorAddress: "Пожалуйста, укажите адрес доставки.",
        cashInst: "Оплата наличными при доставке или самовывозе.",
        fulfillmentLabel: "Способ получения:",
        btnDelivery: "Доставка (+35 ₪)",
        btnPickup: "Самовывоз (Бесплатно)",
        reviewsBtn: "Отзывы", 
        reviewsTitle: "Отзывы",
        spSummary: "Отзывы читателей",
        spCta: "Нажмите, чтобы прочитать или оставить отзыв →",
        zoomHint: "🔍 Нажмите для увеличения",
        addReviewTitle: "Оставить отзыв",
        revName: "Ваше имя",
        revText: "Напишите свой отзыв здесь...",
        submitRevBtn: "Отправить отзыв",
        noReviews: "Отзывов пока нет. Будьте первым!",
        revError: "Пожалуйста, введите ваше имя и отзыв.",
        revSuccess: "Спасибо! Ваш отзыв опубликован.",
        loadingReviews: "Перевод отзывов...",
        copyBtn: "📋 Скопировать",
        copiedToast: "Скопировано!",
        tyTitle: "Спасибо!",
        tyMsg: "Ваш заказ был успешно оформлен.",
        tyReviewBtn: "★ Оставить отзыв",
        tyCloseBtn: "Вернуться в магазин"
    }
};

// --- SESSION & BROWSER HISTORY MANAGEMENT ---
function saveSessionState(step) {
    currentStep = step;
    sessionStorage.setItem('dr_step', step);
    sessionStorage.setItem('dr_lang', userLanguage);
    sessionStorage.setItem('dr_region', userRegion);
}

function showStepUI(step, instant = false) {
    if (stepTransitionTimeout) {
        clearTimeout(stepTransitionTimeout);
        stepTransitionTimeout = null;
    }

    const splashScreen = document.getElementById('splash-screen');
    const stepLang = document.getElementById('step-language');
    const stepLoc = document.getElementById('step-location');
    const mainContent = document.getElementById('main-content');

    if (step === 'lang') {
        mainContent.style.display = 'none';
        splashScreen.style.display = 'flex';
        splashScreen.style.opacity = '1';
        stepLoc.classList.remove('active');
        stepLoc.style.opacity = '0';
        stepLang.classList.add('active');
        stepLang.style.opacity = '1';
    } else if (step === 'loc') {
        mainContent.style.display = 'none';
        splashScreen.style.display = 'flex';
        splashScreen.style.opacity = '1';
        stepLang.classList.remove('active');
        stepLang.style.opacity = '0';
        stepLoc.classList.add('active');
        stepLoc.style.opacity = '1';
    } else if (step === 'store') {
        mainContent.style.display = 'block';
        if (instant) {
            splashScreen.style.opacity = '0';
            splashScreen.style.display = 'none';
        } else {
            splashScreen.style.opacity = '0';
            stepTransitionTimeout = setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 450);
        }
    }
}

function closeAllModalsUI() {
    const revModal = document.getElementById('reviews-modal');
    if (revModal && revModal.style.display !== 'none') {
        revModal.style.opacity = '0';
        setTimeout(() => { revModal.style.display = 'none'; }, 300);
    }

    const lightbox = document.getElementById('lightbox-modal');
    if (lightbox && lightbox.style.display !== 'none') {
        lightbox.style.display = 'none';
    }

    const tyScreen = document.getElementById('thank-you-screen');
    if (tyScreen && tyScreen.style.display !== 'none') {
        tyScreen.style.opacity = '0';
        setTimeout(() => { tyScreen.style.display = 'none'; }, 300);
    }
}

// Listen for Browser Back / Forward buttons
window.addEventListener('popstate', (event) => {
    closeAllModalsUI();

    const targetStep = (event.state && event.state.step) ? event.state.step : 'lang';
    saveSessionState(targetStep);

    if (targetStep === 'loc') {
        applyLanguageUI(userLanguage);
    } else if (targetStep === 'store') {
        applyLanguageUI(userLanguage);
        applyRegionUI(userRegion);
    }

    showStepUI(targetStep, true);
});

// Restore exact step on Page Refresh
window.addEventListener('DOMContentLoaded', () => {
    const savedStep = sessionStorage.getItem('dr_step');
    const savedLang = sessionStorage.getItem('dr_lang');
    const savedRegion = sessionStorage.getItem('dr_region');

    if (savedLang && translations[savedLang]) {
        userLanguage = savedLang;
    }
    if (savedRegion) {
        userRegion = savedRegion;
    }

    if (savedStep === 'store') {
        applyLanguageUI(userLanguage);
        applyRegionUI(userRegion);
        saveSessionState('store');
        // Build back-stack if user opened a fresh tab with saved session
        if (!history.state || !history.state.step) {
            history.replaceState({ step: 'lang' }, '', '#language');
            history.pushState({ step: 'loc' }, '', '#location');
            history.pushState({ step: 'store' }, '', '#store');
        }
        showStepUI('store', true);
    } else if (savedStep === 'loc') {
        applyLanguageUI(userLanguage);
        saveSessionState('loc');
        if (!history.state || !history.state.step) {
            history.replaceState({ step: 'lang' }, '', '#language');
            history.pushState({ step: 'loc' }, '', '#location');
        }
        showStepUI('loc', true);
    } else {
        saveSessionState('lang');
        history.replaceState({ step: 'lang' }, '', '#language');
        showStepUI('lang', true);
    }
});

// --- TOAST NOTIFICATION HELPER ---
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 2800);
}

// --- COPY TO CLIPBOARD HELPER ---
function copyToClipboard(text) {
    const langObj = translations[userLanguage] || translations.he;
    navigator.clipboard.writeText(text).then(() => {
        showToast(langObj.copiedToast);
    });
}

// --- LANGUAGE & REGION LOGIC ---
function applyLanguageUI(language) {
    userLanguage = language;
    const langObj = translations[language];
    
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';

    ['he', 'ru', 'en'].forEach(lang => {
        const btn = document.getElementById('nav-lang-' + lang);
        if (btn) btn.classList.toggle('active', lang === language);
    });

    document.getElementById('splash-loc-title').innerText = langObj.locTitle;
    document.getElementById('splash-loc-sub').innerText = langObj.locSub;
    document.getElementById('splash-btn-il').innerText = langObj.btnIl;
    document.getElementById('splash-btn-us').innerText = langObj.btnUs;
    document.getElementById('splash-reviews-btn').innerText = '★ ' + langObj.reviewsBtn;

    document.getElementById('nav-logo').innerText = langObj.title;
    document.getElementById('header-reviews-label').innerText = langObj.reviewsBtn;
    document.getElementById('sp-summary-text').innerText = langObj.spSummary;
    document.getElementById('sp-cta-text').innerText = langObj.spCta;
    document.getElementById('zoom-hint-text').innerText = langObj.zoomHint;

    document.getElementById('book-badge').innerText = langObj.badge;
    document.getElementById('book-title').innerText = langObj.title;
    document.getElementById('desc-placeholder').innerHTML = langObj.description;
    document.getElementById('edition-label').innerText = langObj.editionLabel;
    document.getElementById('btn-he').innerText = langObj.heEdition;
    document.getElementById('btn-ru').innerText = langObj.ruEdition;
    document.getElementById('quantity-label').innerText = langObj.quantityLabel;
    document.getElementById('price-label').innerText = langObj.priceLabel;
    document.getElementById('fulfillment-label').innerText = langObj.fulfillmentLabel;
    document.getElementById('btn-delivery').innerText = langObj.btnDelivery;
    document.getElementById('btn-pickup').innerText = langObj.btnPickup;
    
    document.getElementById('buyer-name').placeholder = langObj.namePlaceholder;
    document.getElementById('buyer-phone').placeholder = langObj.phonePlaceholder;
    
    document.getElementById('payment-label').innerText = langObj.paymentLabel;
    document.getElementById('pay-cash').innerText = langObj.cash;
    document.getElementById('add-cart-btn-text').innerText = langObj.cartBtn;

    document.getElementById('reviews-title-text').innerText = langObj.reviewsTitle;
    document.getElementById('add-review-title').innerText = langObj.addReviewTitle;
    document.getElementById('review-name').placeholder = langObj.revName;
    document.getElementById('review-text').placeholder = langObj.revText;
    document.getElementById('submit-review-btn').innerText = langObj.submitRevBtn;

    document.getElementById('ty-title-text').innerText = langObj.tyTitle;
    document.getElementById('ty-msg-text').innerText = langObj.tyMsg;
    document.getElementById('ty-review-btn').innerText = langObj.tyReviewBtn;
    document.getElementById('ty-close-btn').innerText = langObj.tyCloseBtn;

    if (!reviewsListenerInitialized) {
        initLiveReviewsListener();
        reviewsListenerInitialized = true;
    } else {
        renderReviews();
    }
}

function setLanguage(language) {
    applyLanguageUI(language);
    saveSessionState('loc');
    history.pushState({ step: 'loc' }, '', '#location');

    const stepLang = document.getElementById('step-language');
    const stepLoc = document.getElementById('step-location');
    
    stepLang.style.opacity = '0';
    stepTransitionTimeout = setTimeout(() => {
        stepLang.classList.remove('active');
        stepLoc.classList.add('active');
        setTimeout(() => { stepLoc.style.opacity = '1'; }, 50);
    }, 350); 
}

function switchLanguageLive(language) {
    applyLanguageUI(language);
    saveSessionState(currentStep);
    recalculateTotals();
}

function applyRegionUI(region) {
    userRegion = region;
    const langObj = translations[userLanguage];
    
    document.getElementById('nav-reg-il').classList.toggle('active', region === 'Israel');
    document.getElementById('nav-reg-us').classList.toggle('active', region === 'USA');

    const fulfillmentBox = document.getElementById('fulfillment-container');
    const paypalBtn = document.getElementById('pay-paypal');

    if (region === 'Israel') {
        fulfillmentBox.style.display = 'block';
        paypalBtn.style.display = 'none';
        document.getElementById('pay-digital').innerText = 'Bit';
        if (selectedPayment === 'PayPal') selectedPayment = 'Cash';
        selectFulfillment(selectedFulfillment || 'Delivery');
    } else if (region === 'USA') {
        fulfillmentBox.style.display = 'none';
        paypalBtn.style.display = 'inline-block';
        document.getElementById('pay-digital').innerText = 'Zelle';
        document.getElementById('buyer-address').placeholder = langObj.addressPlaceholder;
    }

    selectPayment(selectedPayment || 'Cash');
    recalculateTotals();
}

function setRegion(region) {
    applyRegionUI(region);
    saveSessionState('store');
    history.pushState({ step: 'store' }, '', '#store');
    showStepUI('store', false);
}

function switchRegionLive(region) {
    applyRegionUI(region);
    saveSessionState(currentStep);
}

// --- QUANTITY, FULFILLMENT & DYNAMIC PRICING ---
function changeQuantity(delta) {
    orderQuantity = Math.max(1, Math.min(20, orderQuantity + delta));
    document.getElementById('qty-display').innerText = orderQuantity;
    recalculateTotals();
}

function selectFulfillment(option) {
    selectedFulfillment = option;
    const langObj = translations[userLanguage];

    const delBtn = document.getElementById('btn-delivery');
    const pickBtn = document.getElementById('btn-pickup');
    const addressInput = document.getElementById('buyer-address');

    if (option === 'Delivery') {
        delBtn.classList.add('active');
        pickBtn.classList.remove('active');
        addressInput.placeholder = langObj.addressPlaceholder;
    } else {
        pickBtn.classList.add('active');
        delBtn.classList.remove('active');
        addressInput.placeholder = langObj.pickupPlaceholder;
    }

    recalculateTotals();
}

function getCalculatedTotal() {
    if (userRegion === 'Israel') {
        const booksTotal = PRICE_IL * orderQuantity;
        const shipping = selectedFulfillment === 'Delivery' ? SHIPPING_IL : 0;
        return { total: booksTotal + shipping, booksTotal, shipping, currency: '₪', formatted: `${booksTotal + shipping} ₪` };
    } else {
        const booksTotal = PRICE_US * orderQuantity;
        return { total: booksTotal, booksTotal, shipping: 0, currency: '$', formatted: `$${booksTotal}` };
    }
}

function recalculateTotals() {
    const calc = getCalculatedTotal();
    document.getElementById('final-price').innerText = calc.formatted;

    const breakdownEl = document.getElementById('price-breakdown');
    if (userRegion === 'Israel') {
        if (selectedFulfillment === 'Delivery') {
            breakdownEl.innerText = `${orderQuantity} × ${PRICE_IL} ₪ + ${SHIPPING_IL} ₪`;
        } else {
            breakdownEl.innerText = `${orderQuantity} × ${PRICE_IL} ₪`;
        }
    } else {
        breakdownEl.innerText = orderQuantity > 1 ? `${orderQuantity} × $${PRICE_US}` : '';
    }

    updatePaymentInstructions();
}

function updatePaymentInstructions() {
    const langObj = translations[userLanguage];
    const box = document.getElementById('payment-instructions');
    const calc = getCalculatedTotal();
    
    if (selectedPayment === 'Cash') {
        box.innerHTML = langObj.cashInst;
    } else if (selectedPayment === 'Digital' && userRegion === 'Israel') {
        const phone = '+972 54-538-4137';
        let text = '';
        if (userLanguage === 'he') {
            text = `העבר <strong>${calc.formatted}</strong> בביט למספר:<br><strong style="font-size:1.2em;"><span dir="ltr">${phone}</span></strong>`;
        } else if (userLanguage === 'ru') {
            text = `Отправьте <strong>${calc.formatted}</strong> через Bit на номер:<br><strong style="font-size:1.2em;">${phone}</strong>`;
        } else {
            text = `Send <strong>${calc.formatted}</strong> via Bit to:<br><strong style="font-size:1.2em;">${phone}</strong>`;
        }
        box.innerHTML = `${text}<br><button type="button" class="copy-chip-btn" onclick="copyToClipboard('0545384137')">${langObj.copyBtn}</button>`;
    } else if (selectedPayment === 'Digital' && userRegion === 'USA') {
        const zellePhone = '+1 518 466 8854';
        let text = '';
        if (userLanguage === 'he') {
            text = `העבר <strong>${calc.formatted}</strong> ב-Zelle למספר:<br><strong style="font-size:1.2em;"><span dir="ltr">${zellePhone}</span></strong><br>(Lika Yakovis)`;
        } else if (userLanguage === 'ru') {
            text = `Отправьте <strong>${calc.formatted}</strong> через Zelle на номер:<br><strong style="font-size:1.2em;">${zellePhone}</strong><br>(Lika Yakovis)`;
        } else {
            text = `Send <strong>${calc.formatted}</strong> via Zelle to:<br><strong style="font-size:1.2em;">${zellePhone}</strong><br>(Lika Yakovis)`;
        }
        box.innerHTML = `${text}<br><button type="button" class="copy-chip-btn" onclick="copyToClipboard('+15184668854')">${langObj.copyBtn}</button>`;
    } else if (selectedPayment === 'PayPal' && userRegion === 'USA') {
        const email = 'IamWebDev@gmail.com';
        let text = '';
        if (userLanguage === 'he') {
            text = `העבר <strong>${calc.formatted}</strong> ב-PayPal לאימייל:<br><strong style="font-size:1.2em;"><span dir="ltr">${email}</span></strong><br>(Alexandr Yakovis)`;
        } else if (userLanguage === 'ru') {
            text = `Отправьте <strong>${calc.formatted}</strong> через PayPal на почту:<br><strong style="font-size:1.2em;">${email}</strong><br>(Alexandr Yakovis)`;
        } else {
            text = `Send <strong>${calc.formatted}</strong> via PayPal to:<br><strong style="font-size:1.2em;">${email}</strong><br>(Alexandr Yakovis)`;
        }
        box.innerHTML = `${text}<br><button type="button" class="copy-chip-btn" onclick="copyToClipboard('${email}')">${langObj.copyBtn}</button>`;
    }
}

// --- GALLERY & LIGHTBOX ---
function changeImage(thumbElement) {
    const heroImg = document.getElementById('hero-img');
    heroImg.style.opacity = '0.3';
    setTimeout(() => {
        heroImg.src = thumbElement.src;
        document.getElementById('lightbox-img').src = thumbElement.src;
        heroImg.style.opacity = '1';
    }, 150);

    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
}

function openLightbox() {
    const modal = document.getElementById('lightbox-modal');
    document.getElementById('lightbox-img').src = document.getElementById('hero-img').src;
    modal.style.display = 'flex';
    history.pushState({ step: currentStep, modal: 'lightbox' }, '', '#zoom');
}

function closeLightbox() {
    document.getElementById('lightbox-modal').style.display = 'none';
    if (history.state && history.state.modal === 'lightbox') {
        history.back();
    }
}

// --- STORE OPTIONS ---
function selectEdition(edition) {
    selectedEdition = edition;
    document.getElementById('btn-he').classList.toggle('active', edition === 'he');
    document.getElementById('btn-ru').classList.toggle('active', edition === 'ru');
}

function selectPayment(method) {
    selectedPayment = method;
    document.getElementById('pay-cash').classList.toggle('active', method === 'Cash');
    document.getElementById('pay-digital').classList.toggle('active', method === 'Digital');
    const paypalBtn = document.getElementById('pay-paypal');
    if (paypalBtn) paypalBtn.classList.toggle('active', method === 'PayPal');
    
    updatePaymentInstructions();
}

// --- THANK YOU SCREEN & REVIEW ROUTING ---
function closeThankYouScreen() {
    const tyScreen = document.getElementById('thank-you-screen');
    tyScreen.style.opacity = '0';
    setTimeout(() => { tyScreen.style.display = 'none'; }, 450);
    if (history.state && history.state.modal === 'thankyou') {
        history.back();
    }
}

function openReviewFromThankYou() {
    const tyScreen = document.getElementById('thank-you-screen');
    tyScreen.style.opacity = '0';
    setTimeout(() => { tyScreen.style.display = 'none'; }, 450);

    const modal = document.getElementById('reviews-modal');
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 50);
    history.replaceState({ step: currentStep, modal: 'reviews' }, '', '#reviews');

    setTimeout(() => {
        const addReviewSection = document.getElementById('add-review-title');
        if (addReviewSection) {
            addReviewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 500);
}

// --- AUTO-TRANSLATION FUNCTION ---
async function translateText(text, targetLang) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (error) {
        console.error("Translation error:", error);
        return text; 
    }
}

// --- FIRESTORE REAL-TIME REVIEWS LOGIC ---
function setReviewStars(count) {
    document.getElementById('review-stars').value = count;
    const buttons = document.querySelectorAll('#star-picker .star-pick-btn');
    buttons.forEach((btn, idx) => {
        btn.classList.toggle('active', idx < count);
    });
}

function updateRatingBadges() {
    const count = liveReviews.length;
    let avg = 5.0;
    if (count > 0) {
        const sum = liveReviews.reduce((acc, r) => acc + (parseInt(r.stars) || 5), 0);
        avg = (sum / count).toFixed(1);
    }

    document.getElementById('header-rating-avg').innerText = avg;
    document.getElementById('header-review-count').innerText = count;
    document.getElementById('modal-rating-avg').innerText = avg;
    document.getElementById('modal-review-count').innerText = count;
}

function initLiveReviewsListener() {
    db.collection("reviews")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
          liveReviews = [];
          snapshot.forEach((doc) => {
              liveReviews.push({ id: doc.id, ...doc.data() });
          });
          updateRatingBadges();
          renderReviews();
      }, (error) => {
          console.error("Error fetching live reviews:", error);
      });
}

function openReviewsModal() {
    const modal = document.getElementById('reviews-modal');
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 50);
    history.pushState({ step: currentStep, modal: 'reviews' }, '', '#reviews');
}

function closeReviewsModal() {
    const modal = document.getElementById('reviews-modal');
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 450);
    if (history.state && history.state.modal === 'reviews') {
        history.back();
    }
}

async function renderReviews() {
    const list = document.getElementById('reviews-list');
    const langObj = translations[userLanguage] || translations['he'];

    if (!list) return;

    if (liveReviews.length === 0) {
        list.innerHTML = `<p style="font-size: 1.05em; color: #6e5f53; text-align: center; padding: 20px;">${langObj.noReviews}</p>`;
        return;
    }

    list.innerHTML = `<p style="text-align:center; font-style:italic; color: #8b7355; padding: 20px;">${langObj.loadingReviews}</p>`;

    try {
        const translatedHtmlPromises = liveReviews.map(async (review) => {
            const starCount = review.stars || 5;
            const starText = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
            const initial = (review.name || '?').trim().charAt(0).toUpperCase();
            
            const translatedText = await translateText(review.text, userLanguage);

            return `
                <div class="review-box">
                    <div class="review-header">
                        <div class="review-avatar">${escapeHtml(initial)}</div>
                        <div class="review-meta">
                            <span class="review-author">${escapeHtml(review.name)}</span>
                            <span class="review-stars">${starText}</span>
                        </div>
                    </div>
                    <p>${escapeHtml(translatedText)}</p>
                </div>
            `;
        });

        const htmlArray = await Promise.all(translatedHtmlPromises);
        list.innerHTML = htmlArray.join('');
        
    } catch (error) {
        console.error("Error rendering reviews:", error);
        list.innerHTML = `<p>Error loading reviews.</p>`;
    }
}

function submitReview() {
    const langObj = translations[userLanguage] || translations.he;
    const nameInput = document.getElementById('review-name').value.trim();
    const starsInput = parseInt(document.getElementById('review-stars').value) || 5;
    const textInput = document.getElementById('review-text').value.trim();

    if (!nameInput || !textInput) {
        showToast(langObj.revError);
        return;
    }

    const submitBtn = document.getElementById('submit-review-btn');
    submitBtn.disabled = true;

    db.collection("reviews").add({
        name: nameInput,
        stars: starsInput,
        text: textInput,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        document.getElementById('review-name').value = '';
        document.getElementById('review-text').value = '';
        setReviewStars(5);
        submitBtn.disabled = false;
        showToast(langObj.revSuccess);
    })
    .catch((error) => {
        console.error("Error saving review:", error);
        showToast("Failed to submit review. Please try again.");
        submitBtn.disabled = false;
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

// --- FORM SUBMISSION VIA FORMSPREE ---
function submitOrder() {
    const buyerName = document.getElementById('buyer-name').value.trim();
    const buyerPhone = document.getElementById('buyer-phone').value.trim();
    const buyerAddress = document.getElementById('buyer-address').value.trim();
    const langObj = translations[userLanguage] || translations.he;

    if (!buyerName || !buyerPhone) {
        showToast(langObj.alertError);
        return;
    }

    if ((userRegion === 'USA' || selectedFulfillment === 'Delivery') && !buyerAddress) {
        showToast(langObj.alertErrorAddress);
        return;
    }

    const orderBtn = document.getElementById('add-cart-btn');
    const orderBtnText = document.getElementById('add-cart-btn-text');
    orderBtn.disabled = true;
    orderBtnText.innerText = langObj.submittingBtn;

    let actualPaymentMethod;
    if (selectedPayment === 'Cash') {
        actualPaymentMethod = 'מזומן';
    } else if (selectedPayment === 'PayPal') {
        actualPaymentMethod = 'PayPal';
    } else {
        actualPaymentMethod = userRegion === 'Israel' ? 'ביט' : 'Zelle';
    }

    const actualEdition = selectedEdition === 'he' ? 'עברית' : 'רוסית';
    
    let actualFulfillment;
    if (userRegion === 'Israel') {
        actualFulfillment = selectedFulfillment === 'Delivery' ? 'משלוח' : 'איסוף עצמי';
    } else {
        actualFulfillment = 'משלוח רגיל';
    }

    const actualRegion = userRegion === 'Israel' ? 'ישראל' : 'ארצות הברית';
    const actualAddress = buyerAddress || 'איסוף עצמי (ללא כתובת משלוח)';
    const calc = getCalculatedTotal();

    const targetUrl = userRegion === 'Israel' ? ORDER_WEBHOOK_URL_IL : ORDER_WEBHOOK_URL_US;

    const payload = {
        "שם לקוח": buyerName,
        "מספר טלפון": buyerPhone,
        "כמות ספרים": orderQuantity,
        "סה״כ לתשלום": calc.formatted,
        "אפשרות קבלה": actualFulfillment,
        "כתובת למשלוח": actualAddress,
        "אזור משלוח": actualRegion,
        "מהדורת ספר": actualEdition,
        "אמצעי תשלום": actualPaymentMethod
    };

    fetch(targetUrl, {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        orderBtn.disabled = false;
        orderBtnText.innerText = langObj.cartBtn;

        if (response.ok) {
            document.getElementById('buyer-name').value = '';
            document.getElementById('buyer-phone').value = '';
            document.getElementById('buyer-address').value = '';
            orderQuantity = 1;
            document.getElementById('qty-display').innerText = '1';
            recalculateTotals();
            
            const tyScreen = document.getElementById('thank-you-screen');
            tyScreen.style.display = 'flex';
            setTimeout(() => { tyScreen.style.opacity = '1'; }, 50);
            history.pushState({ step: currentStep, modal: 'thankyou' }, '', '#thank-you');
        } else {
            showToast("There was an error sending the order. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error sending order:', error);
        orderBtn.disabled = false;
        orderBtnText.innerText = langObj.cartBtn;
        showToast("Network error. Please check your connection.");
    });
}