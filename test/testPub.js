'use strict';
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var bitcore = require('..');
var async = require('async');
var HDPublicKey = bitcore.HDPublicKey;
var Address = bitcore.Address;
var Networks = bitcore.Networks;
describe('deriveAddressByAccount', function() {
  var xpub = "xpub6BgST3rEwmcjwe8cHxm8Z9cGcmTAJ5faVbu3JjD3tRkp49uN8RVpi1HRYrhzRcoXBdNRxgbxy4t3mE7Qo86Fcr57XWfdujhf822dL3yiq3p";
  it('xpub: '+xpub+ ' \n deriveChild \n m\/44\'\/0\'\/0\'\/0\/0	12eENMysYzSqJVKP1xH6BERLio1hjobngY \n m\/44\'\/0\'\/0\'\/0\/1	1G28pJ967FkJhtznE163SK8yFAFsS2MpHJ', function() {
    var xresults;
    //m/44'/0'/0'/0/0	12eENMysYzSqJVKP1xH6BERLio1hjobngY
    //m/44'/0'/0'/0/1	1G28pJ967FkJhtznE163SK8yFAFsS2MpHJ
    deriveAddressByxpubAccount(xpub, 0, 2, 0, function (err,child) {
      xresults= child;
    });
    expect(xresults[0].address).to.equal('12eENMysYzSqJVKP1xH6BERLio1hjobngY','xpub error');
    expect(xresults[1].address).to.equal('1G28pJ967FkJhtznE163SK8yFAFsS2MpHJ','xpub error');
  });


  var ypub = "ypub6XExBxCDSHCpNF1Anpo97o57wz76fu6eqZFmcWCf2TKMYXyZ2S2Zt47xi4A89yjawNLWfzKQSQNQmfsDLL2CgaRY9p7PuFYBdSo9Z4K7GQq";
  it('ypub: '+ypub+ '\n deriveChild \n m\/49\'\/0\'\/0\'\/0\/0	39nymRHzhPfw3SLwMZBRNxpFaeRirj9GUq \n m\/49\'\/0\'\/0\'\/0\/1	3LhwrAAm7E9zYXQJQM9cApv48YLYziZZaB', function() {
    //m/49'/0'/0'/0/0	39nymRHzhPfw3SLwMZBRNxpFaeRirj9GUq
    //m/49'/0'/0'/0/1	3LhwrAAm7E9zYXQJQM9cApv48YLYziZZaB
    var yresults;
    deriveAddressByypubAccount(ypub, 0, 2, 0, function (err,child) {
      yresults= child;
    });
    expect(yresults[0].address).to.equal('39nymRHzhPfw3SLwMZBRNxpFaeRirj9GUq','ypub error');
    // expect(yresults).to.include({address:'3LhwrAAm7E9zYXQJQM9cApv48YLYziZZaB'},);
  });

  var zpub = "zpub6r45L5aNdPMUpfdhpoBFvjjfaDSfQTcopJveBDzQmMGNfRW8dJdTYZDBmctH7y9F3N5Tajk8Z2xhdMYMwXKqWrzon9hVzXJ3GbrgP7Gqy26";
  it('zpub: '+zpub+ '\n deriveChild \n m\/84\'\/0\'\/0\'\/0\/0	bc1q4swj9y83ed7jgf3ytc97wqs4zd4d907fmmy5gw \n m\/84\'\/0\'\/0\'\/0\/1	bc1qlygc98e8v64nffc7klek3qnql5kqrq6scuxrwp', function() {
    //m/84'/0'/0'/0/0	bc1q4swj9y83ed7jgf3ytc97wqs4zd4d907fmmy5gw	
    //m/84'/0'/0'/0/1	bc1qlygc98e8v64nffc7klek3qnql5kqrq6scuxrwp
    var zresults;
    deriveAddressByzpubAccount(zpub, 0, 2, 0, function (err,child) {
      zresults= child;
    });
    expect(zresults[0].address).to.equal('bc1q4swj9y83ed7jgf3ytc97wqs4zd4d907fmmy5gw','zpub error');
    expect(zresults[1].address).to.equal('bc1qlygc98e8v64nffc7klek3qnql5kqrq6scuxrwp','zpub error');
  });
});
//https://iancoleman.io/bip39/
/**
 * @description 根据xpub及地址index派生新change地址
 * @param {String} account 账户
 * @param {Number} index   派生索引
 * @param {Number} number  派生数量
 * @param {Number} change  地址类型 0|1
 * @param {Array}  callback 
 */
// xpub P2PKH or P2SH	m/44'/0'  
var deriveAddressByxpubAccount = function (account, index, number, change, callback) {
  var results = [];
  try {
    var hdPublicKey = new HDPublicKey(account);
    async.timesSeries(number, function (n, next) {
      var child = hdPublicKey.deriveChild(change).deriveChild(index);
      var address = new Address(child.publicKey, Networks.livenet);
      results.push({ address: address.toString(), index: index, account: account, change: change });
      // console.log({ address: address.toString(), index: index, account: account, change: change });
      index = index + 1;
      next(null);
    }, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  } catch (error) {
    return callback(error);
  }
};
/**
 * @description 根据ypub及地址index派生新change地址
 * @param {String} account 账户
 * @param {Number} index   派生索引
 * @param {Number} number  派生数量
 * @param {Number} change  地址类型 0|1
 * @param {Array}  callback 
 */
// ypub P2WPKH in P2SH	m/49'/0' 
var deriveAddressByypubAccount = function (account, index, number, change, callback) {
  var results = [];
  try {
    var hdPublicKey = new HDPublicKey(account);
    async.timesSeries(number, function (n, next) {
      var child = hdPublicKey.deriveChild(change).deriveChild(index);
      var address = new Address(child.publicKey, Networks.ylivenet, Address.P2SH_P2WPKH);
      results.push({ address: address.toString(), index: index, account: account, change: change });
      console.log({ address: address.toString(), index: index, account: account, change: change });
      index = index + 1;
      next(null);
    }, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  } catch (error) {
    return callback(error);
  }
};
/**
 * @description 根据zpub及地址index派生新change地址
 * @param {String} account 账户
 * @param {Number} index   派生索引
 * @param {Number} number  派生数量
 * @param {Number} change  地址类型 0|1
 * @param {Array}  callback 
 */
// zpub  P2WPKH	m/84'/0' 可以啦
var deriveAddressByzpubAccount = function (account, index, number, change, callback) {
  var results = [];
  try {
    var hdPublicKey = new HDPublicKey(account);
    async.timesSeries(number, function (n, next) {
      var child = hdPublicKey.deriveChild(change).deriveChild(index);
      var address = new Address(child.publicKey, Networks.get("zlivenet"), Address.P2WPKH);
      results.push({ address: address.toString(), index: index, account: account, change: change });
      console.log({ address: address.toString(), index: index, account: account, change: change });
      index = index + 1;
      next(null);
    }, function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  } catch (error) {

    return callback(error);
  }
};