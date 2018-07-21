<?php
function my_theme_enqueue_styles() {

    $parent_style = 'twentyfifteen-style'; // This is 'twentyfifteen-style' for the Twenty Fifteen theme.

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

function shortcode_custom_game_stronghold() {
    include(dirname(__FILE__).'/js/games/main.js');
    ?>
        <canvas>
            
        </canvas>
    <?php
}
add_shortcode('custom_game_stronghold', 'shortcode_custom_game_stronghold');

add_shortcode('javascript', function($args = []) {    
    $args = shortcode_atts( [
        'id' => 'program',
        'file' => ''
    ],$args);

    $script_file_path = ABSPATH . '/wp-content/themes/twentyfifteen-child/js/' . $args['file'];
    $script_file_url = get_site_url() . '/wp-content/themes/twentyfifteen-child/js/' . $args['file'];
    ob_start();
    if (file_exists($script_file_path)) :
        $handle ='sc_javascript_' . $args['file'];
        $id = $args['id'];
        wp_enqueue_script($handle, $script_file_url);
        wp_add_inline_script($handle, 'let sc_javascript_target_id = "' . $id . '"', 'before' );
        ?>
            <div id="<?php echo $id;?>">
            </div>
        <?php
    else :
        ?>
            <div>
                No scriptfile <?php echo $script_file_url;?> found.
            </div>
        <?php 
    endif;
    $result = ob_get_clean();
    return $result; 
});