import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Switch(props) {
	return <p id="switch-label">{props.name}</p>;
}

class BankSwitch extends React.Component {
	render() {
		let classString = "switch-container";
		if (this.props.power) classString += " opaque disabled";

		return (
			<label className={classString}>
				<Switch name="Bank" />
				<input
					type="checkbox"
					onClick={
						this.props.power ? null : this.props.onSoundKitChange
					}
				/>
				<span className="switch"></span>
			</label>
		);
	}
}

class Slider extends React.Component {
	render() {
		let classString = "slider-container";
		if (this.props.power) classString += " opaque";
		return (
			<div className={classString}>
				<input
					type="range"
					min={0}
					max={1}
					step={0.02}
					value={this.props.volume}
					onChange={
						this.props.power ? null : this.props.onVolumeChange
					}
					className="slider"
					id="myRange"
				/>
			</div>
		);
	}
}

class DisplayPanel extends React.Component {
	render() {
		return (
			<div id="display">
				{this.props.power === false && (
					<p id="display-text">{this.props.displayMessage}</p>
				)}
			</div>
		);
	}
}

class PowerSwitch extends React.Component {
	render() {
		return (
			<label className="switch-container">
				<Switch name="Power" />
				<input type="checkbox" onClick={this.props.onPowerChange} />
				<span className="switch"></span>
			</label>
		);
	}
}

class ControlPanel extends React.Component {
	render() {
		return (
			<div id="control-panel">
				<p id="logo">FCC</p>
				<PowerSwitch onPowerChange={this.props.onPowerChange} />
				<DisplayPanel
					displayMessage={this.props.displayMessage}
					power={this.props.power}
				/>
				<Slider
					power={this.props.power}
					volume={this.props.volume}
					onVolumeChange={this.props.onVolumeChange}
				/>
				<BankSwitch
					onSoundKitChange={this.props.onSoundKitChange}
					power={this.props.power}
				/>
			</div>
		);
	}
}

class KeyPanel extends React.Component {
	render() {
		let classString = "drum-pad";
		if (this.props.power) classString += " opaque disabled";

		// * Creating Keys and connecting to Sounds and DisplayMessages
		//const audioSrcBase = "./public/sounds/s";
		const keys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
		const keyItems = keys.map((element, index) => {
			//let number = index + 1;
			//let audioSrc = audioSrcBase + number.toString() + ".mp3";
      let audioSrc = audioLinks[index];
			return (
				<li
					onClick={
						this.props.power
							? null
							: (e) => this.props.onKeyPress(e, element)
					}
					key={element}
					className={classString}
					id={"Audio " + element}
					tabIndex="0"
				>
					{element}
					<audio
						id={element}
						className="clip"
						src={audioSrc}
						type="audio/mpeg"
					></audio>
				</li>
			);
		});

		return <ul id="key-panel">{keyItems}</ul>;
	}
}

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			power: false,
			displayMessage: "",
			soundKit: 1,
			volume: 1,
		};
		this.handlePowerChange = this.handlePowerChange.bind(this);
		this.playAudio = this.playAudio.bind(this);
		this.changeSoundKit = this.changeSoundKit.bind(this);
		this.handleVolumeChange = this.handleVolumeChange.bind(this);
	}

	handlePowerChange(e) {
		this.setState({
			power: !this.state.power,
		});
	}

	playAudio(e, element) {
		let audio = document.getElementById(element);
		this.state.soundKit === 1
			? (element = "Heater " + element)
			: (element = "Smooth Piano " + element);
		audio.volume = this.state.volume;
		audio.play();
		this.setState({
			displayMessage: element,
		});
	}

	changeSoundKit() {
		this.state.soundKit === 1
			? this.setState({ soundKit: 2, displayMessage: "Smooth Piano Kit" })
			: this.setState({ soundKit: 1, displayMessage: "Heater Kit" });
	}

	handleVolumeChange(e) {
		this.setState({
			volume: e.target.valueAsNumber,
			displayMessage: `Volume: ${e.target.valueAsNumber}`,
		});
	}

	render() {
		return (
			<div id="drum-machine">
				<KeyPanel
					power={this.state.power}
					onKeyPress={this.playAudio}
				/>
				<ControlPanel
					displayMessage={this.state.displayMessage}
					power={this.state.power}
					onPowerChange={this.handlePowerChange}
					onSoundKitChange={this.changeSoundKit}
					volume={this.state.volume}
					onVolumeChange={this.handleVolumeChange}
				/>
			</div>
		);
	}
}


root.render(<App />);

document.addEventListener("keydown", (event) => {
	let letters = ["q", "w", "e", "a", "s", "d", "z", "x", "c"];
	if (letters.includes(event.key.toLowerCase())) {
		let drumPad = document.getElementById(
			"Audio " + event.key.toUpperCase()
		);
		drumPad.classList.add("active");
		drumPad.click();
		setTimeout(function () {
			drumPad.classList.remove("active");
		}, 500);
		drumPad.click();
	}
});

const audioLinks = [
	"https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
	"https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
];




root.render(
  <React.StrictMode>
    <Canvas />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
