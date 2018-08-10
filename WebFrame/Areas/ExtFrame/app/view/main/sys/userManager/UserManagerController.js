Ext.define('ExtFrame.view.main.sys.userManager.UserManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.userManager',

    onClickButtonLook: function () {
        var view = this.getView();
        var pnGrid = view.down('#UserManagerGrid');//获取当前grid控件
        var selectRecords = pnGrid.getSelection();//获取grid选中行records
        view.down('#UserManagerForm').down('#UserName').OID = selectRecords[0].getData().OID;
        view.down('#UserManagerForm').down('#Email').OID = selectRecords[0].getData().OID;
        Tools.GridSearchToolbar.LookEncap(this);
    },
    onClickButtonAdd: function () {
        Tools.GridSearchToolbar.AddEncap(this);
        //恢复用户名可修改
        //this.getView().down('#textUserName').setConfig('readOnly', false);
    },
    onClickButtonEdit: function () {
        var view = this.getView();
        var pnGrid = view.down('#UserManagerGrid');//获取当前grid控件
        var selectRecords = pnGrid.getSelection();//获取grid选中行records
        view.down('#UserManagerForm').down('#UserName').OID = selectRecords[0].getData().OID;
        view.down('#UserManagerForm').down('#Email').OID = selectRecords[0].getData().OID;
        Tools.GridSearchToolbar.EditEncap(this);
    },
    onClickButtonSave: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var form = view.down('#' + view.eName + 'Form');
        if (form.isValid()) {
            var record = view.getViewModel().getData().rec;
            var isFirst = record.OID != '' && record.OID != null;
            var pnGrid = view.down('#' + view.eName + 'Grid');
            var data = Tools.Method.GetPostData(Ext.encode(record));
            if (record) {
                Tools.Method.ExtAjaxRequestEncap( Tools.Method.getAPiRootPath() + '/api/UserManager/PostSave?ct=json', 'POST', data, true, function (jsonData) {
                    if (jsonData) {
                        view.down('#' + view.eName + 'Form').getForm().reset();
                        view.getViewModel().getData().rec = null;
                        if (!isFirst) {
                            Tools.Method.ShowTipsMsg('新增成功，默认密码为:123456', '4000', '1', null);
                        } else {
                            Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                        }
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
    onClickLogicDelete:function myfunction() {
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var selectRows = pnGrid.getSelectionModel().getSelection();//获取grid选中行
        var UserID = eval($.cookie('CurUser'))[0];
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRows)) {
            var delOIDs = '';
            var res = true;
            $.each(selectRows, function (index, row) {
                if (row.data.OID == UserID) {
                    res = false;
                    return false;
                }
                delOIDs += row.data.OID + ',';
            });
            if (!res) {
                Tools.Method.ShowTipsMsg('不能删除当前登录人！', '4000', '3', null);
                return false;
            }
            delOIDs = delOIDs.substr(0, delOIDs.length - 1);
            var data = { PostData: delOIDs };
            //用户确认删除操作-----点击“是”
            Ext.MessageBox.confirm('提醒', '确定要删除选中行？', function (btn) {
                if (btn == 'yes') {
                    Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/UserManager/PostLogicDelete?ct=json', 'POST', data, true, function (jsonData) {
                        if (jsonData.result) {
                            Tools.Method.ShowTipsMsg(Tools.Method.StrFormat(Tools.Msg.MSG00141, [jsonData.succount, jsonData.errorcount]), '4000', '1', null);
                            if (view.down('#' + view.eName + 'Form'))
                                view.down('#' + view.eName + 'Form').getForm().reset();
                            view.getViewModel().getData().rec = null;
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
    onClickButtonDel: function () {
        //Tools.GridSearchToolbar.DeleteByOIDEncap(this, Tools.Method.getAPiRootPath() + '/api/UserManager/Delete?ct=json');
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var selectRows = pnGrid.getSelectionModel().getSelection();//获取grid选中行
        var UserID = eval($.cookie('CurUser'))[0];
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRows)) {
            var delOIDs = '';
            var res = true;
            $.each(selectRows, function (index, row) {
                if (row.data.OID == UserID) {
                    res = false;
                    return false;
                }
                delOIDs += row.data.OID + ',';
            });
            if (!res) {
                Tools.Method.ShowTipsMsg('不能删除当前登录人！', '4000', '3', null);
                return false;
            }
            delOIDs = delOIDs.substr(0, delOIDs.length - 1);
            var data = { PostData: delOIDs };
            //用户确认删除操作-----点击“是”
            Ext.MessageBox.confirm('提醒', '确定要删除选中行？', function (btn) {
                if (btn == 'yes') {
                    Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/UserManager/Delete?ct=json', 'POST', data, true, function (jsonData) {
                        if (jsonData.result) {
                            Tools.Method.ShowTipsMsg(Tools.Method.StrFormat(Tools.Msg.MSG00141, [jsonData.succount, jsonData.errorcount]), '4000', '1', null);
                            if (view.down('#' + view.eName + 'Form'))
                                view.down('#' + view.eName + 'Form').getForm().reset();
                            view.getViewModel().getData().rec = null;
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
    onClickSearch: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var gridSearchToolbar = pnGrid.getDockedItems('gridsearchtoolbar')[0];//获取gridSearchbar搜索栏
        var fileds = gridSearchToolbar.down('#lastComboID').getValue();//获取搜索字段
        var value = gridSearchToolbar.down('#lastSearchField').getValue();//获取搜索关键字
        var swhere = 'State|int|0|=,';
        if (value != '') {
            if (gridSearchToolbar.searchEx) {
                swhere += Tools.Method.StrFormat(fileds, [value])+',';//拼接查询where字句
            } else {
                swhere += fileds + "|" + value+',';
            }
        }
        //带附加参数重构grid store数据
        pnGrid.store.getProxy().extraParams = {
            "swhere": swhere.substr(0,swhere.length-1),
        };
        //重新加载grid
        pnGrid.store.reload();
    },
    onClickExport: function () {
        window.open(Tools.Method.getAPiRootPath() + '/api/UserManager/Export');
        //Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/UserManager/Export', 'GET', null, true, function (jsonData) {

        //});
    }
});