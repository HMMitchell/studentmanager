// 引入mongodb模块
const MongoClient = require('mongodb').MongoClient;
// 连接数据库
const url = 'mongodb://localhost:27017';
// 连接数据库表单
const dbName = 'test';

module.exports = {
    // 提示用户
    /**
     * 
     * @param {*} res 请求
     * @param {*} mes 提示信息
     * @param {*} url 地址
     */
    message(res, mes, url) {
        res.send(`<script>alert('${mes}');window.location='${url}'</script>`)
    },
    // 查询的方法 
    /**
     * 
     * @param {*} collectionName 查询的库
     * @param {*} query 要查询的内容 对象
     * @param {*} callback 回调函数 增删改查 操作完毕之后把结果返回给控制器
     */
    find(collectionName, query, callback) {
        // console.log(req.body);
        MongoClient.connect(url, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);

            const collection = db.collection(collectionName);
            // 查询逻辑
            collection.find(query).toArray(function (err, docs) {
                // client.close();
                callback(err, docs);
            });

        });
    },

    // 增加的方法 
    /**
     * 
     * @param {*} collectionName 查询的库
     * @param {*} add 要增加的内容 对象
     * @param {*} callback 回调函数 增删改查 操作完毕之后把结果返回给控制器
     */
    insert(collectionName, add, callback) {
        // console.log(req.body);
        MongoClient.connect(url, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 操作某个库
            const collection = db.collection(collectionName);
            // 增加逻辑 增加一个
            collection.insertOne(add, function (err, result) {
                client.close();
                callback(err, result);
            });

        });
    },

    // 更改的方法 
    /**
     * 
     * @param {*} collectionName 查询的库
     * @param {*} condition 要修改的值 对象
     * @param {*} params 修改成的值 对象
     * @param {*} callback 回调函数 增删改查 操作完毕之后把结果返回给控制器
     */
    updateOne(collectionName, condition, params, callback) {
        // console.log(req.body);
        MongoClient.connect(url, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 操作某个库
            const collection = db.collection(collectionName);
            // 修改一个
            collection.updateOne(condition, {
                $set: params
            }, function (err, result) {
                client.close();
                callback(result);
            });

        });
    },
    // 删除的方法 
    /**
     * 
     * @param {*} collectionName 查询的库
     * @param {*} del 要删除的值 对象
     * @param {*} callback 回调函数 增删改查 操作完毕之后把结果返回给控制器
     */
    
    delete(collectionName, del, callback) {
        // console.log(req.body);
        MongoClient.connect(url, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 操作某个库
            const collection = db.collection(collectionName);
            // 删除一个
            collection.deleteOne(del, function (err, result) {
                client.close();          
                callback(result);
            });

        });
    },
}