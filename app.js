var express = require('express');
// 使用第三方插件 验证码
var svgCaptcha = require('svg-captcha');
let path = require("path");
// 引入express-session中间件
let session = require("express-session");
// 引入body-parser格式化表单数据
let bodyParser = require("body-parser");

// 引入自己封装好的tools模块
let myTool = require(path.join(__dirname, "tools/myTools"));

let indexRouter = require(path.join(__dirname, "route/indexRouter"));
// 创建app
var app = express();

// app.use('/index', indexRouter);

app.use(express.static('static'));
// 保存到 session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// 格式化post表单传过来的数据
app.use(bodyParser.urlencoded({
    extended: false
}));
// 首页读取数据的逻辑
// 全部放在挂在路由中
app.use('/index', indexRouter);
// 导入template模板引擎
app.engine('html', require('express-art-template'));


app.set('views', '/static/views')
// 路由1
// get方法 读取登录页
app.get('/login', function (req, res) {
    // res.send('you come');
    res.sendFile(path.join(__dirname, "static/views/login.html"))
    // console.log(req.session);
});
// 路由2
// post 验证登录
app.post('/login', (req, res) => {
    let userName = req.body.userName
    let userPass = req.body.userPass
    if (req.session.captcha == req.body.code) {
        // 验证码正确
        myTool.find('userList', {
            userName,
            userPass
        }, (err, docs) => {
            if (!err) {
                if (docs.length == 1) {
                    // 说明密码用户名正确
                    // 设置session
                    req.session.userinfo = {
                        userName
                    }
                    myTool.message(res, '欢迎进入学生管理系统', '/index');
                } else {
                    myTool.message(res, '用户名或密码错误', '/login');
                }
            };
        });
    } else {
        myTool.message(res, '验证码错误', '/login');
    }

    // res.send('过来了')
    // console.log(req.body);
    // console.log(res);
    // MongoClient.connect(url, function (err, client) {
    //     const db = client.db(dbName);
    //     const collection = db.collection('userList');
    //     collection.find({
    //         userName: req.body.userName,
    //         userPass: req.body.userPass,
    //     }).toArray(function (err, docs) {
    //         console.log(docs);
    //         if (docs.length != 0) {
    //             if (req.session.captcha == req.body.code) {
    //                 // 验证码正确
    //                 // 设置session
    //                 req.session.userinfo = {
    //                     userName: req.body.userName,
    //                     userPass: req.body.userPass,
    //                     code: req.body.code
    //                 }
    //                 res.redirect("/index");
    //             } else {
    //                 res.send("<script>alert('验证码错误');window.location='/login'</script>")
    //             }
    //         } else {
    //             res.send("<script>alert('用户名或密码错误');window.location='/login'</script>")
    //         }
    //         // client.close();
    //     });
    // });
});
// 路由3
// 验证码 
app.get('/login/captchaImg', function (req, res) {
    // 随机产生字母
    var captcha = svgCaptcha.create({
        background: '#cc9966'
    });

    // 随机产生加减法运算
    // var captcha=svgCaptcha.createMathExpr({
    //     background:'#cc9966'
    // })
    // toLocaleLowerCase()转换小写
    req.session.captcha = captcha.text.toLocaleLowerCase();
    // console.log(captcha.text);
    res.type('svg');
    res.status(200).send(captcha.data);
});
// // 路由4
// // 读取首页并访问
// app.get('/index', (req, res) => {
//     // res.send('过来了')
//     //    console.log(req);
//     //    console.log(res);
//     // session有值就说明登录了
//     if (req.session.userinfo) {
//         res.sendfile(path.join(__dirname, "static/views/index.html"))
//     } else {
//         res.send("<script>alert('请先登录');window.location='/login'</script>")
//     }
// });
// 路由5
// 退出登录
app.get('/logout', (req, res) => {
    //    res.send('过来了')
    // 删除session
    delete req.session.userinfo;
    // 返回登录页
    res.redirect("/login")
});
// 路由6
// 跳转注册页
app.get('/register', (req, res) => {
    //    res.send('过来了')
    // 读取并返回注册页
    res.sendFile(path.join(__dirname, "static/views/register.html"))
});

// 路由7
// 注册用户
app.post('/register', (req, res) => {
    // res.send('过来了')
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // console.log(req.body);
    myTool.find('userList', {
        userName
    }, (err, docs) => {
        //   console.log(docs);
        if (docs.length == 0) {
            // 说明没人注册
            // 可以新增
            myTool.insert('userList', {
                userName,
                userPass
            }, (err, result) => {
                myTool.message(res, '注册成功', '/login');
            })
        } else {
            myTool.message(res, '用户名已存在', '/register');
        }
    })

    // MongoClient.connect(url, function (err, client) {
    //     const db = client.db(dbName);
    //     const collection = db.collection('userList');
    //     collection.find({
    //         userName
    //     }).toArray(function (err, docs) {
    //         // console.log(docs);
    //         if (docs.length == 0) {
    //             // 说明没有人注册
    //             collection.insertOne({
    //                 userName,
    //                 userPass
    //             }, function (err, result) {
    //                 res.send("<script>alert('注册成功');window.location='/login'</script>")
    //             });
    //         } else {
    //             res.send("<script>alert('用户名已存在');window.location='/register'</script>")
    //         }
    //     });
    // });

})
// 开启监听
app.listen(80, '127.0.0.1', function () {
    console.log('监听 success');
});