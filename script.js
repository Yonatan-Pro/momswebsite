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
let userRegion = '';
let userLanguage = '';
let selectedEdition = 'he'; 
let selectedPayment = 'Cash';
let selectedFulfillment = 'Delivery'; // 'Delivery' or 'Pickup'
let liveReviews = [];

const translations = {
    en: {
        title: "Double Redemption",
        description: `<p>The sisters’ boundless love and devotion to one another and to their mother, as well as their profound faith in the Almighty, which gave them strength and support in a new and unfamiliar land, resonate deeply in the heart of everyone who opens this book. The heroines’ lives were far from easy, yet their story is told so compellingly that the book is impossible to put down, from the very first page to the last. The lives and destinies of those closest to them have a profound impact on Hana and Hagit, and we can almost physically feel an inner strength, a Jewish sense of identity, and a clear understanding of their purpose in this world being forged within these fragile young women, who will later become mature women and mothers. Passing through external changes and profound inner transformations, they face life’s trials with dignity and courage.</p>
        <p>The culmination of this story is the extraordinary account of transferring their mother’s remains from Belarus for reburial in the Land of Israel. It takes the sisters years to complete this immensely difficult mission, yet they never give up or lose heart. Remarkably, the reader does not experience this event as tragic at all; on the contrary, it becomes a source of genuine inspiration and fills one with a powerful, life-affirming energy.</p>
        <p>In the book Double Geula (the word geula has deliberately been left untranslated by the publishers, since no single Russian word can fully convey the depth of the concept of “redemption”), the twin sisters sincerely and movingly share their understanding of how the Creator guides their destiny and the lives of those around them. This honest and touching story inspires and gives strength to overcome any of life’s hardships. Above all, however, Hana and Hagit speak of the immense value of gratitude to the Creator, blessed be He, and remind us how important it is to appreciate everything that happens in our lives.</p>`,
        locTitle: "Welcome",
        locSub: "Where are you ordering from?",
        btnIl: "Israel",
        btnUs: "United States",
        editionLabel: "Select Edition:",
        heEdition: "Hebrew",
        ruEdition: "Russian",
        priceLabel: "Price",
        namePlaceholder: "Full Name",
        phonePlaceholder: "Phone Number",
        addressPlaceholder: "Delivery Address",
        pickupPlaceholder: "Pickup (Address not required)",
        paymentLabel: "Payment Method:",
        cash: "Cash",
        cartBtn: "Place Order",
        alertError: "Please fill out your name and phone number before ordering.",
        alertErrorAddress: "Please enter your delivery address.",
        cashInst: "Pay in cash upon delivery/pickup.",
        bitInstDelivery: "Send <strong>102 ₪</strong> (80 ₪ + 22 ₪ delivery) via Bit to: <br><strong style='font-size:1.2em;'>+972 54-538-4137</strong>",
        bitInstPickup: "Send <strong>80 ₪</strong> via Bit to: <br><strong style='font-size:1.2em;'>+972 54-538-4137</strong>",
        zelleInst: "Send <strong>$40</strong> via Zelle to: <br><strong style='font-size:1.2em;'>+1 518 466 8854</strong><br>(Lika Yakovis)",
        paypalInst: "Send <strong>$40</strong> via PayPal to: <br><strong style='font-size:1.2em;'>IamWebDev@gmail.com</strong><br>(Alexandr Yakovis)",
        fulfillmentLabel: "Delivery Option:",
        btnDelivery: "Delivery (+22 ₪)",
        btnPickup: "Self-Pickup (Free)",
        reviewsBtn: "Reviews", 
        reviewsTitle: "Reviews",
        addReviewTitle: "Add a Review",
        revName: "Your Name",
        revText: "Write your review here...",
        submitRevBtn: "Submit Review",
        noReviews: "No reviews yet. Be the first to review!",
        revError: "Please fill out your name and a review.",
        loadingReviews: "Translating reviews...",
        tyTitle: "Thank You!",
        tyMsg: "Your order has been successfully placed.",
        tyReviewBtn: "Leave a Review",
        tyCloseBtn: "Back to Store"
    },
    he: {
        title: "הגאולה הכפולה",
        description: `<p>אהבתן ומסירותן האינסופיות של האחיות זו לזו ולאימן, ואמונתן בבורא עולם שנתנה להן אחיזה בארץ לא מוכרת – כל אלה יוצרות בלב הקוראות הזדהות עם התאומות. חייהן לא היו קלים, אבל סיפורן כתוב בצורה מרתקת כל כך שהספר נקרא בנשימה אחת, מן העמוד הראשון ועד האחרון. גורלם של אנשים שונים הקרובים לחנה ולחגית משפיע עליהן השפעה עמוקה, והקוראות חשות באופן מוחשי ופיזי כיצד מתגבשים בתוך נערות שבריריות – ולאחר מכן נשים בוגרות, אימהות – חוסן פנימי, מודעות עצמית יהודית והבנה של דרכן בעולם הזה. הן עוברות תהפוכות חיצוניות ופנימיות, ובסופו של דבר מצליחות לעמוד בכל הניסיונות בעוז ובנחישות.</p>
        <p>שיאו של מה שקורה לגיבורות הספר אפשר ככל הנראה לראות בסיפור העתקת מקום קבורתה של אימן מבלרוס לישראל. שנים אחדות עוברות עד שהן מצליחות להשלים את המשימה המורכבת הזאת, אבל הן לא מוותרות ולא מתייאשות. באופן מפתיע, אירוע זה אינו נתפס כעצוב בעיני הקוראות; אדרבה, יש בו כדי לעורר השראה ולהטעין את הקוראות באנרגיה חיובית.</p>
        <p>בספר הגאולה הכפולה האחיות התאומות חולקות עם הקוראות את הבנתן של השפעת הבורא על גורלן ועל גורל של אנשים אחרים בסביבתן, ועושות זאת באופן שובה לב. סיפור חייהן, המסופר בכנות ובצורה חיה ומרגשת, מעורר בקוראות השראה, מעצים אותן ומעניק להן כוחות להתמודדות עם אתגרי החיים. וחשוב מכול – חנה וחגית מעלות על נס את ערך ההודיה לקדוש ברוך הוא ואת החשיבות של הכרת הטוב על כל הדברים שקורים בחיינו</p>`,
        locTitle: "ברוכים הבאים",
        locSub: "מאיפה אתם מזמינים?",
        btnIl: "ישראל",
        btnUs: "ארצות הברית",
        editionLabel: "בחר מהדורה:",
        heEdition: "עברית",
        ruEdition: "רוסית",
        priceLabel: "מחיר",
        namePlaceholder: "שם מלא",
        phonePlaceholder: "מספר טלפון",
        addressPlaceholder: "כתובת למשלוח",
        pickupPlaceholder: "איסוף עצמי (אין צורך בכתובת)",
        paymentLabel: "אמצעי תשלום:",
        cash: "מזומן",
        cartBtn: "בצע הזמנה",
        alertError: "אנא מלא/י שם ומספר טלפון לפני ביצוע ההזמנה.",
        alertErrorAddress: "אנא הזן/הזיני כתובת למשלוח.",
        cashInst: "התשלום במזומן בעת המסירה/האיסוף.",
        bitInstDelivery: "העבר <strong>102 ₪</strong> (80 ₪ + 22 ₪ משלוח) בביט למספר: <br><strong style='font-size:1.2em;'><span dir='ltr'>+972 54-538-4137</span></strong>",
        bitInstPickup: "העבר <strong>80 ₪</strong> בביט למספר: <br><strong style='font-size:1.2em;'><span dir='ltr'>+972 54-538-4137</span></strong>",
        zelleInst: "העבר <strong>$40</strong> ב-Zelle למספר: <br><strong style='font-size:1.2em;'><span dir='ltr'>+1 518 466 8854</span></strong><br>(Lika Yakovis)",
        paypalInst: "העבר <strong>$40</strong> ב-PayPal לאימייל: <br><strong style='font-size:1.2em;'><span dir='ltr'>IamWebDev@gmail.com</span></strong><br>(Alexandr Yakovis)",
        fulfillmentLabel: "אפשרות קבלה:",
        btnDelivery: "משלוח (22+ ₪)",
        btnPickup: "איסוף עצמי (חינם)",
        reviewsBtn: "ביקורות", 
        reviewsTitle: "ביקורות",
        addReviewTitle: "הוסף ביקורת",
        revName: "השם שלך",
        revText: "כתוב את הביקורת שלך כאן...",
        submitRevBtn: "שלח ביקורת",
        noReviews: "אין עדיין ביקורות. היה הראשון לכתוב ביקורת!",
        revError: "אנא מלא/י את שמך ואת הביקורת.",
        loadingReviews: "מתרגם ביקורות...",
        tyTitle: "תודה רבה!",
        tyMsg: "ההזמנה שלך התקבלה בהצלחה.",
        tyReviewBtn: "השאר ביקורת",
        tyCloseBtn: "חזרה לחנות"
    },
    ru: {
        title: "Двойная геула",
        description: `<p>Бесконечная любовь и преданность сестёр друг другу и своей маме, а также их глубокая вера во Всевышнего, подарившая им опору на новой, незнакомой земле, — всё это находит живой отклик в сердце каждого, открывающего книгу. Жизнь героинь не была простой, но эта история написана настолько захватывающе, что читается на одном дыхании, от первой и до последней страницы. Судьбы близких людей оказывают на Хану и Хагит глубокое влияние, и мы буквально физически ощущаем, как внутри этих хрупких девушек — а в будущем зрелых женщин и матерей — выковываются внутренний стержень, еврейское самосознание и ясное понимание своего предназначения в этом мире. Проходя через внешние перемены и глубокие внутренние трансформации, они с честью и мужеством выдерживают жизненные испытания.</p>
        <p>Кульминацией этой истории становится невероятный сюжет о переносе захоронения их мамы из Беларуси на Землю Израиля. У сестёр уходят годы на то, чтобы завершить эту сложнейшую миссию, но они не сдаются и не опускают руки. Удивительно, но это событие совершенно не воспринимается читателем как трагическое; напротив, оно дарит подлинное вдохновение и заряжает мощной созидательной энергией.</p>
        <p>В книге «Двойная геула» (слово «геула» сознательно оставлено издательством без перевода, так как ни одно русское слово не способно полностью передать всю глубину понятия "избавление") сёстры-близнецы искренне и проникновенно делятся своим осознанием того, как Творец направляет их судьбу и жизни окружающих людей. Эта честная, трогательная история вдохновляет и даёт силы для преодоления любых жизненных невзгод. Но главное — Хана и Хагит говорят о великой ценности благодарности Творцу, Благословен Он, и напоминают о том, как важно уметь ценить всё, что происходит в нашей жизни.</p>`,
        locTitle: "Добро пожаловать",
        locSub: "Откуда вы заказываете?",
        btnIl: "Израиль",
        btnUs: "США",
        editionLabel: "Выберите издание:",
        heEdition: "Иврит",
        ruEdition: "Русский",
        priceLabel: "Цена",
        namePlaceholder: "Полное Имя",
        phonePlaceholder: "Номер телефона",
        addressPlaceholder: "Адрес доставки",
        pickupPlaceholder: "Самовывоз (адрес не требуется)",
        paymentLabel: "Способ оплаты:",
        cash: "Наличные",
        cartBtn: "Оформить заказ",
        alertError: "Пожалуйста, введите ваше имя и телефон перед заказом.",
        alertErrorAddress: "Пожалуйста, укажите адрес доставки.",
        cashInst: "Оплата наличными при доставке/самовывозе.",
        bitInstDelivery: "Отправьте <strong>102 ₪</strong> (80 ₪ + 22 ₪ доставка) через Bit на номер: <br><strong style='font-size:1.2em;'>+972 54-538-4137</strong>",
        bitInstPickup: "Отправьте <strong>80 ₪</strong> через Bit на номер: <br><strong style='font-size:1.2em;'>+972 54-538-4137</strong>",
        zelleInst: "Отправьте <strong>$40</strong> через Zelle на номер: <br><strong style='font-size:1.2em;'>+1 518 466 8854</strong><br>(Lika Yakovis)",
        paypalInst: "Отправьте <strong>$40</strong> через PayPal на почту: <br><strong style='font-size:1.2em;'>IamWebDev@gmail.com</strong><br>(Alexandr Yakovis)",
        fulfillmentLabel: "Способ получения:",
        btnDelivery: "Доставка (+22 ₪)",
        btnPickup: "Самовывоз (Бесплатно)",
        reviewsBtn: "Отзывы", 
        reviewsTitle: "Отзывы",
        addReviewTitle: "Оставить отзыв",
        revName: "Ваше имя",
        revText: "Напишите свой отзыв здесь...",
        submitRevBtn: "Отправить отзыв",
        noReviews: "Отзывов пока нет. Будьте первым!",
        revError: "Пожалуйста, введите ваше имя и отзыв.",
        loadingReviews: "Перевод отзывов...",
        tyTitle: "Спасибо!",
        tyMsg: "Ваш заказ был успешно оформлен.",
        tyReviewBtn: "Оставить отзыв",
        tyCloseBtn: "Вернуться в магазин"
    }
};

