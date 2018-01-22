function findAndRemove() {
    const adSideBar = document.querySelector('#ads_left');
    makeUpElement(adSideBar);
};

function makeUpElement(element) {
    if (!makeUpElement) {
        return;
    }
    element.style.display = 'none';
}

findAndRemove();