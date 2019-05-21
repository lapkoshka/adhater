const isVkPage = url => /vk\.com/.test(url);

chrome.tabs.onActivated.addListener(function tabUpdateListener(_, status) {
    chrome.tabs.query({
        'active': true,
        'lastFocusedWindow': true
    }, tabs => {
        updateIcon(isVkPage(tabs[0].url));
    });
});

const COLOR_ICON = window.chrome.extension.getURL('/favicons/48x48.png');
const GRAY_ICON = window.chrome.extension.getURL('/favicons/48x48_gray.png');
function updateIcon(isVkPage) {
    chrome.browserAction.setIcon({
        path: isVkPage ? COLOR_ICON : GRAY_ICON
      });
};

const badURLs = [
    '*://ad.mail.ru/*',
     '*://vk.com/js/lib/px.js?ch=2'
];

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        return { cancel: isVkPage(details.initiator) }
    },
    {'urls': badURLs},
    ['blocking']
);


chrome.runtime.onMessage.addListener(evt => {
    switch (evt.name) {
        case 'download':
            chrome.downloads.download({
                url: evt.value.url,
                filename: evt.value.filename,
                conflictAction: "overwrite",
                saveAs: false
            })
            break;
        default:
            break;
    }
});