// --- LANGUAGE & REGION LOGIC ---
function setLanguage(language) {
    userLanguage = language;
    const langObj = translations[language];
    
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';

    document.getElementById('splash-loc-title').innerText = langObj.locTitle;
    document.getElementById('splash-loc-sub').innerText = langObj.locSub;
    document.getElementById('splash-btn-il').innerText = langObj.btnIl;
    document.getElementById('splash-btn-us').innerText = langObj.btnUs;
    document.getElementById('splash-reviews-btn').innerText = langObj.reviewsBtn;

    document.getElementById('reviews-title-text').innerText = langObj.reviewsTitle;
    document.getElementById('add-review-title').innerText = langObj.addReviewTitle;
    document.getElementById('review-name').placeholder = langObj.revName;
    document.getElementById('review-text').placeholder = langObj.revText;
    document.getElementById('submit-review-btn').innerText = langObj.submitRevBtn;

    document.getElementById('ty-title-text').innerText = langObj.tyTitle;
    document.getElementById('ty-msg-text').innerText = langObj.tyMsg;
    document.getElementById('ty-review-btn').innerText = langObj.tyReviewBtn;
    document.getElementById('ty-close-btn').innerText = langObj.tyCloseBtn;

    initLiveReviewsListener();

    const stepLang = document.getElementById('step-language');
    const stepLoc = document.getElementById('step-location');
    
    stepLang.style.opacity = '0';
    setTimeout(() => {
        stepLang.classList.remove('active');
        stepLoc.classList.add('active');
        setTimeout(() => { stepLoc.style.opacity = '1'; }, 50);
    }, 400); 
}

