import { h, Component } from "preact";
import { Toolbar } from "./toolbar";
import { Device } from "./device";
import {Devices} from "./devices";

export default class Previewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 100,
      landscape: false,
      showDevice: true,
      fitOption: 100,
      device: Devices[0].value,
      color: " "
    };
  }
  updateParent(name, val) {
    this.setState({ [name]: val });
  }
  frameHeightCalc(name, val) {
    const _this = this;
    // wait for css animation 400ms
    setTimeout(function() {
      _this.Device.frameLoad();
    }, 401);
  }
  render(props, state) {
    return (
      <div>
        <Toolbar
          devices={Devices}
          updateParent={this.updateParent.bind(this)} 
          fitOption={state.fitOption}
          zoom={state.zoom}
          frameHeightCalc={this.frameHeightCalc.bind(this)}
        />
        <Device
          ref={Device => (this.Device = Device)}
          frame={props.app}
          zoom={state.zoom}
          landscape={state.landscape}
          showDevice={state.showDevice}
          color={state.color}
          device={state.device}
          updateParent={this.updateParent.bind(this)}
        />
      </div>
    );
  }
}