const CookieManager = {
  set: function(name, value, days = 30, path = '/', secure = true, sameSite = 'Lax') {
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

  get: function(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  },

  delete: function(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  },

  isEnabled: function() {
    try {
      const testKey = 'cookieTest';
      this.set(testKey, 'test', 1);
      const isEnabled = this.get(testKey) === 'test';
      this.delete(testKey);
      return isEnabled;
    } catch (e) {
      return false;
    }
  },

  setAuth: function(token, userInfo = null, rememberMe = false) {
    const expireDays = rememberMe ? 30 : 7;
    this.set('authToken', token, expireDays);
    if (userInfo) {
      this.set('userInfo', JSON.stringify(userInfo), expireDays);
    }
    this.set('isLoggedIn', 'true', expireDays);
  },

  getAuth: function() {
    const token = this.get('authToken');
    const userInfoStr = this.get('userInfo');
    const isLoggedIn = this.get('isLoggedIn') === 'true';

    let userInfo = null;
    if (userInfoStr) {
      try {
        userInfo = JSON.parse(userInfoStr);
      } catch (e) {
        console.warn('Failed to parse user info from cookie:', e);
      }
    }

    return {
      token,
      userInfo,
      isLoggedIn: isLoggedIn && token
    };
  },

  clearAuth: function() {
    this.delete('authToken');
    this.delete('userInfo');
    this.delete('isLoggedIn');
  },

  setPreferences: function(preferences) {
    this.set('userPrefs', JSON.stringify(preferences), 365);
  },

  getPreferences: function() {
    const prefsStr = this.get('userPrefs');
    if (prefsStr) {
      try {
        return JSON.parse(prefsStr);
      } catch (e) {
        console.warn('Failed to parse preferences from cookie:', e);
      }
    }
    return {};
  }
};
