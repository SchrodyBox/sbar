/*!
 * sbar
 *
 * Eric Mann <eric@eamann.com>
 *
 * MIT License
 */

'use strict';

/**
 * Module requirements
 */
var Keys = require( './keyfiles' );

/**
 * List the contents of an sbar package.
 *
 * @param {string} archive
 */
function listPackage( archive ) {
	Keys.init();
}

module.exports = {
	listPackage: listPackage
};