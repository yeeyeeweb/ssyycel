const traverse = require('babel-traverse').default;
const collectDependencies = require('../visitors/dependencies');
const walk = require('babylon-walk');
const Asset = require('../Asset');
const babylon = require('babylon');

class JSAsset extends Asset {
  async getDependencies() {
    await this.loadIfNeeded();
    if (!/import |export [^;]* from|require\s*\(/.test(this.contents)) {
      // console.log('skip parse!', this.name);
      return;
    }

    super.getDependencies();
  }

  parse(code) {
    const options = {
      filename: this.name,
      allowReturnOutsideFunction: true,
      allowHashBang: true,
      ecmaVersion: Infinity,
      strictMode: false,
      sourceType: 'module',
      locations: true,
      plugins: [
        'asyncFunctions',
        'asyncGenerators',
        'classConstructorCall',
        'classProperties',
        'decorators',
        'exportExtensions',
        'jsx',
        'flow'
      ]
    };

    return babylon.parse(code, options);
  }

  traverse(visitor) {
    return traverse(this.ast, visitor, null, this);
  }

  traverseFast(visitor) {
    return walk.simple(this.ast, visitor, this);
  }

  collectDependencies() {
    this.traverseFast(collectDependencies);
  }
}

module.exports = JSAsset;
