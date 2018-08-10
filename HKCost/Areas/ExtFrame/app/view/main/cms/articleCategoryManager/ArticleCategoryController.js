Ext.define('ExtFrame.view.main.cms.articleCategoryManager.ArticleCategoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.articleCategoryManager',
    onClickButtonSave: function () {
        var ActionEdit = Tools.Method.getAPiRootPath() + '/api/ArticleCategory/PostSave?ct=json';
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var form = view.down('#' + view.eName + 'Form');
        if (!view.valid) {
            Tools.Method.ShowTipsMsg('上级类型选择有误', '4000', '2', null);//修改失败
            //Ext.MessageBox.alert('提示', '上级类型选择有误');
            return;
        }
        if (form.isValid()) {
            var record = view.getViewModel().getData().rec;
            //alert(record);
            if (record) {
                if (record.ParentOID == undefined || record.ParentOID == '')
                    record.ParentOID = '00000000-0000-0000-0000-000000000000';
                var pnGrid = view.down('#' + view.eName + 'Grid');
                var data = Tools.Method.GetPostData(Ext.encode(record));
                Tools.Method.ExtAjaxRequestEncap(ActionEdit, 'POST', data, true, function (jsonData) {
                    if (jsonData) {
                        view.down('#' + view.eName + 'Form').getForm().reset();
                        view.getViewModel().getData().rec = null;
                        Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                        form.down('#typePicker').store.reload();
                        pnGrid.store.reload()
                    } else {
                        Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);//修改失败
                    }
                });
            } else {
                Ext.MessageBox.alert('提示', '请先填写数据！');
            }
        }
    },
    checkChild: function (node, state) {
        checkCategoryChild(node, state);
    },
    onClickButtonDel: function () {
        if (!Tools.Method.IsLogin())
            return;
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/ArticleCategory/Delete?ct=json';
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var selectRows = pnGrid.getChecked();//获取grid选中行
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
                            if (view.down('#' + view.eName + 'Form'))
                                view.down('#' + view.eName + 'Form').getForm().reset();
                            view.getViewModel().getData().rec = null;
                            view.down('#' + view.eName + 'Form').down('#typePicker').store.reload();
                            pnGrid.store.reload();
                        }
                        else {
                            Tools.Method.ShowTipsMsg(Tools.Method.StrFormat(Tools.Msg.MSG00141, [jsonData.succount, jsonData.errorcount]), '4000', '2', null);
                            //Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                        }
                    });
                }
            });
        }
    },
    onClickButtonLook: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getChecked();//获取grid选中行records
        //仅能选择一项数据
        if (Tools.Method.IsEditData(selectRecords)) {
            view.down('#' + view.eName + 'Form').getForm().loadRecord(selectRecords[0]);
            view.down('#' + view.eName + 'Form').down('#itemId').OID = selectRecords[0].getData().OID;
        }
    },
    onClickButtonAdd: function () {
        Tools.GridSearchToolbar.AddEncap(this);
    },
    onOperationClickButtonLook: function (grid, rindex, cindex) {
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        view.down('#' + view.eName + 'Form').getForm().loadRecord(Record);
    },
    onOperationClickButtonDel: function (grid, rindex, cindex) {
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/ArticleCategory/Delete?ct=json';
        var delOIDs = new Array(0);
        delOIDs.push(Record.data.OID);
        var data = { PostData: Ext.encode(delOIDs) };
        //用户确认删除操作
        Ext.MessageBox.confirm('提醒', '确定要删除选中行', function (btn) {
            if (btn == 'yes') {
                Ext.MessageBox.show({
                    msg: '正在进行删除操作',
                    progressText: '删除中...',
                    width: 300,
                    wait: {
                        interval: 200
                    },
                    animateTarget: btn
                });
                var t= setTimeout(function () {
                    Ext.MessageBox.hide();
                    Ext.MessageBox.alert('警告', '操作超时，请重试', this.showResult, this);
                }, 30000);
                Tools.Method.ExtAjaxRequestEncap(ActionDelete, 'POST', data, true, function (jsonData) {
                    Ext.MessageBox.hide();
                    clearTimeout(t);
                    if (jsonData.result) {
                        Tools.Method.ShowTipsMsg(Tools.Method.StrFormat(Tools.Msg.MSG00141, [jsonData.succount, jsonData.errorcount]), '4000', '1', null);
                        view.down('#typePicker').store.reload();
                        grid.store.reload();
                    }
                    else {
                        Tools.Method.ShowTipsMsg(jsonData.message, '4000', '2', null);
                    }
                });
            }
        });
    }
});
function checkCategoryChild(node, state) {
    if (node.hasChildNodes()) {
        node.eachChild(function (child) {
            child.set('checked', state);
            checkCategoryChild(child, state);
        });
    }
}