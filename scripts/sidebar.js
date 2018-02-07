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
//сук не могу отловить момент и причину  почему иногда не отрабатывает
setTimeout(findAndRemove, 1000);