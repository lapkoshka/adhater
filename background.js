chrome.tabs.onUpdated.addListener(function tabUpdateListener(id, status, info) {

});

const badURLs = [
    '*://ad.mail.ru/static/admanhtml/*',
     '*://vk.com/js/lib/px.js?ch=2'
];

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        return {cancel: true}
    }, 
    {'urls': badURLs},  
    ['blocking']
);