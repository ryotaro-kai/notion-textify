chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "copy-notion-content",
      title: "Textify Notion Page Content",
      contexts: ["all"],
      documentUrlPatterns: ["https://*.notion.so/*"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-notion-content") {
    // Chrome設定ページなどでは実行しない
    if (tab.url.startsWith("chrome://")) return;

    // 対象のタブで content.js ファイルを実行する
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});