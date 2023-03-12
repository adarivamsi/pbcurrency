chrome.contextMenus.create({
  title: "Currency Conversion Menu Item",
  id: "currencyConversionId",
  contexts: ["page"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "currencyConversionId") {
    alert("Clicked on currency conversion menu item!");
  }
});
