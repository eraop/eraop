var express = require("express");
const app = express();
var router = express.Router();
var bodyParser = require("body-parser");
//获取JSON解析器中间件
var jsonParser = bodyParser.json();
//url-encoded解析器
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

var redis_client = require("../redis.js");

var admin_user = require("../admin/user.js");
var admin_role = require("../admin/role.js");
var CommonModels = require("../models/CommonModels.js");
var LoginUser = require("../models/LoginUser.js");
var tokenUtil = require("../auth/token.js");
router.post("/login", jsonParser, function(req, res, next) {
  var rm = new CommonModels.ReturnModel();
  admin_user.findOne(req.body.name, req.body.password, function(data) {
    var user = data;
    if (user) {
      rm.code = 0;
      rm.msg = "登录成功";
      var token = tokenUtil.createToken(user.username);
      // var sid = req.sessionID;

      req.session.username = user.username;
      req.session.useravatar = user.avatar;
      req.session.token = token;
      req.session.userid = user.id;

      // 获取角色
      admin_role
        .findRolesByUserId(user.id)
        .then(data => {
          var roles = "";
          data.forEach(element => {
            roles += (roles === "" ? "" : ",") + element.name;
          });
          req.session.roles = roles;
          rm.data = {
            username: user.username,
            useravatar: user.avatar,
            userroles: roles,
            token: token
            // sid: sid
          };
          // 存储redis
          // redis_client.set(sid + ":username", user.username);
          res.json(rm);
        })
        .catch(err => {
          console.log(err);
          rm.code = -1;
          rm.msg = "用户权限异常，请联系管理员";
          res.json(rm);
        });
    } else {
      rm.code = 1;
      rm.msg = "账号或密码错误";
      res.json(rm);
    }
  });
});
router.get("/refresh_token", function(req, res) {
  var token = req.headers["x-access-token"];
  // verify the existing token
  var rm = new CommonModels.ReturnModel();

  tokenUtil
    .decodedToken(token)
    .then(res => {
      // check if the user still exists or if authorization hasn't been revoked
      var LoginUser = req.session.LoginUser;
      var valid = LoginUser && LoginUser.username === token;
      if (LoginUser && LoginUser.username === res.username) {
        var refreshed_token = tokenUtil.createToken(LoginUser.username);
        rm.code = 200;
        rm.msg = "token信息更新";
        rm.data = {
          token: refreshed_token
        };
        res.json(rm);
      } else {
        rm.code = 401;
        rm.msg = "token信息错误";
        return res.json(rm);
      }
    })
    .catch(err => {
      rm.code = 401;
      rm.msg = "token信息错误";
      res.json(rm);
    });

  // // if more than 14 days old, force login
  // if (profile.iat - new Date() > 14) {
  //   // iat == issued at
  //   return res.send(401); // re-logging
  // }
});
module.exports = router;