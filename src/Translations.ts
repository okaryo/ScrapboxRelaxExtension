class Translations {
	get bonfire() {
		return chrome.i18n.getMessage("bonfire");
	}
	get rain() {
		return chrome.i18n.getMessage("rain");
	}
	get forest() {
		return chrome.i18n.getMessage("forest");
	}
	get stop() {
		return chrome.i18n.getMessage("stop");
	}
}

const t = new Translations();

export default t;
