document.querySelector('.audio-show-clear').addEventListener('click', evt => {
    chrome.storage.sync.set({'audio': {}});
    const audioList_node = document.querySelector('.audio-list');
    Array.from(audioList_node.children).forEach(element => {
        if (element.nodeName === 'AUDIO') element.remove();
    })
    chrome.browserAction.setBadgeText({text: ''});
});

chrome.storage.sync.get(['audio'], data => {
    const audioList_node = document.querySelector('.audio-list');
    const list = data['audio'];
    for (let key in list) {
        
        const audioEl = document.createElement('audio');
        audioEl.controls = 'controls';
        audioEl.type = 'audio/mpeg';
        const onClickCb = evt => {
            console.log(evt.target);
            evt.target.src = list[key];
            evt.target.removeEventListener('click', onClickCb);
        }
        audioEl.addEventListener('click', onClickCb);
        audioList_node.appendChild(audioEl);
    }
});