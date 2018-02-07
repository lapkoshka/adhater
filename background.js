const badURLs = [
    '*://ad.mail.ru/static/admanhtml/*',
     '*://vk.com/js/lib/px.js?ch=2'
];

const COLOR_ICON = window.chrome.extension.getURL('/favicons/48x48.png');
const GRAY_ICON = window.chrome.extension.getURL('/favicons/48x48_gray.png');

chrome.tabs.onActivated.addListener(function tabUpdateListener(info) {
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow':
        true
    }, tabs => {
        const isVkPage = /vk\.com/.test(tabs[0].url);
        chrome.browserAction.setIcon({
            path: isVkPage ? COLOR_ICON : GRAY_ICON
          });
    });
});

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        return {cancel: true}
    }, 
    {'urls': badURLs},  
    ['blocking']
);