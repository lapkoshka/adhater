//Это удобней чем постоянно писать Array.from()
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.forEach = Array.prototype.forEach;

adClasses = ['.ads_ads_news_wrap','._ads_promoted_post_data_w'];

postSearcher = {
    getAdsPostsByClassName: classNames => {
        return classNames
            .reduce((map, className) => {
                document.querySelectorAll(className).forEach(element => map.push(element));
                return map;
            },[])
            .filter(post => post)
            .map(post => post.parentElement);
    },

    tryToFindByDataset: () => {
        const allPostsInNewsFeed = document.querySelector('.feed_row');
        //У рекламных постов есть dataset в котором есть данные о adblock
        return allPostsInNewsFeed.filter(post => post.childNodes[0].dataset.adBlockUid);
    },
    
    findAndRemove: () => {
        adPosts = postSearcher.getAdsPostsByClassName(adClasses);
        if (!adPosts.length) {
            adPosts = postSearcher.tryToFindByDataset();
        }
    
        adPosts.forEach(post => {
            makeUpElement(post.firstChild);
        })
    }
};

function makeUpElement(element) {
    if (!element) {
        return;
    }
    element.style.display = 'none';
    element.querySelector('._post_content').style.display = 'none';
};

postSearcher.findAndRemove();

window.adHater = {
    lastScrollHeight: document.body.scrollHeight
};

document.addEventListener('scroll', evt => {
	if (window.adHater.lastScrollHeight === document.body.scrollHeight) {
        return;
    }

    window.adHater.lastScrollHeight = document.body.scrollHeight
    postSearcher.findAndRemove();
});;