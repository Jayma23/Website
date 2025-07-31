const CookieManager = {
  set(name, value, days = 30, path = '/', secure = true, sameSite = 'Lax') {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }

    const secureFlag = secure && location.protocol === 'https:' ? '; Secure' : '';
    const sameSiteFlag = sameSite ? `; SameSite=${sameSite}` : '';

    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${secureFlag}${sameSiteFlag}`;
  },

  get(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  },

  delete(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  },

  isEnabled() {
    try {
      this.set('cookieTest', 'test', 1);
      const enabled = this.get('cookieTest') === 'test';
      this.delete('cookieTest');
      return enabled;
    } catch {
      return false;
    }
  },

  setAuth(token, userInfo = {}, rememberMe = false) {
    const days = rememberMe ? 30 : 7;
    this.set('authToken', token, days);
    this.set('userInfo', JSON.stringify(userInfo), days);
    this.set('isLoggedIn', 'true', days);
  },

  getAuth() {
    const token = this.get('authToken');
    const userInfoStr = this.get('userInfo');
    const isLoggedIn = this.get('isLoggedIn') === 'true';

    let userInfo = null;
    try {
      userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch (e) {
      console.warn('❗ Failed to parse userInfo:', e);
    }

    const authData = {
      token,
      userInfo,
      isLoggedIn: isLoggedIn && !!token && !!userInfo
    };

    console.log('💬 CookieManager.getAuth():', authData);
    return authData;
  },

  clearAuth() {
    this.delete('authToken');
    this.delete('userInfo');
    this.delete('isLoggedIn');
  },

  setPreferences(preferences) {
    this.set('userPrefs', JSON.stringify(preferences), 365);
  },

  getPreferences() {
    const prefs = this.get('userPrefs');
    try {
      return prefs ? JSON.parse(prefs) : {};
    } catch (e) {
      console.warn('❗ Failed to parse userPrefs:', e);
      return {};
    }
  }
};

window.CookieManager = CookieManager;
