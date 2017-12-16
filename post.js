//i think array methods are good for dom nodes
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.forEach = Array.prototype.forEach;


adClasses = ['.ads_ads_news_wrap','._ads_promoted_post_data_w'];

function findAndRemove() {
    const adPosts = [];

    const adPostsByClassName = 
        adClasses.map(className => {
            return document.querySelector(className);
        }).filter(post => {
            return post;
        });

    if (adPostsByClassName.length) {
        adPostsByClassName.forEach(post => {
            adPosts.push(post.parentElement);
        });
    } else {
        const allPostsInNewsFeed = document.querySelectorAll('.feed_row');
        adPosts = allPostsInNewsFeed.filter(post => {
            const containsAdBlockUid = post.childNodes[0].dataset.adBlockUid;
            return containsAdBlockUid ? true : false;
        });
    }

    adPosts.forEach(post => {
        makeUpElement(post.firstChild);
    })
}

function makeUpElement(element) {
    if (!element) {
        return;
    }
    element.style.display = 'none';
    element.querySelector('._post_content').style.display = 'none';
};

findAndRemove();