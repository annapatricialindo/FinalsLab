const auth = {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, // Ensure user data is retrieved
  }),
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Save user data in localStorage
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const res = await fetch('http://localhost:8000/api/auth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      commit('setToken', data.access);

      const userRes = await fetch('http://localhost:8000/api/auth/me/', {
        headers: { Authorization: `Bearer ${data.access}` }
      });
      if (!userRes.ok) throw new Error('Failed to fetch user');
      const userData = await userRes.json();
      console.log('Fetched user data from backend:', userData);
      commit('setUser', userData);
    },

    async register(_, payload) {
      const res = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      return await res.json(); // Optional if you want confirmation
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    userRole: state => state.user?.role
  }
};

export default auth;
