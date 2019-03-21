import { h } from 'preact';
import { Toolbar } from '../src/components/toolbar';
import { shallow } from 'preact-render-spy';
import { Devices } from '../src/components/devices';

let toolbar;
let select;

describe('Toolbar render elements', () => {
  beforeEach(() => {
    toolbar = shallow(<Toolbar
      devices={Devices}
      updateParent={() => { }}
      zoom={100}
      frameHeightCalc={() => { }}
    />);
  })
  test('Toolbar renders 2 buttons, 2 inputs and 2 select boxes', () => {
    expect(toolbar.find('button').length).toBe(2);
    expect(toolbar.find('select').length).toBe(2);
    expect(toolbar.find('input').length).toBe(2);
    expect(toolbar).toMatchSnapshot();
  });
  test('Toolbar renders 13 device options for a given Devices array of 13', () => {
    const select = toolbar.find('select').at(0);
    expect(select.find('option').length).toBe(13);
  });

});

describe('Select Device and skin', () => {
  beforeEach(() => {
    toolbar = shallow(<Toolbar
      devices={Devices}
      updateParent={() => { }}
      zoom={100}
      frameHeightCalc={() => { }}
    />);
    select = toolbar.find('select').at(0);
  })
  test('Toolbar select device from devices dropdown', () => {
    expect(toolbar.state().deviceId).toBe(1);
    select.simulate('change', { target: { value: 4 } });
    expect(toolbar.state().deviceId).toBe(4);
  });
  test('Toolbar render button to each device skin', () => {
    expect(toolbar.find('#deviceColors').children().length).toBe(0);
    select.simulate('change', { target: { value: 4 } });
    expect(toolbar.find('#deviceColors').children().length).toBe(2);
  });
  test('Toolbar update skin on click on skin button', () => {
    expect(toolbar.state().color).toBe(" ");
    select.simulate('change', { target: { value: 4 } });
    toolbar.find('#deviceColors').children().at(0).simulate('click');
    expect(toolbar.state().color).toBe(toolbar.state().device.colors[0]);
  });
});
describe('Toolbar button rotate', () => {
  beforeEach(() => {
    toolbar = shallow(<Toolbar
      devices={Devices}
      updateParent={() => { }}
      zoom={100}
      frameHeightCalc={() => { }}
    />);
  })
  test('Toolbar toggle landscape on click on rotate', () => {
    expect(toolbar.state().landscape).not.toBeTruthy();
    toolbar.find('button').at(0).simulate('click');
    expect(toolbar.state().landscape).toBeTruthy();
  });
  test('Toolbar swap width and height on toggle landscape', () => {
    expect(toolbar.find('input').at(0).attr('value')).toBe(Devices[0].width);
    expect(toolbar.find('input').at(1).attr('value')).toBe(Devices[0].height);
    toolbar.find('button').at(0).simulate('click');
    expect(toolbar.find('input').at(1).attr('value')).toBe(Devices[0].width);
    expect(toolbar.find('input').at(0).attr('value')).toBe(Devices[0].height);
  });
});
describe('Toolbar toggle frames', () => {
  beforeEach(() => {
    toolbar = shallow(<Toolbar
      devices={Devices}
      updateParent={() => { }}
      zoom={100}
      frameHeightCalc={() => { }}
    />);
  })
  test('Toolbar toggle showDevice on click on toggle frames', () => {
    expect(toolbar.state().showDevice).toBeTruthy();
    toolbar.find('button').at(1).simulate('click');
    expect(toolbar.state().showDevice).not.toBeTruthy();
  });
})
describe('Toolbar Change zoom from zooms dropdown', () => {
  beforeEach(() => {
    toolbar = shallow(<Toolbar
      devices={Devices}
      updateParent={() => { }}
      zoom={100}
      frameHeightCalc={() => { }}
    />);
  })
  test('Toolbar should update zoom on select zoom', () => {
    expect(toolbar.state().zoom).toBe(100);
    toolbar.find('select').at(1).simulate('change', { target: { value: 50 } });
    expect(toolbar.state().zoom).toBe(50);
  });
})