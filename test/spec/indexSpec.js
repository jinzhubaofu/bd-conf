/**
 * @file 测试用例
 * @author leon<ludafa@kavout.com>
 */

const BDConf = require('../../src/index.js');
const parse = BDConf.parse;

describe('bd configure', function () {

    it('error format', function () {

        expect(function () {
            parse();
        }).toThrow();

        expect(function () {

            parse(
`
ahahaha
`
            );

        }).toThrow();

        expect(function () {

            parse(
`
[.a.b]
`
            );

        }).toThrow();

    });

    it('basic', function () {

        const result = parse(
`
name: 1
@a: 2
@a: 3
@b: 4
@b: 5
#COMMENT
`
        );

        expect(result).toEqual({
            name: '1',
            a: ['2', '3'],
            b: ['4', '5']
        });

    });

    it('string value', function () {

        const result = parse(
`
name: "this is a string"
`
        );

        expect(result).toEqual({
            name: 'this is a string'
        });

    });

    it('GLOBAL', function () {

        const result = parse(
`
@name: 1
[GLOBAL]
@name: 2
`
        );

        expect(result).toEqual({
            name: ['1', '2']
        });

    });

    it('object group', function () {

        const result = parse(
`
[test]
name: 1
@a: 2
@a: 3
@b: 4
@b: 5
`
        );

        expect(result).toEqual({
            test: {
                name: '1',
                a: ['2', '3'],
                b: ['4', '5']
            }
        });

    });

    it('array group', function () {

        const result = parse(
`
[@test]
name: 1
[@test]
name: 1
`
        );

        expect(result).toEqual({
            test: [{
                name: '1'
            }, {
                name: '1'
            }]
        });

    });

    it('nested group', function () {

        const result = parse(
`
[a1]
[.b]
[.c]
[a2]
[.b]
[.c]
`
        );

        expect(result).toEqual({
            a1: {b: {}, c: {}},
            a2: {b: {}, c: {}}
        });

    });

    it('absolute group', function () {

        const result = parse(
`
[a]
[a.b]
[a.b.c]
`
        );

        expect(result).toEqual({
            a: {b: {c: {}}}
        });

        expect(function () {

            parse(
`
[a]
[a.b.c]
`);

        }).toThrow();

        expect(function () {

            parse(
`
[..a]
`);

        }).toThrow();

    });

    it('array group', function () {

        const result = parse(
`
[@a]
name: 1
[@a]
name: 2

[b]
[.@datasource]
name: 1
value: 1

`
        );

        expect(result).toEqual({
            a: [{
                name: '1'
            }, {
                name: '2'
            }],
            b: {
                datasource: [{
                    name: '1',
                    value: '1'
                }]
            }
        });

    });

    it('complex', function () {

        const result = parse(
`
[a]
[a.b]
[.conf]
name: 1

[a.b.c]
@name: 1
@name: 2
[..d]
@name: d
`
        );

        expect(result).toEqual({
            a: {
                b: {
                    c: {
                        name: ['1', '2']
                    },
                    d: {
                        name: ['d']
                    }
                },
                conf: {
                    name: '1'
                }
            }
        });

    });


});
