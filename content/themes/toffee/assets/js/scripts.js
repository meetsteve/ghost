jQuery(function($) {

    $('body').removeClass('no-js');

    var $postsContainer = $('.js-posts-container');

    /* ============================================================ */
    /* Homepage Masonry */
    /* ============================================================ */

    if ($postsContainer.length > 0 ) {
        $postsContainer.imagesLoaded(function() {
            $postsContainer.masonry({
                itemSelector: '.post-stub',
                hiddenStyle: { opacity: 0 },
                visibleStyle: { opacity: 1 },
                transitionDuration: '0.5s'
            });

            // Add animate class to the posts container once tha masonry
            // layout is complete. This helps to avoid animation jump in
            // on page load.
            $postsContainer.masonry('on', 'layoutComplete', function() {
                $postsContainer.addClass('animate');
            });
        });
    }

    /* ============================================================ */
    /* Responsive Video Embeds */
    /* ============================================================ */

    $(".post").fitVids();

    /* ============================================================ */
    /* Featured Post */
    /* ============================================================ */

    var $postFeature = $('<div class="post-feature"></div>')
    var $firstPostElement = $('.js-post-content').children(':first');

    // Move the feature to the top of the post
    if ($firstPostElement.has('img, iframe').length > 0) {
        $postFeature.html($firstPostElement);

        $('.post').prepend($postFeature);
    }

    /* ============================================================ */
    /* Load More Posts */
    /* ============================================================ */

    var $loadMorePosts = $('.js-load-more-posts');
    var $spinner = $('<span class="spinner spinner-icon"></span>');
    var olderPostsUrl = $('.older-posts').attr('href');

    // Inform the user if there are no more posts
    if (olderPostsUrl === undefined) {
        $loadMorePosts.text('No More Posts');
    }

    $loadMorePosts.on('click', function(e) {
        e.preventDefault();

        // If there are posts to get
        if (olderPostsUrl !== undefined) {
            $loadMorePosts.html($spinner);

            $.get(olderPostsUrl, function(result) {
                var $html = $(result);
                var $newContent = $('.js-posts-container', $html).contents();

                $postsContainer.append($newContent);
                $('.post').fitVids();

                $postsContainer.imagesLoaded(function() {
                    $postsContainer.masonry('appended', $newContent);
                });

                // Set up the load more button after the layouts complete
                $postsContainer.masonry('on', 'layoutComplete', function() {
                    // Get the url for more posts
                    olderPostsUrl = $('.older-posts', $html).attr('href');

                    // Inform the user if there are no more posts
                    if (olderPostsUrl === undefined) {
                        $loadMorePosts.text('No More Posts');
                    } else {
                        $loadMorePosts.text('Load More');
                    }

                    // Prevent the event triggering more than once
                    return true;
                });
            });
        }
    });

});