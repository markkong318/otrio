export default new class Bottle {
  private map: Map<any, any>

  constructor() {
    this.map = new Map<any, any>()
  }

  setObject(obj) {
    if (obj.constructor.name === 'Function') {
      throw new Error('Argument is not a object');
    }

    console.log('[bottle] set object ' + obj.constructor.name)

    this.map.set(obj.constructor.name, obj)
  }

  getObject(obj) {
    if (!obj.name) {
      throw new Error('Argument is not a class');
    }

    console.log('[bottle] get object ' + obj.name)

    return this.map.get(obj.name);
  }

  set(key, vale) {
    this.map.set(key,vale);
  }

  get(key) {
    return this.map.get(key);
  }
}()
