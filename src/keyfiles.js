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
var fs = require( 'fs' ),
	path = require( 'path' ),
	Promise = require( 'promise' ),
	NodeRSA = require( 'node-rsa' ),
	write = Promise.denodeify( fs.writeFile ),
	read = Promise.denodeify( fs.readFile );

/**
 * Internal module variables
 */
var home = process.env.HOME || process.env.USERPROFILE,
	dir = path.join( home, '.schrody' ),
	public_key = '',
	private_key = '',
	friend_keys = {};

/**
 * If keys exist in the ~/.schrody directory, load them. If they don't, create them and then load them.
 *
 * @return {Promise}
 */
function detect_keys() {
	fs.mkdir( dir, function() {
		fs.stat( path.join( dir, 'ident' ), function( err, stats ) {
			if ( err ) {
				return create_keys().then( load_keys );
			} else {
				return load_keys();
			}
		} );
	} );
}

/**
 * Create the keys in the filesystem
 *
 * @return {Promise}
 */
function create_keys() {
	return new Promise( function( fulfill, reject ) {
		// Use a 1024 bit length
		var key = new NodeRSA( { b: 1024} );

		// Generate the public/private key pair
		key.generateKeyPair();

		// Export the keys
		var private_key = key.exportKey( 'pkcs1-private-pem' ),
			public_key = key.exportKey( 'pkcs1-public-pem' );

		// Create fs.writeFile promises for each file to stream them asynchronously
		var private_promise = write( path.join( dir, 'ident' ), private_key ),
			public_promise = write( path.join( dir, 'ident.pub' ), public_key );

		// Declare that we're done!
		Promise.all( [ private_promise, public_promise ] ).then( fulfill );
	} );
}

/**
 * Actually load the keys into memory.
 *
 * @return {Promise}
 */
function load_keys() {
	return new Promise( function( fulfill, reject ) {
		var private_promise = read( path.join( dir, 'ident' ) ).then( function( str ) {
			private_key = str;
		} );

		var public_promise = read( path.join( dir, 'ident.pub' ) ).then( function( str ) {
			public_key = str;
		} );

		// Delcare that we're done!
		Promise.all( [ private_promise, public_promise ] ).then( fulfill );
	} );
}

/**
 * Export the module entrypoints.
 */
module.exports = {
	init: detect_keys,
	'public': function() { return public_key; },
	'private': function() { return private_key; },
	friends: function() { return friend_keys; }
};