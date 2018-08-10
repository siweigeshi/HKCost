Ext.define('ExtFrame.view.main.cms.articleManager.ArticleManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.articleManager',
    onClickSearch: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var gridSearchToolbar = pnGrid.getDockedItems('gridsearchtoolbar')[0];//获取gridSearchbar搜索栏
        var fileds = gridSearchToolbar.down('#lastComboID').getValue();//获取搜索字段
        var value = gridSearchToolbar.down('#lastSearchField').getValue();//获取搜索关键字
        var Category = gridSearchToolbar.down('#CategoryPicker').getValue();//获取搜索关键字
        var swhere = '';
        if (Category != '') {
            swhere += 'ArticleCategoryOID|string|' + Category + '|=,';
        }
        if (value != '') {
            if (gridSearchToolbar.searchEx) {
                swhere = Tools.Method.StrFormat(fileds, [value]);//拼接查询where字句
            } else {
                swhere = fileds + "|" + value;
            }
        }
        //带附加参数重构grid store数据
        pnGrid.store.getProxy().extraParams = {
            "swhere": swhere,
        };
        //重新加载grid
        pnGrid.store.reload();
    },
    onClickButtonLook: function () {
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getSelection();;//获取grid选中行records
        //仅能选择一项数据
        if (Tools.Method.IsEditData(selectRecords)) {
            var storeData = null;
            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/Article/GetAttachList?ct=json&ArticleOID=' + selectRecords[0].data.OID + '',
                'GET', null, true, function (jsonData) {
                    storeData = jsonData;
                });
            var tabTitle = '查看文章';//获取菜单名称
            var tabId = 'tab-ArticleTabPanle';//获取菜单id
            var pnCenter = Ext.getCmp('main-tabpanel');//获取主页面tabpanel对象
            var newTab = pnCenter.down('#' + tabId);
            var CommentsArray = selectRecords[0].data.ArticleComments;
            //重新构造评论data
            var CommentList = new Array();
            var Reply = new Array();
            for (var i = 0; i < CommentsArray.length; i++) {
                var comment = CommentsArray[i];
                if (CommentsArray[i].ParentOID == undefined || CommentsArray[i].ParentOID == null || CommentsArray[i].ParentOID == '') {
                    for (var j = 0; j < CommentsArray.length; j++) {
                        if (CommentsArray[j].ParentOID == comment.OID) {
                            Reply.push(CommentsArray[j]);
                        }
                    }
                    comment.Reply = Reply;
                    CommentList.push(comment);
                }
            }
            if (!newTab) {
                newTab = pnCenter.add({
                    region: "center",
                    layout: 'fit',
                    id: tabId,
                    itemId: tabId,
                    title: tabTitle,
                    closable: true,
                    closeAction: 'destroy',
                    items: [Ext.create('ExtFrame.view.main.cms.articleManager.ArticleTabPanle', {
                        type: 'fit', itemId: tabId + '-panel',
                        ArticleOID: selectRecords[0].data.OID,
                        AttachData: selectRecords[0].data.ArticleAttachs,
                        CommentData: CommentList
                    })] //id: tabId + '-grid'
                });
                pnCenter.setActiveTab(newTab);
            } else {//如果tab中存在，那么就直接将节点指向这个页面
                pnCenter.setActiveTab(newTab);
            }

            Ext.getCmp('tab-ArticleTabPanle').down('#ArticleTabForm').down('#txtCallIndex').ArticleOID = selectRecords[0].data.OID;
            Ext.getCmp('tab-ArticleTabPanle').down('#ArticleTabForm').getForm().loadRecord(selectRecords[0]);
            window.timer = setTimeout(function () {
                Ext.getCmp('tab-ArticleTabPanle').down('#ArticleContentForm').down('#txtUeditor').setValue(selectRecords[0].data.ArticleContent);
            }, 1000);
        }
    },
    onClickButtonAdd: function () {
        var tabTitle = '新增文章';//获取菜单名称
        var tabId = 'tab-ArticleTabPanle';//获取菜单id
        var pnCenter = Ext.getCmp('main-tabpanel');//获取主页面tabpanel对象
        var newTab = pnCenter.down('#' + tabId);
        if (!newTab) {
            newTab = pnCenter.add({
                region: "center",
                layout: 'fit',
                id: tabId,
                itemId: tabId,
                title: tabTitle,
                closable: true,
                closeAction: 'destroy',
                items: [Ext.create('ExtFrame.view.main.cms.articleManager.ArticleTabPanle', { type: 'fit', itemId: tabId + '-panel' })] //id: tabId + '-grid'
            });
            pnCenter.setActiveTab(newTab);
        } else {//如果tab中存在，那么就直接将节点指向这个页面
            pnCenter.setActiveTab(newTab);
        }
        var view = Ext.getCmp('tab-ArticleTabPanle');
        view.down('#ArticleTabForm').getForm().reset();
        //view.getViewModel().getData().rec = null;
        var contentForm = view.down('#ArticleContentForm');
        window.timer = setTimeout(function () {
            view.down('#ArticleContentForm').down('#txtUeditor').setValue('');
        }, 1000);
    },
    onClickButtonDel: function () {
        if (!Tools.Method.IsLogin())
            return;
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/Article/Delete?ct=json';
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var selectRows = pnGrid.getSelectionModel().getSelection();//获取grid选中行
        //至少选择一项数据
        if (Tools.Method.IsEditData(selectRows)) {
            var delOIDs = new Array(0);
            $.each(selectRows, function (index, row) {
                delOIDs.push(row.data.OID);
            })
            var data = { PostData: Ext.encode(delOIDs) };
            //用户确认删除操作
            Ext.MessageBox.confirm('提醒', '确定要删除选中行', function (btn) {
                if (btn == 'yes') {
                    Tools.Method.ExtAjaxRequestEncap(ActionDelete, 'POST', data, true, function (jsonData) {
                        if (jsonData.result) {
                            Tools.Method.ShowTipsMsg(Tools.Method.StrFormat(Tools.Msg.MSG00141, [jsonData.succount, jsonData.errorcount]), '4000', '1', null);
                            pnGrid.store.reload();
                        }
                        else {
                            Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                        }
                    });
                }
            });
        }
    },
    onClickButtonSave: function () {
        if (!Tools.Method.IsLogin())
            return;
        var ActionEdit = Tools.Method.getAPiRootPath() + '/api/Article/PostSave?ct=json';
        var view = this.getView();
        var form = view.down('#ArticleTabForm');
        if (form.isValid()) {
            var record = view.getViewModel().getData().rec;
            //record.CreateTime = new Date();
            //record.EditTime = new Date();
            record.IsHot = record.IsHot ? 1 : 0;
            record.IsTop = record.IsTop ? 1 : 0;
            record.IsRecommend = record.IsRecommend ? 1 : 0;
            record.IsReply = record.IsReply ? 1 : 0;
            var contentForm = view.down('#ArticleContentForm');
            record.ArticleContent = contentForm.down('#txtUeditor').ueditorInstance.body.innerHTML;
            if (record.ArticleContent == '' || record.ArticleContent == null) {
                Tools.Method.ShowTipsMsg('请填写文章内容', '4000', '3', null);
                return;
            }
            var pnGrid = Ext.getCmp('ArticleManageGrid');
            var AttachGrid = Ext.getCmp('AttachGrid');
            var AttachStore = AttachGrid.store.getData();
            var AttachList = [];
            AttachStore.each(function (record) {
                AttachList.push(record.data);
            });
            record.ArticleAttachs = AttachList;
            var data = Tools.Method.GetPostData(Ext.encode(record));
            Ext.MessageBox.show({
                msg: '正在进行保存操作',
                progressText: '保存中...',
                width: 300,
                wait: {
                    interval: 200
                }
            });
            var t = setTimeout(function () {
                Ext.MessageBox.hide();
                Ext.MessageBox.alert('警告', '操作超时，请重试', this.showResult, this);
            }, 30000);
            Tools.Method.ExtAjaxRequestEncap(ActionEdit, 'POST', data, true, function (jsonData) {
                if (jsonData) {
                    Ext.MessageBox.hide();
                    clearTimeout(t);
                    view.down('#ArticleTabForm').getForm().reset();
                    view.getViewModel().getData().rec = null;
                    view.down('#ArticleContentForm').down('#txtUeditor').setValue('');
                    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                    pnGrid.store.reload();
                    var pnCenter = Ext.getCmp('tab-ArticleTabPanle');//获取主页面tabpanel对象
                    pnCenter.close();
                } else {
                    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);//修改失败
                }
            });
        }
    },
    onClickUpload: function () {
        var ArticleOID = Ext.getCmp('tab-ArticleTabPanle').down('#btnUpload').ArticleOID;
        Ext.create('ExtFrame.view.extEncap.FileUpload', {
            PlUploadOpts: {
                uniqueNames: true, //当值为true时会为每个上传的文件生成一个唯一的文件名
                fileCount: 10,//允许上传文件个数
                path: 'UpLoad', //上传路径，从应用程序根目录写起，前后不带'/'。
                mimeType: [{ title: "所有文件", extensions: "*" }], //定上传文件的类型 例如：[{ title: "Image files", extensions: "jpg,gif,png" }]
                maxFileSize: '512mb', //限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
                preventDuplicates: true, //不允许选取重复文件
                officeConvert: false//是否在线转换，默认为false。目前仅支持word文档转html，excel文档转html
            },
            returnFun: function (data) {
                if (data.length > 0) {
                    var attachList = [];
                    for (var i = 0; i < data.length; i++) {
                        var attach = {};
                        attach.ArticleOID = ArticleOID;
                        attach.FileName = data[i].Name;
                        attach.FilePath = data[i].Path;
                        attach.FileSize = data[i].Size;
                        attach.FileExt = data[i].ExtendName;
                        attach.CreateTime = new Date(); 
                        attachList.push(attach);
                    }
                    var scoresData = Ext.getCmp('AttachGrid').store.getData().items;
                    Ext.getCmp('AttachGrid').store.add(attachList);
                    Ext.getCmp('AttachGrid').store.proxy.reader.totalProerty = "total";
                    Ext.getCmp('AttachGrid').store.proxy.reader.rootProperty = "AttachInfo";
                }
            }
        });
    },
    onClickOperationDelete: function (grid, rindex, cindex) {
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        Ext.MessageBox.confirm('提醒', '确定要删除选中行', function (btn) {
            if (btn == 'yes') {
                var Record = grid.store.getAt(rindex);//获取grid选中行records
                var data = { PostData: Ext.encode(Record.data.FilePath) };
                grid.store.remove(grid.store.getAt(rindex));
            }
        });
    },
    onClickCommentDelete: function (grid, rindex, cindex) {
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        Ext.MessageBox.confirm('提醒', '确定要删除选中行', function (btn) {
            if (btn == 'yes') {
                var ActionDel = Tools.Method.getAPiRootPath() + '/api/Article/CommentDelete?ct=json';
                var Record = grid.store.getAt(rindex);//获取grid选中行records
                var data = { PostData: Ext.encode(Record.data.OID) };
                grid.store.remove(grid.store.getAt(rindex));
                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0020, '4000', '1', null);
                Tools.Method.ExtAjaxRequestEncap(ActionDel, 'POST', data, true, function (jsonData) { });
            }
        });
    }
});