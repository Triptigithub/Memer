class Cache {
  constructor(defaultTTL = 300000) { 
    this.map = new Map();
    this.defaultTTL = defaultTTL;
  }

  get(key) {
    const item = this.map.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.map.delete(key);
      return null;
    }
    
    return item.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    const item = {
      value,
      expiresAt: Date.now() + ttl
    };
    this.map.set(key, item);
  }

  delete(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  size() {
    return this.map.size;
  }
}

module.exports = new Cache();