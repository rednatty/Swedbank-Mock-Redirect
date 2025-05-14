chrome.action.onClicked.addListener(async () => {
    const tab = await chrome.tabs.create({
        url: "https://applink.swedbank.net/tdeutil/applink.html",
        active: false
    });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.redirectTo) {
        console.log("✅ Redirecting to:", message.redirectTo);
        console.log("📦 R version:", message.version);
        console.log("🖥️ Host/Slot:", message.host);
        chrome.tabs.create({ url: message.redirectTo });
        if (sender.tab?.id) {
            chrome.tabs.remove(sender.tab.id);
        }
    } else if (message.error) {
        console.error("❌ Scraper error:", message.error);
    }
});