const badURLs = [
    '*://ad.mail.ru/static/admanhtml/*',
     '*://vk.com/js/lib/px.js?ch=2'
];

const COLOR_ICON = window.chrome.extension.getURL('/favicons/48x48.png');
const GRAY_ICON = window.chrome.extension.getURL('/favicons/48x48_gray.png');

chrome.tabs.onActivated.addListener(function tabUpdateListener(_, status) {
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, tabs => {
        const isVkPage = /vk\.com/.test(tabs[0].url);
        updateIcon(isVkPage);
    });
});

chrome.tabs.onUpdated.addListener(function tabUpdateListener(_, status) {
    if (status.status === 'complete') {
        update();
    }
});

function update() {
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, tabs => {
        const isVkPage = /vk\.com/.test(tabs[0].url);
        updateIcon(isVkPage);
        if (isVkPage) {
            clearSidebar(tabs[0].id);
            clearFeed(tabs[0].id);
        }
    });
}

function clearSidebar(tabId) {
    chrome.tabs.executeScript(tabId, {file : "scripts/sidebar.js"});
};

function clearFeed(tabId) {
    chrome.tabs.executeScript(tabId, {file : "scripts/feed.js"});
};

function updateIcon(isVkPage) {
    chrome.browserAction.setIcon({
        path: isVkPage ? COLOR_ICON : GRAY_ICON
      });
};

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        return {cancel: true}
    }, 
    {'urls': badURLs},  
    ['blocking']
);