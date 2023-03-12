chrome.contextMenus.create({
  title: "Currency Conversion Menu Item",
  contexts: ["selection"],
  onclick: function (info, tab) {
    alert("Clicked on currency conversion menu item!");
  },
});
