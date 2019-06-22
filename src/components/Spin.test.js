import React from 'react';
import ReactDOM from 'react-dom';
import Spin from './Spin';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<Spin />, div);
  ReactDOM.unmountComponentAtNode(div);
});
