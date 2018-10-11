$(function() {
    initList();
    // 初始化数据列表
    function initList() {
        $.ajax({
            type: "get",
            url: "/contents",
            dataType: "json",
            success: function(data) {
               for(var i=0;i<data.length;i++) {
                   //将utc通用标准时转换成北京时间
                    var date2 = new Date(data[i].creat_time);
                    var localeString = date2.toLocaleString();
                    data[i].creat_time = localeString.slice(0,10);
               }
               
                // 渲染数据列表
                var html = template('indexTpl',{list:data});
                $("#dataList").html(html);

                $("#pageList").html("");
                // 数据分页
                pageInit();

                // 操作DOM
                $("#dataList").find("tr").each(function(index,element) {
                    var td = $(element).find("td:eq(2)");
                    var id = $(element).find("th:eq(0)").data("value");
                    // 绑定编辑图书单击事件
                    td.find("a:eq(0)").click(function() {
                        editContent(id);
                    });
                    td.find("a:eq(1)").click(function() {
                        deleteContent(id);
                    });
                });
                
            }
        });
    }
    
    function editContent(id) {
        var form = $("#editContentForm");
        var user_id = $("#dataList").find("td:eq(0)").text().trim();
        // 根据id查询最新的数据
        $.ajax({
            type: "get",
            url: "/contents/content/"+id,
            dataType: "json",
            success: function(data) {
                // 初始化弹窗
                var mark = new MarkBox(400,300,"编辑内容",form[0]);//转成原生dom对象form.get(0)或form[0]
                mark.init();
                // 填充表单数据
                form.find("input[name=id]").val(data.id);
                form.find("input[name=title]").val(data.title);
                form.find("input[name=content]").val(data.content);
                // 对表单的提交按钮添加单击事件
                form.find("input[type=button]").unbind("click").click(function() {
                    // 编辑完成数据后重新提交表单
                    $.ajax({
                        type:"put",
                        url: "/contents/content",
                        dataType: "json",
                        data: form.serialize()+"&user_id="+user_id,
                        success: function(data) {
                            if(data.bool == 1) {
                                //关闭弹窗
                                mark.close();
                                // 重新渲染数据列表
                                initList();    
                            }
                        }
                    })
                })
            }
        })
    }

    function deleteContent(id) {
        $.ajax({
            type: "delete",
            url: "/contents/content/"+id,
            dataType: "json",
            success: function(data) {
                if(data.bool == 1) {
                    // 重新渲染数据列表
                    initList();
                }  
            }
        })
    }

    function pageInit() {
        var theTable = document.getElementById("dataList");
        // total news count
        var count = theTable.rows.length;
        
        // max count for one page
        var ONE_PAGE_COUNT = 3;
        
        // total pages
        var totalPage = parseInt(count / ONE_PAGE_COUNT) + ((count % ONE_PAGE_COUNT) == 0? 0 : 1);
              
        // init page
        var currPage = 1;

        // function used to set total pages
        function setUIPages(totalPage) {
            var obj = '<li id="prev" class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>'
            for(var i=1;i<=totalPage;i++) {
                obj +='<li><a href="#">'+i+'</a></li>';
                
            }
            obj += '<li id="next"><a href="#"><span aria-hidden="true">&raquo;</span></a></li>';
            $("#pageList").append(obj);
        }

        // update curr page
        function setUICurrPage(currPage) {
            currPage = Math.max(1, currPage);
            $("#pageList").find("li").removeClass("active").eq(currPage).addClass("active");
        }
        
        // 传入显示的page参数，显示对应页面的图书列表，隐藏其他列表
        function scanAllForShow(page) {
        // page at least 1 or max totalPage
        page = Math.max(1, Math.min(totalPage, page));
            for (var i = 0;i < count;i++) {
                if (parseInt(i / ONE_PAGE_COUNT) + 1 == page)
                    $(dataList[i]).attr("style", "");
                else
                    $(dataList[i]).attr("style", "display: none");
            }
        }
        
        function nextPage() {
            var last = currPage;
            if (last == totalPage) {
                $("#pageList").find("li").removeClass("disabled").eq(last+1).addClass("disabled");
                return;
            } else {
                $("#pageList").find("li").removeClass("disabled"); 
            }
             
            scanAllForShow(++currPage);
        
            setUICurrPage(currPage);
        }
        
        function prevPage() {
            var first = currPage;
            if (first == 1) {
                $("#pageList").find("li").removeClass("disabled").eq(0).addClass("disabled");
                return;
            } else {
                $("#pageList").find("li").removeClass("disabled"); 
            }
            
            scanAllForShow(--currPage);
            
            setUICurrPage(currPage);
        }
        
        function goToPage() {
            var lis = $("#pageList").find("li");
            lis.each(function(index,element) {
               $(this).click(function() {
                   if(index>0&&index<totalPage+1) {
                        var target = $(this).find("a").text();
                        if(target == 1) {
                            lis.removeClass("disabled").eq(0).addClass("disabled");
                        } else if(target == totalPage) {
                            console.log(totalPage);
                            lis.removeClass("disabled").eq(target-0+1).addClass("disabled");
                        } else {
                            lis.removeClass("disabled");
                        }
                        currPage = target;
                        scanAllForShow(target);
                        setUICurrPage(currPage);
                   }
               })
            });
        }
        
        // 页面加载完成后调用此函数
        function pageList() {
            dataList = $("#dataList").children();
            count = dataList.length;
            totalPage = parseInt(count / ONE_PAGE_COUNT) + ((count % ONE_PAGE_COUNT) == 0? 0 : 1);
            currPage = 1;
            setUIPages(totalPage);
            setUICurrPage(currPage);
            scanAllForShow(currPage);
            // 注册点击函数
            $("#pageList").on("click","#prev",prevPage);
            $("#pageList").on("click","#next",nextPage);
            // 点击相应页面进行跳转
            goToPage();
        }

        pageList();       
    }
});