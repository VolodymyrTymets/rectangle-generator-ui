
const spawn = require('threads').spawn;

class RectangleGenerator {
  constructor() {
    this._outNumber1 = 14;
    this._outNumber2 = 15;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.log = this.log.bind(this);
  }

  log(message) {
    console.log(`-> [RectangleGenerator]: ${message.message || message}`)
  }

  start(freq, position){
    this._thread = spawn(function (input, done) {
      const { generateRectangle } = require('rectangle-generator-thread-worker');
      const { freq, position, outNumber1, outNumber2  } = input;
      generateRectangle(freq, position, outNumber1, outNumber2, done);
    })
    .send({ outNumber1: this._outNumber1, outNumber2: this._outNumber2, freq, position })
    .on('error', this.log)
    .on('exit', () => this.log('stopped!'));
  }
  stop() {
    this._thread.kill();
    try {
      const out1 = new Gpio(this._outNumber1, 'out');
      const out2 = new Gpio(this._outNumber2, 'out');
      out1.writeSync(0);
      out2.writeSync(0);
    } catch (err) {
      console.log('Error -> GPIO is not detected!!!');
    }
  }
}

const rectangleGenerator = new RectangleGenerator();
module.exports = { rectangleGenerator };