import { h, Component } from "preact";
import { Scrollbars } from "preact-custom-scrollbars";
import getIFrameHeight from "./iframeHeight";

export class Device extends Component {
  constructor(props) {
    super(props);
    this.frameLoad = this.frameLoad.bind(this);
  }
  frameLoad() {
    this.setState({frameHeight: getIFrameHeight(this.iframe.contentWindow) + "px"});
    this.scaleIt();
  }
  scaleIt() {
    const scale = Math.min(
      this.wrapper.offsetWidth / this.viewport.offsetWidth,
      this.wrapper.offsetHeight / this.viewport.offsetHeight
    );
    const fitOption = Math.round(scale * 100);
    this.props.updateParent('fitOption', fitOption);
    if (scale < 1) {
      this.wrapper.classList.add("scaled");
      this.props.updateParent('zoom', Math.round(scale * 100));
    } else {
      this.wrapper.classList.remove("scaled");
      this.props.updateParent('zoom', 100);
    }
  }
  renderClassName() {
    let noframe = this.props.showDevice ? " " : "no-device ";
    let landscape = this.props.landscape ? "landscape " : "";
    return (
      "viewport marvel-device " +
      noframe +
      landscape +
      " " +
      this.props.color +
      " " +
      this.props.device
    );
  }
  render(props, state) {
    return (
      <div className="wrapper" ref={wrapper => (this.wrapper = wrapper)}>
        <div
          className={this.renderClassName()}
          style={{
            transform:
              "translate(-50%, -50%) " + "scale(" + props.zoom / 100 + ")"
          }}
          ref={viewport => (this.viewport = viewport)}
        >
          <div className="notch">
            <div className="camera" />
            <div className="speaker" />
          </div>
          <div className="top-bar" />
          <div className="sleep" />
          <div className="volume" />
          <div className="overflow">
            <div className="shadow shadow--tr" />
            <div className="shadow shadow--tl" />
            <div className="shadow shadow--br" />
            <div className="shadow shadow--bl" />
          </div>
          <div className="inner-shadow" />
          <div className="sensors" />
          <div className="more-sensors" />
          <div className="inner" />
          <div className="camera" />
          <div className="sensor" />
          <div className="speaker" />
          <div
            className="screen"
            id="screen"
            ref={screen => (this.screen = screen)}
          >
            <Scrollbars autoHide>
              <iframe
                src={props.frame}
                onLoad={this.frameLoad}
                style={{height: state.frameHeight}}
                ref={iframe => (this.iframe = iframe)}
              />
            </Scrollbars>
          </div>
          <div className="home" />
          <div className="bottom-bar" />
        </div>
      </div>
    );
  }
}
