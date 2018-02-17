function findAndRemove() {
    const adSideBar = document.querySelector('#ads_left');
    makeUpElement(adSideBar);
};

function makeUpElement(element) {
    if (!element) {
        return;
    }
    element.style.display = 'none';
}

findAndRemove();