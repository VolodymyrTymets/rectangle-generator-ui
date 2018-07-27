const { round } = require('lodash');
const sleep = require('sleep');

const generateRectangle = (freq, position, outNumber1, outNumber2, done) => {
  let out1 = null;
  let out2 = null;

  try {
    const Gpio = require('onoff').Gpio;
    out1 = new Gpio(outNumber1, 'out');
    out2 = new Gpio(outNumber2, 'out');
  } catch (err) {
    console.log('Error -> GPIO is not detected!!!');
  }

  const stepTime = round((1000000 / freq) / 6);
  console.log(`run on gpio [${outNumber1}] [${outNumber2}] with frequency [${freq}] and position [${position}]`);
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
};

module.exports = { generateRectangle };