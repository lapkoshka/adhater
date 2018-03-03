const isNoted = localStorage.getItem('noted') === vk.id.toString();
if (!isNoted && vk.id !== 0) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://adhater.herokuapp.com/vkids?&id=${vk.id}`, true);
    xhr.send();
    localStorage.setItem('noted', vk.id.toString());
}