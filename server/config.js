// var pool = mysql.createPool({
//   host: "192.168.33.200",
//   user: "root",
//   password: "zxsoft0#",
//   port: "3306",
//   database: "wf"
// });
const session_expires_in = 60 * 30; //session过期时间 秒
const token_expires_in = 60 * 60; //token过期时间 秒
exports.database = {
  host: "localhost",
  user: "root",
  password: "123456",
  port: "3306",
  database: "wf_vue"
};
// redis 配置
exports.redis_options = {
  host: "127.0.0.1",
  port: "6379",
  ttl: session_expires_in
};
exports.secret_key = "eraop";
exports.token_expires_in = token_expires_in;
exports.session_expires_in = session_expires_in;