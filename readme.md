# bd conf

[![Build Status](https://travis-ci.org/jinzhubaofu/bd-conf.svg?branch=master)](https://travis-ci.org/jinzhubaofu/bd-conf)
[![Coverage Status](https://coveralls.io/repos/github/jinzhubaofu/bd-conf/badge.svg?branch=master)](https://coveralls.io/github/jinzhubaofu/bd-conf?branch=master)

a parser for bd conf

## requirement

nodejs >= 4

## setup

```sh
npm install --save bd-conf
```

## usage

```js

const BDConf = require('bd-conf');

const confText = `
#COMMENT

name: 1

[data]
name: data

`;

const conf = BDConf.parse(confText);

try {
    BDConf.parse('this will throw');
}
catch (error) {

}

```
