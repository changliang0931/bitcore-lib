'use strict';

var bitcore = require('../index');
var async = require('async');
var HDPublicKey = bitcore.HDPublicKey;
var Address = bitcore.Address;
var Networks = bitcore.Networks;
var bech32 = require('bech32');
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
var xpub = "";
deriveAddressByxpubAccount(xpub, 0, 2, 0, function () {
});
var ypub = "";
deriveAddressByypubAccount(ypub, 0, 2, 0, function () {
});
var zpub = "";
deriveAddressByzpubAccount(zpub, 0, 2, 0, function () {
});