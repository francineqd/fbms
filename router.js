/*
   路由模块
*/
const express = require('express');
const router = express.Router();
const contentController = require("./controllers/content");

// 内容管理
router.get('/contents',contentController.allContents)// 提供所有内容信息
    .get('/contents/content/:id',contentController.getContentById)// 编辑内容时根据id查询相应信息 localhost:3000/books/book/5
    .put("/contents/content",contentController.editContent)// 提交编辑后的数据
    .delete("/contents/content/:id",contentController.deleteContent)// 删除内容
    .post("/contents/content",contentController.addContent);//添加内容

module.exports = router;
