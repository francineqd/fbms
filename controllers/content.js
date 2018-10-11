/*
  内容-业务模块
 */
const db = require("../models/db");
const moment = require("moment");//日期格式化

// 获取所有的内容
exports.allContents = (req,res)=>{
    let sql = "select * from content";
    let data = null;
    db.base(sql,data,(result)=>{
        res.json(result);//[{"id":1,"title":"nimen","content":"women","creat_time":null,"modify_time":null,"user_id":null},...]
    });  
} 

//编辑内容时根据id查询相应信息
exports.getContentById = (req,res)=>{
    //得到id
    let id = req.params.id;
    let sql = "select * from content where id=?";
    let data = [id];
    db.base(sql,data,(result)=>{
        res.json(result[0]);
    });
}

//提交编辑后的内容
exports.editContent = (req,res)=>{
    let info = req.body;
    let sql = "update content set title=?,content=?,creat_time=?,modify_time=?,user_id=? where id=?";
    let data = [info.title,info.content,moment().format(),moment().format(),info.user_id,info.id];
    db.base(sql,data,(result)=>{
        if(result.affectedRows == 1) {
            res.json({bool:1});
        } else {
            res.json({bool:-1});
        }
    });
};

//删除内容
exports.deleteContent = (req,res)=>{
    let id = req.params.id;
    let sql = "delete from content where id=?";
    let data = [id];
    db.base(sql,data,(result)=>{
        if(result.affectedRows == 1) {
            res.json({bool:1});
        } else {
            res.json({bool:-1});
        }
    });
};

//添加内容
exports.addContent = (req,res)=>{
    let info = req.body;// {name:"...",}
    info.creat_time = moment().format();
    info.modify_time = moment().format();
    let sql = "insert into content set?";
    let data = info;
    db.base(sql,data,(result)=>{
        if(result.affectedRows == 1) {
            res.json({bool:1});
        } else {
            res.json({bool:-1});
        }
    });
};
