"use strict";
var mysql = require("mysql");
var config = require("./config.js");

var pool = mysql.createPool(config.database);
function query(sql, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    // Use the connection
    connection.query(sql, function(err, rows) {
      callback(err, rows);
      connection.release(); //释放链接
    });
  });
}

function query(sql, queryString, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    // Use the connection
    connection.query(sql, queryString, function(err, rows) {
      callback(err, rows);
      connection.release(); //释放链接
    });
  });
}
exports.query = query;
