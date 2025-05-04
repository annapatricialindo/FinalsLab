export default {
    state: {
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        products: [
            { id: 1, name: "Neon Dreams", description: "A journey through retro synthwave beats and futuristic soundscapes.", genre: "Synthwave", price: 12, color: "#ff0066", audio: new Audio("/audio/Theme1.mp3"), BG: "/image/BG1.jpg", visualPrimaryColor: "#ffcc00", visualSecondaryColor: "#ff3366" },
            { id: 2, name: "Acoustic Horizon", description: "Soothing guitar melodies mixed with raw, heartfelt vocals.", genre: "Acoustic", price: 10, color: "#ffbb33", audio: new Audio("/audio/Theme2.mp3"), BG: "/image/BG2.jpg", visualPrimaryColor: "#ffaa00", visualSecondaryColor: "#cc5500" },
            { id: 3, name: "Midnight Groove", description: "A fusion of jazz and lo-fi beats perfect for late-night vibes.", genre: "Jazz Lo-Fi", price: 14, color: "#3366ff", audio: new Audio("/audio/Theme3.mp3"), BG: "/image/BG3.avif", visualPrimaryColor: "#6699ff", visualSecondaryColor: "#003366" },
            { id: 4, name: "Eclipse Bass", description: "Dark, pulsating bass lines and hypnotic electronic rhythms.", genre: "EDM / House", price: 15, color: "#9900cc", audio: new Audio("/audio/Theme4.mp3"), BG: "/image/BG4.jpg", visualPrimaryColor: "#cc33ff", visualSecondaryColor: "#660099" },
            { id: 5, name: "Golden Era", description: "A nostalgic throwback to classic hip-hop beats and lyrical mastery.", genre: "Hip-Hop", price: 13, color: "#ffaa00", audio: new Audio("/audio/Theme5.mp3"), BG: "/image/BG5.jpg", visualPrimaryColor: "#ffdd00", visualSecondaryColor: "#993300" },
            { id: 6, name: "Celestial Echoes", description: "Ambient textures and ethereal sounds for a cosmic journey.", genre: "Ambient", price: 11, color: "#00cc99", audio: new Audio("/audio/Theme6.mp3"), BG: "/image/BG6.png", visualPrimaryColor: "#33ffcc", visualSecondaryColor: "#006644" },
            { id: 7, name: "Heavy Riffs", description: "Powerful electric guitar solos and intense drum beats.", genre: "Rock / Metal", price: 16, color: "#cc0000", audio: new Audio("/audio/Theme7.mp3"), BG: "/image/BG7.jpg", visualPrimaryColor: "#ff3300", visualSecondaryColor: "#660000" },
            { id: 8, name: "Reggae Vibes", description: "Feel the sun and the ocean breeze with classic reggae grooves.", genre: "Reggae", price: 12, color: "#33cc33", audio: new Audio("/audio/Theme8.mp3"), BG: "/image/BG8.jpg", visualPrimaryColor: "#66ff66", visualSecondaryColor: "#005500" },
            { id: 9, name: "Orchestral Majesty", description: "A symphony of classical masterpieces and cinematic scores.", genre: "Classical", price: 18, color: "#9933ff", audio: new Audio("/audio/Theme9.mp3"), BG: "/image/BG9.jpg", visualPrimaryColor: "#cc99ff", visualSecondaryColor: "#330066" },
            { id: 10, name: "Latin Fire", description: "A passionate mix of salsa, bachata, and flamenco rhythms.", genre: "Latin", price: 14, color: "#ff5500", audio: new Audio("/audio/Theme10.mp3"), BG: "/image/BG10.jpg", visualPrimaryColor: "#ff9966", visualSecondaryColor: "#662200" },
            { id: 11, name: "Trap Nation", description: "Hard-hitting beats and deep bass for an urban sound.", genre: "Trap", price: 13, color: "#444444", audio: new Audio("/audio/Theme11.mp3"), BG: "/image/BG11.jpg", visualPrimaryColor: "#888888", visualSecondaryColor: "#222222" },
            { id: 12, name: "Cyber Pulse", description: "Intense techno and cyberpunk-inspired electronic music.", genre: "Techno", price: 17, color: "#00ffff", audio: new Audio("/audio/Theme12.mp3"), BG: "/image/BG12.avif", visualPrimaryColor: "#66ffff", visualSecondaryColor: "#003366" },
            { id: 13, name: "Country Roads", description: "A heartfelt collection of country classics and modern twangs.", genre: "Country", price: 12, color: "#cc6600", audio: new Audio("/audio/Theme13.mp3"), BG: "/image/BG13.jpg", visualPrimaryColor: "#ff9933", visualSecondaryColor: "#552200" },
            { id: 14, name: "Funky Town", description: "Groovy bass lines and funky rhythms that make you move.", genre: "Funk", price: 15, color: "#ff66b2", audio: new Audio("/audio/Theme14.mp3"), BG: "/image/BG14.avif", visualPrimaryColor: "#66b3ff", visualSecondaryColor: "#ff33a8" },
            { id: 15, name: "Blues Legends", description: "Soulful guitar solos and raw emotional storytelling.", genre: "Blues", price: 14, color: "#0033cc", audio: new Audio("/audio/Theme15.mp3"), BG: "/image/BG15.avif", visualPrimaryColor: "#6699ff", visualSecondaryColor: "#001144" }
        ],
        currentPage: 1,
        itemsPerPage: 15,
        activeIndex: 0, // Track the active product index
    },
    getters: {
        cartItems: (state) => {
            return state.cart.map(item => {
                const product = state.products.find(product => product.id === item.id);
                return { ...product, quantity: item.quantity }; // Combine product details with quantity
            });
        },
        cartCount: (state) => (state.cart ? state.cart.length : 0),
        totalPages: (state) => Math.ceil(state.products.length / state.itemsPerPage),
        paginatedProducts: (state) => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            return state.products.slice(start, start + state.itemsPerPage);
        },
        totalPrice: (state) =>
            state.cart.reduce((sum, item) => {
                const product = state.products.find(product => product.id === item.id);
                return sum + product.price * item.quantity;
            }, 0),
        activeProduct: (state) =>
            state.products[state.activeIndex] || state.products[0], // Ensure it's always valid
        totalQuantity: (state) => {
            return state.cart.reduce((total, item) => total + item.quantity, 0); // Sum up all quantities
        },
    },
    mutations: {
        ADD_TO_CART(state, product) {
            const item = state.cart.find((item) => item.id === product.id);
            if (item) {
                item.quantity++; // Increase quantity if already in cart
            } else {
                state.cart.push({ id: product.id, quantity: 1 }); // Store only id and quantity
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        UPDATE_QUANTITY(state, { id, quantity }) {
            const item = state.cart.find((i) => i.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.cart = state.cart.filter((i) => i.id !== id); // Remove item if quantity is 0
                } else {
                    item.quantity = quantity;
                }
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        REMOVE_ITEM(state, id) {
            state.cart = state.cart.filter((item) => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        CLEAR_CART(state) {
            state.cart = [];
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        SET_ACTIVE_INDEX(state, index) {
            state.activeIndex = index;
        },
        NEXT_PRODUCT(state) {
            state.activeIndex =
                state.activeIndex < state.products.length - 1 ? state.activeIndex + 1 : 0;
        },
        PREV_PRODUCT(state) {
            state.activeIndex =
                state.activeIndex > 0 ? state.activeIndex - 1 : state.products.length - 1;
        },
    },
    actions: {
        addToCart({ commit }, product) {
            commit("ADD_TO_CART", product);
        },
        updateQuantity({ commit }, payload) {
            commit("UPDATE_QUANTITY", payload);
        },
        removeItem({ commit }, id) {
            commit("REMOVE_ITEM", id);
        },
        clearCart({ commit }) {
            commit("CLEAR_CART");
        },
        setActiveIndex({ commit }, index) {
            commit("SET_ACTIVE_INDEX", index);
        },
        nextProduct({ commit }) {
            commit("NEXT_PRODUCT");
        },
        prevProduct({ commit }) {
            commit("PREV_PRODUCT");
        },
    },
};
