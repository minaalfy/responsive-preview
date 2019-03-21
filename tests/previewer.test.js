import { h } from 'preact';
import Previewer from '../src/components/previewer';
import { shallow } from 'preact-render-spy';
import { Device } from '../src/components/device';
import { Toolbar } from '../src/components/toolbar';

let previewer;

describe('Toolbar render elements', () => {
  beforeEach(() => {
    previewer = shallow(<Previewer
      app={'../app.html'}
    />);
  })
  test('Previewer should match snapshot', () => {
    expect(previewer).toMatchSnapshot();
  });
  test('renders 1 <Device /> and 1 <Toolbar /> components', () => {
    expect(previewer.find(Device).length).toBe(1);
    expect(previewer.find(Toolbar).length).toBe(1);
  });
});