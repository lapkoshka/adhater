NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.forEach = Array.prototype.forEach;

IS_MOBILE = /m\.vk\.com/.test(location.href);
IS_FEED_PAGE = /vk\.com\/feed/.test(location.href)

AD_CLASSES = [
    '.ads_ads_news_wrap',
    '._ads_promoted_post_data_w'
];

AD_MARKS = [
    '.wall_marked_as_ads',
    '.ads_mark'
];

postPunisher = {
        
    findAndRemove: () => {
        const feedPosts = postPunisher.getAdsPostsByClassName(AD_CLASSES);
        feedPosts.forEach(post => {
            if (IS_MOBILE || !IS_FEED_PAGE) {
                postPunisher.makeUpElement(post);
                return;
            }
            postPunisher.makeUpElement(post.firstChild);
        })

        const groupPosts = postPunisher.getAdsPostsApprovedByGroupOwner();
        groupPosts.forEach(post => {
            postPunisher.makeUpElement(post);
        });

    },

    /** 
     * @param {Array<string>}
     * @return {Array<Element>} 
     */
    getAdsPostsByClassName: classNames => {
        const elements = classNames
            .reduce((map, className) => {
                document.querySelectorAll(className).forEach(element => map.push(element));
                return map;
            },[])
            .filter(post => post);

        if (IS_MOBILE || !IS_FEED_PAGE) {
            return elements;
        }
        return elements.map(post => post.parentElement);
    },

    /** @return {Array<Element>} */
    getAdsPostsApprovedByGroupOwner: function() {
        const selector = IS_MOBILE ? '.wall_posts' : '#page_wall_posts'
        const nodeListWithResults = document.querySelectorAll(selector);
        if (nodeListWithResults.length) {
            nodeListWithResults
            return Array.from(nodeListWithResults[0].children).filter(post => {
                return Boolean(AD_MARKS.some(mark => post.querySelector(mark)));
            });
        } else {
            return [];
        }
    },

    /** @param {Element} */
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

document.addEventListener('scroll', evt => {
    const sizeIsNotChange = lastScrollHeight === document.body.scrollHeight;
    if (sizeIsNotChange) {
        return;
    }

    lastScrollHeight = document.body.scrollHeight
    postPunisher.findAndRemove();
});