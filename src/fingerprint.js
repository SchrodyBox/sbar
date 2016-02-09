/*!
 * sbar
 *
 * Eric Mann <eric@eamann.com>
 *
 * MIT License
 */

'use strict';

/**
 * Module dependencies
 */
var crypto = require( 'crypto' );

/**
 * Generate a SHA hash (fingerprint) from a given key.
 *
 * @param {string} key
 *
 * @return {String}
 */
function fingerprint( key ) {
	// Put our string into a buffer
	var print_buffer = new Buffer( key, 'base64' );

	// Hash the buffer
	var hashed = hash( print_buffer, 'md5' );

	// Return a colon-delimited version
	return addColons( hashed );
}

/**
 * Hash a string according to a given algorithm.
 *
 * @param {buffer} input
 * @param {string} algorithm
 *
 * @return {string}
 */
function hash( input, algorithm ) {
	var hasher = crypto.createHash( algorithm );

	// Add our data
	hasher.update( input );

	// Return the hashed value
	return hasher.digest( 'hex' );
}

/**
 * Add colons every two characters for normalization.
 *
 * @param {string} raw
 *
 * @return {string}
 */
function addColons( raw ) {
	return raw.replace( /(.{2})(?=.)/g, '$1:' );
}

module.exports = fingerprint;