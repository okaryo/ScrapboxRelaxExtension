import { createRoot } from "react-dom/client";

import RelaxIcon from "./RelaxIcon";

const renderRelaxIcon = () => {
	const pageMenu = document.querySelector(".page-menu");
	const existingRelaxIcon = document.getElementById("extension-relax-icon");
	if (pageMenu && !existingRelaxIcon) {
		const relaxDropdownIcon = document.createElement("div");
		relaxDropdownIcon.id = "extension-relax-icon";
		relaxDropdownIcon.className = "dropdown";

		pageMenu.appendChild(relaxDropdownIcon);
		const root = createRoot(relaxDropdownIcon);
		root.render(<RelaxIcon />);
	}
};

const isPageLoaded = () => {
	const appContainer = document.querySelector(".page-wrapper");
	return appContainer !== null;
};

const setupOnInitialPageLoad = () => {
	const targetNode = document.body;

	const callback: MutationCallback = (_, observer) => {
		if (isPageLoaded()) {
			renderRelaxIcon();
			listenOnPageNavigation();

			observer.disconnect();
		}
	};

	const observer = new MutationObserver(callback);
	const config = { childList: true, subtree: true };
	observer.observe(targetNode, config);
};

const listenOnPageNavigation = () => {
	const targetNode = document.querySelector(".page-wrapper");

	const callback: MutationCallback = (mutations) => {
		for (const mutation of mutations) {
			const target = mutation.target as HTMLElement;
			if (target.classList.contains("enter")) {
				renderRelaxIcon();
			}
		}
	};

	const observer = new MutationObserver(callback);
	const config = { attributes: true, attributeFilter: ["class"] };
	observer.observe(targetNode, config);
};

setupOnInitialPageLoad();
