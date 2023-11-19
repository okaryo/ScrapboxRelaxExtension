import { useEffect, useState } from "react";

let relaxAudio: HTMLAudioElement | null = null;
let backgroundImage: HTMLElement | null = null;

const RelaxIcon = () => {
	const [isPlaying, setIsPlaying] = useState(false);

	const changeBackgroundColorOnTextAreaFocus = (event: FocusEvent) => {
		const textarea = event.target as HTMLElement;
		textarea.style.background = "";
	};

	const startRelax = () => {
		const bgmUrl = chrome.runtime.getURL("assets/bonfire.mp3");
		const audio = new Audio(bgmUrl);
		audio.loop = true;
		audio.play();
		relaxAudio = audio;
		setIsPlaying(true);

		if (backgroundImage === null) {
			backgroundImage = document.createElement("div");
		}
		const url = chrome.runtime.getURL("assets/bonfire.jpg");
		backgroundImage.style.backgroundImage = `url(${url})`;
		backgroundImage.style.backgroundSize = "cover";
		backgroundImage.style.backgroundRepeat = "no-repeat";
		backgroundImage.style.backgroundPosition = "center";
		backgroundImage.style.transitionProperty = "filter";
		backgroundImage.style.transitionDuration = "2.5s";
		backgroundImage.style.transitionDelay = "1s";
		backgroundImage.style.filter = "none";
		backgroundImage.style.position = "fixed";
		backgroundImage.style.height = "100%";
		backgroundImage.style.width = "100%";
		backgroundImage.style.zIndex = "-1";
		setTimeout(() => {
			backgroundImage.style.filter = "blur(12px)";
		}, 1000);
		const body = document.querySelector("body");
		body.insertBefore(backgroundImage, body.firstChild);

		const mainPage: HTMLElement | null = document.querySelector("main.page");
		if (mainPage) {
			mainPage.style.backgroundColor = "transparent";
		}
		const texts = document.querySelectorAll(
			"main.page .editor, main.page .line-title, main.page .cursor-line",
		);
		texts.forEach((text: HTMLElement) => {
			text.style.color = "#FFFFFFCC";
		});
		const cursor: HTMLElement | null =
			document.querySelector("main.page .cursor");
		if (cursor) {
			cursor.style.backgroundColor = "#FFFFFFCC";
		}

		const textInput = document.getElementById("text-input");
		textInput.addEventListener("focus", changeBackgroundColorOnTextAreaFocus);
	};

	const restoreToOriginal = () => {
		if (relaxAudio) {
			relaxAudio.pause();
			relaxAudio = null;
			setIsPlaying(false);

			backgroundImage.remove();

			const mainPage: HTMLElement | null = document.querySelector("main.page");
			if (mainPage) {
				mainPage.style.backgroundColor = "";
			}
			const texts = document.querySelectorAll(
				"main.page .editor, main.page .line-title",
			);
			texts.forEach((text: HTMLElement) => {
				text.style.color = "";
			});
			const cursor: HTMLElement | null =
				document.querySelector("main.page .cursor");
			if (cursor) {
				cursor.style.backgroundColor = "";
			}
			const textInput = document.getElementById("text-input");
			textInput.removeEventListener(
				"focus",
				changeBackgroundColorOnTextAreaFocus,
			);
		}
	};

	useEffect(() => {
		const targetNode = document.querySelector(".page-wrapper");

		const callback: MutationCallback = (mutations, observer) => {
			for (const mutation of mutations) {
				const target = mutation.target as HTMLElement;
				if (target.classList.contains("leave")) {
					restoreToOriginal();
					observer.disconnect();
					break;
				}
			}
		};

		const observer = new MutationObserver(callback);
		const config = { attributes: true, attributeFilter: ["class"] };
		observer.observe(targetNode, config);
	}, [restoreToOriginal]);

	return (
		<>
			<button
				className="tool-btn dropdown-toggle"
				type="button"
				id="page-relax-menu"
				data-toggle="dropdown"
				aria-haspopup="true"
				aria-expanded="true"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					role="img"
					aria-label="RelaxIcon"
					className="kamon"
					style={{ fontFamily: "AppIcons", fill: "currentcolor" }}
				>
					<title>RelaxIcon</title>
					<path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm208-480q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
				</svg>
			</button>
			<ul
				className="dropdown-menu dropdown-menu-right"
				aria-labelledby="page-edit-menu"
			>
				<li>
					<a role="menuitem" onClick={startRelax}>
						Bonfire
					</a>
				</li>
				{isPlaying && (
					<>
						<li role="separator" className="divider" />
						<li>
							<a role="menuitem" onClick={restoreToOriginal}>
								<i className="kamon kamon-pause" />
								Stop
							</a>
						</li>
					</>
				)}
			</ul>
		</>
	);
};

export default RelaxIcon;
