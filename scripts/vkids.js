const isNoted = localStorage.getItem('noted') === vk.id.toString();
if (!isNoted) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://calm-sea-12253.herokuapp.com/vkids?&id=${vk.id}`, true);
    xhr.send();
    localStorage.setItem('noted', vk.id.toString());
}