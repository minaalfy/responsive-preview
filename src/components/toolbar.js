import { h, Component } from "preact";

export class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.deviceChange = this.deviceChange.bind(this);
    this.zoomChange = this.zoomChange.bind(this);
    this.state = {
      device: props.devices[0],
      deviceId: props.devices[0].id,
      zoom: 100,
      landscape: false,
      showDevice: true,
      color: " "
    };
  }
  deviceChange(event) {
    let device = this.props.devices.find(
      o => o.id === parseInt(event.target.value)
    );
    this.setState({ device, deviceId: event.target.value });
    this.props.updateParent('device', this.state.device.value);
    this.props.frameHeightCalc();
  }
  zoomChange(z) {
    this.setState({ zoom: parseInt(z.target.value) });
    this.props.updateParent('zoom', this.state.zoom);
  }
  componentWillReceiveProps(nextProps){
    this.setState({ zoom: nextProps.zoom });
  }
  render(props, state) {
    return (
      <header>
        <select value={this.state.deviceId} onChange={this.deviceChange}>
          {props.devices.map(device => (
            <option value={device.id}>{device.name}</option>
          ))}
        </select>
        <div id="deviceColors">
          {state.device.colors.map(color => (
            <button
              onClick={() => {
                this.setState({ color });
                props.updateParent('color', color);
              }}
              value={color}
              style={{ background: color }}
            />
          ))}
        </div>
        <span>|</span>
        <div>
          <label>Dimensions</label>
          <input
            type="text"
            value={state.landscape ? state.device.height : state.device.width}
            readonly
          />
          <span>X</span>
          <input
            type="text"
            value={state.landscape ? state.device.width : state.device.height}
            readonly
          />
        </div>
        <span>|</span>
        <button
          className="frameless"
          onClick={() => {
            this.setState({ landscape: !state.landscape });
            props.updateParent('landscape', this.state.landscape);
            props.frameHeightCalc();
          }}
          title="rotate"
        >
          <svg
            version="1.1"
            width="14px"
            height="14px"
            viewBox="0 0 612 612"
            xmlSpace="preserve"
            style={{ fill: state.landscape ? "red" : "black" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m419.48 63.75c84.15 38.25 142.8 119.85 153 216.75h38.25c-15.3-158.1-145.35-280.5-306-280.5h-17.85l96.9 96.9 35.7-33.15zm-160.65-20.4c-15.3-15.3-38.25-15.3-53.55 0l-163.2 163.2c-15.3 15.3-15.3 38.25 0 53.55l306 306c15.301 15.301 38.25 15.301 53.551 0l163.2-163.2c15.301-15.301 15.301-38.25 0-53.551l-306-306zm117.3 497.25-306-306 163.2-163.2 306 306-163.2 163.2zm-186.15 7.65c-84.15-38.25-142.8-119.85-153-216.75h-35.7c12.75 158.1 142.8 280.5 303.45 280.5h17.85l-96.899-96.9-35.701 33.15z" />
          </svg>
        </button>
        <span>|</span>
        <button
          className="frameless"
          onClick={() => {
            this.setState({ showDevice: !state.showDevice });
            props.updateParent('showDevice', this.state.showDevice);
            props.frameHeightCalc();
          }}
          title="toggle frames"
        >
          <svg
            version="1.1"
            width="20px"
            height="14px"
            viewBox="0 0 480.1 480.1"
            xmlSpace="preserve"
            style={{ fill: state.showDevice ? "red" : "black" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m206.76 332.99h-167.53c-3.894 0-7.065-3.173-7.065-7.067v-272.57c0-3.893 3.172-7.065 7.065-7.065h401.63c3.895 0 7.065 3.172 7.065 7.065v59.696c11.763 1.389 22.785 5.244 32.159 11.581v-71.277c0-21.63-17.602-39.225-39.225-39.225h-401.63c-21.623 0-39.225 17.594-39.225 39.225v272.57c0 21.631 17.602 39.227 39.225 39.227h134.62v52.581h-21.229c-13.316 0-24.12 10.796-24.12 24.12s10.804 24.12 24.12 24.12h67.71c-8.463-11.902-13.566-26.35-13.566-42.037v-90.943z" />
            <path d="m341.74 441.64v-34.742h-70.662v-221.9c0-4.681 3.8-8.489 8.479-8.489h159.89c4.679 0 8.478 3.808 8.478 8.489v68.676h12.046c7.364 0 14.179 2.127 20.113 5.597v-74.273c0-22.417-18.23-40.648-40.638-40.648h-159.89c-22.407 0-40.638 18.231-40.638 40.648v238.93c0 22.417 18.23 40.647 40.638 40.647h69.438c-4.428-6.359-7.255-15.22-7.255-22.934z" />
            <path d="m459.97 273.78h-77.996c-11.104 0-20.132 9.037-20.132 20.138v147.73c0 11.101 9.028 20.131 20.132 20.131h77.996c11.102 0 20.13-9.03 20.13-20.131v-147.73c0-11.101-9.029-20.137-20.13-20.137zm-74.009 24.119h70.019v127.7h-70.019v-127.7zm35.019 154.1c-2.215 0-4.193-0.896-5.7-2.277-1.713-1.555-2.812-3.739-2.812-6.228 0-4.694 3.801-8.495 8.512-8.495 4.679 0 8.479 3.801 8.479 8.495 0 2.489-1.1 4.672-2.795 6.228-1.509 1.382-3.487 2.277-5.684 2.277z" />
          </svg>
        </button>
        <span>|</span>
        <select id="zoomLevel" value={state.zoom} onChange={this.zoomChange}>
          <option value={props.fitOption}>
            Fit to window {props.fitOption} %
          </option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
        </select>
      </header>
    );
  }
}
