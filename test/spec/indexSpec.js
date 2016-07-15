/**
 * @file bd-configure index spec
 * @author leon <lupengyu@baidu.com>
 */

const conf = require('../../src/index.js');

describe('BDConf', function () {

    it('`parse` is a function', function () {
        expect(conf.parse).toEqual(jasmine.any(Function));
    });

});
