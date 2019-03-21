import habitat from 'preact-habitat';
import { h } from "preact";
import Previewer from "./components/previewer";
import "Devices.css/assets/devices.min.css";
import './index.css';

const { render } = habitat(Previewer);
render({
    selector: '.responsive-preview',
    inline: false,
    clean: false,
    clientSpecified: false
});