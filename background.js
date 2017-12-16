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

        //Audio AD investigating
        if (info.audible && info.title === "Реклама") {
            console.log('Catched!')
            chrome.tabs.executeScript(tabId, {code : "console.warn('Обнаружена реклама в аудиозаписях', getAudioPlayer().pause()"});
        }
        console.log(info)
    }
});

function isNewsFeed(url) {
    return /vk.com\/feed/.test(url);
}

function isVkTab(url) {
    return /vk.com\//.test(url);
}

function removeAdPost(tabId) {
    chrome.tabs.executeScript(tabId, {file : "post.js"});
};

function removeAdSidebar(tabId) {
    chrome.tabs.executeScript(tabId, {file : "sidebar.js"});
};