import React, { Component } from 'react'; // import from react

import { render, Window, App, Box, Separator, Area } from 'proton-native'; // import the proton-native components
import { FrequentlyForm } from './src/compoments'; // import the proton-native components

class Example extends Component {
  render() { // all Components must have a render method
    return (
      <App> // you must always include App around everything
        <Window title="Proton Native Rocks!" size={{w: 500, h: 500}} menuBar={false}>
          <Box>
              <FrequentlyForm />
          </Box>

        </Window>
      </App>
    );
  }
}

render(<Example />); // and finally render your main component
