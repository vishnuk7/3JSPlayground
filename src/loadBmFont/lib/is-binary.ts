// @ts-nocheck
import equal from 'buffer-equal';
import BF from 'buffer';

var HEADER = BF.Buffer.from([66, 77, 70, 3]);

const fn = function (buf) {
	if (typeof buf === 'string') return buf.substring(0, 3) === 'BMF';
	return buf.length > 4 && equal(buf.slice(0, 4), HEADER);
};

export default fn;
