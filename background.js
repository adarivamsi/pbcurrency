// When you specify "type": "module" in the manifest background,
// you can include the service worker as an ES Module,
import { currencyPatterns } from "./patterns.js";

// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  for (const [currency, pattern] of Object.entries(currencyPatterns)) {
    chrome.contextMenus.create({
      id: currency,
      title: pattern,
      type: "normal",
      contexts: ["selection"],
    });
  }
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const currency = item.menuItemId;
  const url = new URL(`https://google.com/search?q=`);
  const selectionText = item.selectionTextcurrency;
  url.searchParams.set("q", `${selectionText} to ${currency}`);
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

// Add or removes the pattern from context menu
// when the user checks or unchecks the pattern in the popup
chrome.storage.onChanged.addListener(({ enabledCurrencies }) => {
  if (typeof enabledCurrencies === "undefined") return;

  const allCurrencies = Object.keys(currencyPatterns);
  const currentCurrencies = new Set(enabledCurrencies.newValue);
  const oldCurrencies = new Set(enabledCurrencies.oldValue ?? allCurrencies);
  const changes = allCurrencies.map((currency) => ({
    currency,
    added: currentCurrencies.has(currency) && !oldCurrencies.has(currency),
    removed: !currentCurrencies.has(currency) && oldCurrencies.has(currency),
  }));

  for (const { currency, added, removed } of changes) {
    if (added) {
      chrome.contextMenus.create({
        id: currency,
        title: currencyPatterns[currency],
        type: "normal",
        contexts: ["selection"],
      });
    } else if (removed) {
      chrome.contextMenus.remove(currency);
    }
  }
});
