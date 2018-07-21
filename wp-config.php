<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'DB3362867');

/** MySQL database username */
define('DB_USER', 'U3362867');

/** MySQL database password */
define('DB_PASSWORD', 'XrGyTZ2EHz0iq3nnE');

/** MySQL hostname */
define('DB_HOST', 'rdbms.strato.de');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'tZ%*Tipw6S%dcs#szXdA3SbGYTR^4oIXrS4dfIn@%d99a7x@BA09BtoEsr6yuZPT');
define('SECURE_AUTH_KEY',  'o)xGLeIIq2EQL10ycN0v!93cr@uv9BBq@XCs6zCy1oBjQ7)3*G!^RbYo9UFCJY)W');
define('LOGGED_IN_KEY',    't!%MWTIsDOKt6Q%PEXV2cw#bt&v4t8mt8wJ3*kluduB0azczX8jL0we7h9JMLLNG');
define('NONCE_KEY',        'XGOs^U&Gd2sXSxA7QmpH^*zy2ioFfAim5VW6)Z*6VEl7YA*iUM!(cON(O2%QFQJv');
define('AUTH_SALT',        'M@oqwT)#X)SxhfwGtyk3HxgNB%9D2&ifccsi7FKSUo(hu0f8wwrSipPSx)W#%kS)');
define('SECURE_AUTH_SALT', 'Qf6#ITPQH3RNC(7y(DNjR@8oj&Ost4DER!*rc07iyk030r2wJu2lTOeLt35BLX@i');
define('LOGGED_IN_SALT',   'yXSI0WFY0S0EO)A%JOUQjG7cPrltuHls92%efohjQy#PP17)Px&Y*3#M7ufUlF#q');
define('NONCE_SALT',       '^bxRicIQOUWOZay#Oome65ItuG!9bfoSjgZ1Btf3w2wNH@nGJlx(kXe@vxBA^Iv1');
/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

define( 'WP_ALLOW_MULTISITE', true );

define ('FS_METHOD', 'direct');

define( "WP_AUTO_UPDATE_CORE", 'minor' );
