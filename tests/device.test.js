import { h } from 'preact';
import { Device } from '../src/components/device';
import { shallow } from 'preact-render-spy';
import { Devices } from '../src/components/devices';
import { Scrollbars } from 'preact-custom-scrollbars';

let device;
let wrapper;
let iframe;

describe('Toolbar render elements', () => {
  beforeEach(() => {
    device = shallow(<Device
      updateParent={() => { }}
      zoom={100}
      frame={'../app.html'}
      landscape={false}
      showDevice={true}
      color={' '}
      device={Devices[0].value}
      frameHeightCalc={() => { }}
    />);
    wrapper = device.find('.wrapper').childAt(0);
  })
  test('Device should match snapshot', () => {
    expect(device).toMatchSnapshot();
  });
  test('renders <Scrollbars /> component', () => {
    expect(wrapper.find(Scrollbars).length).toBe(1);
  });
  test('renders iframe with "app.html" src', () => {
    iframe = wrapper.find('iframe').at(0);
    expect(iframe.attr('src')).toBe("../app.html");
  });

  test('renders wrapper with scale 1 for given zoom 100', () => {
    expect(wrapper.attr('style').transform).toBe("translate(-50%, -50%) scale(1)");
  });

  test(`wrapper must have className  ${Devices[0].value}`, () => {
    expect(wrapper.attr('className').includes(Devices[0].value)).toBeTruthy();
    expect(wrapper.attr('className').includes('viewport marvel-device')).toBeTruthy();
    expect(wrapper.attr('className').includes('landscape')).not.toBeTruthy();
    expect(wrapper.attr('className').includes('no-device')).not.toBeTruthy();
  });

});