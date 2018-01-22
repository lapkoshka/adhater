//Это удобней чем постоянно писать Array.from()
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.forEach = Array.prototype.forEach;

const isMobileVersion = /m\.vk\.com/.test(location.href);

adClasses = [
    '.ads_ads_news_wrap',
    '._ads_promoted_post_data_w'
];

postPunisher = {
        
    findAndRemove: () => {
        adPosts = postPunisher.getAdsPostsByClassName(adClasses);
    
        adPosts.forEach(post => {
            if (isMobileVersion) {
                postPunisher.makeUpElement(post);
                return;
            }
            postPunisher.makeUpElement(post.firstChild);
        })
    },

    getAdsPostsByClassName: classNames => {
        const elements = classNames
            .reduce((map, className) => {
                document.querySelectorAll(className).forEach(element => map.push(element));
                return map;
            },[])
            .filter(post => post);

        if(isMobileVersion) {
            return elements;
        }
        return elements.map(post => post.parentElement);
    },

    makeUpElement(element) {
        if (!element) {
            return;
        }
        element.style.display = 'none';
        const content = element.querySelector('._post_content');
        if (content) {
            content.style.display = 'none';
        }
    }
};

postPunisher.findAndRemove();
lastScrollHeight = document.body.scrollHeight

//Поиск и удаление рекламных постов каждый раз когда новостная лента увеличивается
document.addEventListener('scroll', evt => {
	if (lastScrollHeight === document.body.scrollHeight) {
        return;
    }

    lastScrollHeight = document.body.scrollHeight
    postPunisher.findAndRemove();
});