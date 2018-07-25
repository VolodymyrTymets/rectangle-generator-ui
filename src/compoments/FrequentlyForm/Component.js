import React, { Component } from 'react'; // import from react
import { rectangleGenerator } from '../../utils/rectangle-generator/index';
import { Box, Button, Separator, Spinbox, Text, Area, StyledText, Group } from 'proton-native'; // import the proton-native components

class FrequentlyForm extends Component {
  constructor(props) {
    super(props);
    this.state = { mode: '1', frequently: 450, isExecuting: false };
    this._step = 50;
    this._max = 1000;
    this._min = 1;
    this._isExecuting = true;
    this.onFrequentlyChange = this.onFrequentlyChange.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
    this.onStart = this.onStart.bind(this);
  }

  onFrequentlyChange(value) {
    const newFrequently = value === '+'
      ? this.state.frequently + this._step
      : this.state.frequently - this._step;
    this.setState({ ...this.state, frequently: newFrequently })
  }
  onModeChange(value) {
    this.setState({ ...this.state, mode: value })
  }
  onStart(value) {
    if(!this.state.isExecuting) {
      rectangleGenerator.start(this.state.frequently || 1, this.state.mode);
    } else {
      rectangleGenerator.stop();
    }
    this.setState({ ...this.state, isExecuting: !this.state.isExecuting })
  }
  render() { // all Components must have a render method
    return (
      <Box padded={true} >
        <Group margined={true}>
            <Area>
              <Area.Text style={{ fontSize: 16, textAlign: 'center' }} >
                Rectangle generator controller
              </Area.Text>
            </Area>
        </Group>

        <Group title="Mode of stimulation" margined={true}>
          <Box vertical={false} padded={true}>
            <Button onClick={this.onModeChange} enabled={this.state.mode !== '1'}>1</Button>
            <Button onClick={this.onModeChange} enabled={this.state.mode !== '2'}>2</Button>
            <Button onClick={this.onModeChange} enabled={this.state.mode !== '3'}>3</Button>
          </Box>
        </Group>
        <Separator vertical={false}/>
        <Group title="Frequently">
          <Box vertical={false} padded={true}>
            <Box/>
            <Text>{this.state.frequently || 1} Hz</Text>
            <Box vertical={false} padded={true}>
              <Button onClick={this.onFrequentlyChange} enabled={this.state.frequently < this._max}>+</Button>
              <Button onClick={this.onFrequentlyChange} enabled={this.state.frequently > this._min}>-</Button>
            </Box>
          </Box>

        </Group>
        <Separator vertical={false}/>
        <Button onClick={this.onStart}>{!this.state.isExecuting ? 'Start' : 'Stop'}</Button>
      </Box>
    );
  }
}

export { FrequentlyForm }