function setRegion(region) {
    userRegion = region;
    const langObj = translations[userLanguage];
    
    const fulfillmentBox = document.getElementById('fulfillment-container');
    const paypalBtn = document.getElementById('pay-paypal');

    if (region === 'Israel') {
        fulfillmentBox.style.display = 'block';
        paypalBtn.style.display = 'none';
        selectedFulfillment = 'Delivery';
        document.getElementById('pay-digital').innerText = 'Bit';
        document.getElementById('fulfillment-label').innerText = langObj.fulfillmentLabel;
        document.getElementById('btn-delivery').innerText = langObj.btnDelivery;
        document.getElementById('btn-pickup').innerText = langObj.btnPickup;
        selectFulfillment('Delivery');
    } else if (region === 'USA') {
        fulfillmentBox.style.display = 'none';
        paypalBtn.style.display = 'inline-block';
        document.getElementById('final-price').innerText = '$40';
        document.getElementById('pay-digital').innerText = 'Zelle';
        document.getElementById('buyer-address').placeholder = langObj.addressPlaceholder;
    }

    document.getElementById('book-title').innerText = langObj.title;
    document.getElementById('desc-placeholder').innerHTML = langObj.description;
    document.getElementById('edition-label').innerText = langObj.editionLabel;
    document.getElementById('btn-he').innerText = langObj.heEdition;
    document.getElementById('btn-ru').innerText = langObj.ruEdition;
    document.getElementById('price-label').innerText = langObj.priceLabel;
    
    document.getElementById('buyer-name').placeholder = langObj.namePlaceholder;
    document.getElementById('buyer-phone').placeholder = langObj.phonePlaceholder;
    
    document.getElementById('payment-label').innerText = langObj.paymentLabel;
    document.getElementById('pay-cash').innerText = langObj.cash;
    document.getElementById('add-cart-btn').innerText = langObj.cartBtn;

    selectPayment('Cash');

    const splashScreen = document.getElementById('splash-screen');
    splashScreen.style.opacity = '0';
    setTimeout(() => {
        splashScreen.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 500);
}

// --- FULFILLMENT LOGIC (ISRAEL) ---
function selectFulfillment(option) {
    selectedFulfillment = option;
    const langObj = translations[userLanguage];

    const delBtn = document.getElementById('btn-delivery');
    const pickBtn = document.getElementById('btn-pickup');
    const addressInput = document.getElementById('buyer-address');

    if (option === 'Delivery') {
        delBtn.classList.add('active');
        pickBtn.classList.remove('active');
        document.getElementById('final-price').innerText = '102 ₪';
        addressInput.placeholder = langObj.addressPlaceholder;
        addressInput.disabled = false;
    } else {
        pickBtn.classList.add('active');
        delBtn.classList.remove('active');
        document.getElementById('final-price').innerText = '80 ₪';
        addressInput.placeholder = langObj.pickupPlaceholder;
        addressInput.disabled = false;
    }

    updatePaymentInstructions();
}

// --- THANK YOU SCREEN & REVIEW ROUTING ---
function closeThankYouScreen() {
    const tyScreen = document.getElementById('thank-you-screen');
    tyScreen.style.opacity = '0';
    setTimeout(() => { tyScreen.style.display = 'none'; }, 500);
}

function openReviewFromThankYou() {
    closeThankYouScreen();
    openReviewsModal();
    setTimeout(() => {
        const addReviewSection = document.getElementById('add-review-title');
        if (addReviewSection) {
            addReviewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 550);
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
function initLiveReviewsListener() {
    db.collection("reviews")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
          liveReviews = [];
          snapshot.forEach((doc) => {
              liveReviews.push({ id: doc.id, ...doc.data() });
          });
          renderReviews();
      }, (error) => {
          console.error("Error fetching live reviews:", error);
      });
}

function openReviewsModal() {
    const modal = document.getElementById('reviews-modal');
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 50);
}

function closeReviewsModal() {
    const modal = document.getElementById('reviews-modal');
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

async function renderReviews() {
    const list = document.getElementById('reviews-list');
    const langObj = translations[userLanguage] || translations['he'];

    if (!list) return;

    if (liveReviews.length === 0) {
        list.innerHTML = `<p style="font-size: 1.1em; color: #666;">${langObj.noReviews}</p>`;
        return;
    }

    list.innerHTML = `<p style="text-align:center; font-style:italic; color: #8b7355; padding: 20px;">${langObj.loadingReviews}</p>`;

    try {
        const translatedHtmlPromises = liveReviews.map(async (review) => {
            const starCount = review.stars || 5;
            const starText = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
            
            const translatedText = await translateText(review.text, userLanguage);

            return `
                <div class="review-box">
                    <div class="review-header">
                        <div>
                            <span class="review-author">${escapeHtml(review.name)}</span>
                            <span class="review-stars">${starText}</span>
                        </div>
                    </div>
                    <p style="margin: 5px 0 0; font-size: 1em; line-height: 1.4;">${escapeHtml(translatedText)}</p>
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
    const langObj = translations[userLanguage];
    const nameInput = document.getElementById('review-name').value.trim();
    const starsInput = parseInt(document.getElementById('review-stars').value);
    const textInput = document.getElementById('review-text').value.trim();

    if (!nameInput || !textInput) {
        alert(langObj.revError);
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
        document.getElementById('review-stars').value = '5';
        submitBtn.disabled = false;
    })
    .catch((error) => {
        console.error("Error saving review:", error);
        alert("Failed to submit review. Please try again.");
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

// --- STORE LOGIC ---
function selectEdition(edition) {
    selectedEdition = edition;
    document.getElementById('btn-he').classList.remove('active');
    document.getElementById('btn-ru').classList.remove('active');
    document.getElementById('btn-' + edition).classList.add('active');
}

function selectPayment(method) {
    selectedPayment = method;
    document.getElementById('pay-cash').classList.remove('active');
    document.getElementById('pay-digital').classList.remove('active');
    const paypalBtn = document.getElementById('pay-paypal');
    if (paypalBtn) paypalBtn.classList.remove('active');
    
    if (method === 'Cash') document.getElementById('pay-cash').classList.add('active');
    if (method === 'Digital') document.getElementById('pay-digital').classList.add('active');
    if (method === 'PayPal' && paypalBtn) paypalBtn.classList.add('active');
    
    updatePaymentInstructions();
}

function updatePaymentInstructions() {
    const langObj = translations[userLanguage];
    const box = document.getElementById('payment-instructions');
    
    if (selectedPayment === 'Cash') {
        box.innerHTML = langObj.cashInst;
    } else if (selectedPayment === 'Digital' && userRegion === 'Israel') {
        box.innerHTML = selectedFulfillment === 'Delivery' ? langObj.bitInstDelivery : langObj.bitInstPickup;
    } else if (selectedPayment === 'Digital' && userRegion === 'USA') {
        box.innerHTML = langObj.zelleInst;
    } else if (selectedPayment === 'PayPal' && userRegion === 'USA') {
        box.innerHTML = langObj.paypalInst;
    }
}

function changeImage(src) {
    document.getElementById('hero-img').src = src;
}

// Form Submission via Formspree
function submitOrder() {
    const buyerName = document.getElementById('buyer-name').value.trim();
    const buyerPhone = document.getElementById('buyer-phone').value.trim();
    const buyerAddress = document.getElementById('buyer-address').value.trim();
    const langObj = translations[userLanguage];

    if (!buyerName || !buyerPhone) {
        alert(langObj.alertError);
        return;
    }

    if ((userRegion === 'USA' || selectedFulfillment === 'Delivery') && !buyerAddress) {
        alert(langObj.alertErrorAddress);
        return;
    }

    // Translating internal values to Hebrew for the Formspree email payload
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

    const targetUrl = userRegion === 'Israel' ? ORDER_WEBHOOK_URL_IL : ORDER_WEBHOOK_URL_US;

    const payload = {
        "שם לקוח": buyerName,
        "מספר טלפון": buyerPhone,
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
        if (response.ok) {
            document.getElementById('buyer-name').value = '';
            document.getElementById('buyer-phone').value = '';
            document.getElementById('buyer-address').value = '';
            
            const tyScreen = document.getElementById('thank-you-screen');
            tyScreen.style.display = 'flex';
            setTimeout(() => { tyScreen.style.opacity = '1'; }, 50);
        } else {
            alert("There was an error sending the order. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error sending order:', error);
        alert("There was a network error. Please check your connection.");
    });
}