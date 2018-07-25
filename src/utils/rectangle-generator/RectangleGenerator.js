
const spawn = require('threads').spawn;

class RectangleGenerator_old {
  constructor() {
    this._out1 = null;
    this._out2 = null;
    this._outNumber1 = 14;
    this._outNumber2 = 15;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  start(freq, position){
    this._thread = spawn(function (input, done) {
      const _ = require('lodash');
      const sleep = require('sleep');
      const Gpio = require('onoff').Gpio;

      console.log('spawn -> ', input);
      const { freq, position, outNumber1, outNumber2  } = input;
      let out1 = null;
      let out2 = null;
      try {
        out1 = new Gpio(outNumber1, 'out');
        out2 = new Gpio(outNumber2, 'out');
      } catch (err) {
        console.log('Error -> GPIO is not detected!!!');
      }

      const stepTime = _.round((1000000 / freq) / 6);
      console.log(`run on gpio [${this._outNumber1}] [${this._outNumber2}] with frequency [${freq}] and position [${position}]`);
      const positionMap = {
        '1': [stepTime, stepTime, stepTime, stepTime, stepTime, stepTime],
        '2': [0, stepTime * 2, stepTime, 0, stepTime * 2, stepTime],
        '3': [0, stepTime * 2, 0, 0, stepTime * 2, 0]
      };

      let step = 1;
      const times = positionMap[position] || positionMap['1'];

      do {
        if(step === 6) {
          step = 1;
          out2 && out2.writeSync(1);
        }
        if(step === 2) {
          out1 && out1.writeSync(1)
        }
        if(step === 3) {
          out1 && out1.writeSync(0)
        }
        if(step === 5) {
          out2 && out2.writeSync(0)
        }
        times[step] - 1 && sleep.usleep(times[step -1]);
        step ++;
        console.log('.')
      } while (true);
      done();
    })
      .send({ outNumber1: this._outNumber1, outNumber2: this._outNumber2, freq, position })
      .on('message', function(response) {
        console.log('spawn on message -> ', response);
      })
      .on('error', function(error) {
        console.error('Worker errored:', error);
      })
      .on('exit', function() {
        console.log('Worker has been terminated.');
      });
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

const rectangleGenerator = new RectangleGenerator_old();
module.exports = { rectangleGenerator };