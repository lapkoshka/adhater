chrome.tabs.onUpdated.addListener(function tabUpdateListener(id, status, info) {
    const extensionDisabled = localStorage.getItem('disabled');
    if (!info || extensionDisabled) {
        return;
    }

    const isVkFeedPageLoaded =
        isNewsFeed(info.url) && 
        status.status === 'complete';
    if (isVkFeedPageLoaded) {
        removeAdPost(id);
    }
    const isVkPage = isVkTab(info.url) && status.status === 'complete';
    if (isVkPage) {
        removeAdSidebar(id);
    }
});

function isNewsFeed(url) {
    return /vk.com\/feed/.test(url);
}

function isVkTab(url) {
    return /vk.com\//.test(url);
}

function removeAdPost(tabId) {
    chrome.tabs.executeScript(tabId, {file : "scripts/post.js"});
};

function removeAdSidebar(tabId) {
    chrome.tabs.executeScript(tabId, {file : "scripts/sidebar.js"});
};

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        console.log(details.url);
        return {
            redirectUrl: 'https://www.mail.ru/'
        }
    }, 
    {'urls': ['*://ad.mail.ru/static/admanhtml/*', '*://vk.com/js/lib/px.js?ch=2']},  
    ['blocking']
);