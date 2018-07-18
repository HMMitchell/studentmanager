// 引入路由中间件
let express = require('express');
let router = express.Router();
let path = require("path");
let myTool = require(path.join(__dirname, "../tools/myTools"))
// id 需要使用 mongoDB.ObjectId 这个方法 进行包装 才可以使用
let objectID = require('mongodb').ObjectId
router.get('/', (req, res) => {
    // res.send('过来了')
    //    console.log(req);
    //    console.log(res);
    // session有值就说明登录了

    if (req.session.userinfo) {
        let userName = req.session.userinfo.userName
        // console.log(userName);
        // res.sendfile(path.join(__dirname, "../static/views/index.html"));
        // 使用模板渲染页面
        res.render(path.join(__dirname, '../static/views/index.html'), {
            userName
        });
    } else {
        myTool.message(res, '请先登录', '/login');
    }
});

// 增删改查的接口----------------------------------------
// 增
router.get('/insert', (req, res) => {
    //    res.send('过来了')
    // console.log(req.query);
    myTool.insert('studentList', req.query, (err, result) => {
        if (!err) res.json({
            mess: '新增成功',
            code: 200
        })
    })
})
// 删
router.get('/delete', (req, res) => {
    // res.send('过来了')
    let deleteId = req.query.id
    myTool.delete('studentList', {
        _id: objectID(deleteId),
    }, (err, result) => {
        if (!err) res.json({
            mess: '删除成功',
            code: 200
        })
    })
})
//  改
router.get('/update', (req, res) => {
    // res.send('过来了')
    // let address = req.query.address;
    // let age = req.query.age;
    // let introduction = req.query.introduction;
    // let name = req.query.name;
    // let phone = req.query.phone;
    // let sex = req.query.sex;
    let name = req.query.name
    myTool.update('studentList', {
        _id: objectID(req.query.id),
    }, {
        name,
    }, (err, result) => {
        if (!err) res.json({
            mess: '修改成功',
            code: 200
        })
    })
});
//  查询全部
router.get('/list', (req, res) => {
    // res.send('过来了')
    myTool.find('studentList', {}, (err, docs) => {
        if (!err) res.json({
            mess: '数据',
            code: 200,
            list: docs
        })
    })
});

// 条件查询
router.get('/search', (req, res) => {
    // 定义查询的对象
    // let query = {};
    // // 用户名过来
    // if (req.query.userName) {
    //     query.name = new RegExp(req.query.userName)
    // }
    // // console.log(query);
    // // id过来
    // if (req.query.id) {
    //     query._id = objectID(req.query.id);
    // }
    // res.send('过来了')
    let name = req.query.userName
    myTool.find('studentList', {
        name: new RegExp(name)
    }, (err, docs) => {
        if (!err) res.json({
            mess: '数据',
            code: 200,
            list: docs
        })
    })
});

module.exports = router