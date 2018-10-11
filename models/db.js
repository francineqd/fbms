/*
  封装操作数据库的通用api
*/
// 加载数据库驱动
// 更新数据
var mysql = require('mysql');

exports.base = (sql,data,callback)=>{
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'fbms'
      });
      
      // 执行连接数据库
      connection.connect();
      // 操作数据库
      connection.query(sql, data, function(error, results, fields) {
        if (error) throw error;
        callback(results);
      });
      
      // 关闭数据库
      connection.end();      
}