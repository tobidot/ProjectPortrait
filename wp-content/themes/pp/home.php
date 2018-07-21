<?php

get_header();
?>

<div class="home">
    <?php while ( have_posts() ) :?>
    <?php
        the_post();
        echo the_content();
    ?>
    <?php endwhile; ?>
</div>

<?php
get_sidebar();
get_footer();
