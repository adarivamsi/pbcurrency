import { currencyPatterns } from "./patterns.js";

createForm().catch(console.error);

async function createForm() {
  const { enabledCurrencies = Object.keys(currencyPatterns) } =
    await chrome.storage.sync.get("enabledCurrencies");
  const checked = new Set(enabledCurrencies);

  const form = document.getElementById("form");
  for (const [currency, pattern] of Object.entries(currencyPatterns)) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked.has(currency);
    checkbox.name = currency;
    checkbox.addEventListener("click", (event) => {
      handleCheckboxClick(event).catch(console.error);
    });

    const span = document.createElement("span");
    span.textContent = pattern;

    const div = document.createElement("div");
    div.appendChild(checkbox);
    div.appendChild(span);

    form.appendChild(div);
  }
}

async function handleCheckboxClick(event) {
  const checkbox = event.target;
  const currency = checkbox.name;
  const enabled = checkbox.checked;

  const { enabledCurrencies = Object.keys(currencyPatterns) } =
    await chrome.storage.sync.get("enabledCurrencies");
  const currencySet = new Set(enabledCurrencies);

  if (enabled) currencySet.add(currency);
  else currencySet.delete(currency);

  await chrome.storage.sync.set({ enabledCurrencies: [...currencySet] });
}
