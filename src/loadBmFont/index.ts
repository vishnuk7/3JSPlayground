//@ts-nocheck

// var fs = require('fs');
import fs from 'fs';
import url from 'url';
import path from 'path';
import phin from 'phin';
import parseASCII from 'parse-bmfont-ascii';
import parseXML from 'parse-bmfont-xml';
import readBinary from 'parse-bmfont-binary';
import mime from 'mime';
var noop = function () {};
import isBinary from './lib/is-binary';

function parseFont(file, data, cb) {
	var result, binary;

	if (isBinary(data)) {
		if (typeof data === 'string') data = Buffer.from(data, 'binary');
		binary = true;
	} else data = data.toString().trim();

	try {
		if (binary) result = readBinary(data);
		else if (/json/.test(mime.lookup(file)) || data.charAt(0) === '{') result = JSON.parse(data);
		else if (/xml/.test(mime.lookup(file)) || data.charAt(0) === '<') result = parseXML(data);
		else result = parseASCII(data);
	} catch (e) {
		cb(e);
		cb = noop;
	}

	cb(null, result);
}

export const loadFont = function loadFont(opt, cb) {
	cb = typeof cb === 'function' ? cb : noop;

	if (typeof opt === 'string') opt = { uri: opt, url: opt };
	else if (!opt) opt = {};

	var file = opt.uri || opt.url;

	function handleData(err, data) {
		if (err) return cb(err);
		parseFont(file, data.body || data, cb);
	}

	if (url.parse(file).host) {
		request(opt, handleData);
	} else {
		fs.readFile(file, opt, handleData);
	}
};
