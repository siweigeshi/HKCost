Ext.define('ExtFrame.view.main.sys.orgManager.OrgManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.orgManager',

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
        }
    },
    onClickButtonAdd: function () {
        Tools.GridSearchToolbar.AddEncap(this);
    },
    onClickButtonEdit: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        view.down('#' + view.eName + 'Form').getForm().reset();//表单清空
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getChecked();//获取grid选中行records
        //仅能选择一项数据
        if (Tools.Method.IsEditData(selectRecords)) {
            view.down('#' + view.eName + 'Form').getForm().loadRecord(selectRecords[0]);
        }
    },
    onClickButtonSave: function () {
        //Tools.GridSearchToolbar.SaveEncap(this, Tools.Method.getAPiRootPath()+'/api/OrgManager/PostSave?ct=json');
        var ActionEdit = Tools.Method.getAPiRootPath() + '/api/OrgManager/PostSave?ct=json';
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var form = view.down('#' + view.eName + 'Form');
        if (form.isValid()) {
            var record = view.getViewModel().getData().rec;
            record.ParentOID = form.down('#hfOrg').value;
            var pnGrid = view.down('#' + view.eName + 'Grid');
            var data = Tools.Method.GetPostData(Ext.encode(record));
            //alert(record);
            if (record) {
                if (record.ParentOID == undefined || record.ParentOID == '')
                    Tools.Method.ShowTipsMsg('请选择上级菜单', 3000, 3, null);
                else {
                    Tools.Method.ExtAjaxRequestEncap(ActionEdit, 'POST', data, true, function (jsonData) {
                        if (jsonData) {
                            view.down('#' + view.eName + 'Form').getForm().reset();
                            view.getViewModel().getData().rec = null;
                            Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                            pnGrid.store.reload()
                        } else {
                            Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);//修改失败
                        }
                    });
                }
            } else {
                Ext.MessageBox.alert('提示', '请先填写数据！');
            }
        }
    },
    onClickButtonDel: function () {
        Tools.GridSearchToolbar.DeleteEncap(this, Tools.Method.getAPiRootPath() + '/api/OrgManager/Delete?ct=json');
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/OrgManager/Delete?ct=json';
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#' + view.eName + 'Grid');
        var selectRows = pnGrid.getChecked();//获取grid选中行
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRows)) {
            
            var delOIDs = new Array(0);
            $.each(selectRows, function (index, row) {
                delOIDs.push(row.data.OID);
            })
            var data = { PostData: Ext.encode(delOIDs) };
            //alert($.toJSON(data));
            //用户确认删除操作-----点击“确认”并输入“删除”
            Ext.Msg.prompt('提醒', '确定要删除选中行？如果确定删除请输入“删除”，并点击确定', function (btn, text) {
                if (btn == 'ok' && text == '删除') {
                    Tools.Method.ExtAjaxRequestEncap(ActionDelete, 'POST', data, true, function (jsonData) {
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
    onOperationClickButtonLook: function (grid, rindex, cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = grid.up('#tab-OrgManager-grid').down('#OrgManagerForm');
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        grid.setSelection(Record);
        view.getForm().loadRecord(Record);
        var row = grid.store.data.items;
        view.down('#hfOrg').setValue(Record.data.ParentOID);
        if (Record.data.ParentOID == '00000000-0000-0000-0000-000000000000') {
            view.down('#orgPicker').setValue('根节点');
        }
        else {
            for (var i = 0; i < row.length; i++) {
                if (row[i].data.OID == Record.data.ParentOID) {
                    view.down('#orgPicker').setValue(row[i].data.Name);
                }
            }
        }
    },
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    },
    checkChild: function (node, state) {
        checkChild(node, state);
    },
    //上移
    onOperationClickUp: function (grid, rindex, cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var orgId = grid.store.getAt(rindex).data.OID;//获取grid选中行orgid
        var data = Tools.Method.GetPostData(orgId + '☻up');
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/OrgManager/OrgTreeMove?ct=json', 'POST', data, true, function (jsonData) {
            if (jsonData) {
                Tools.Method.ShowTipsMsg('组织机构上移成功！', 3000, 1, null);
                grid.store.reload();
            } else {
                Tools.Method.ShowTipsMsg('组织机构上移失败！请联系管理员', 3000, 2, null);
            }
        });
    },
    //下移
    onOperationClickDown: function (grid, rindex, cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var orgId = grid.store.getAt(rindex).data.OID;//获取grid选中行orgid
        var data = Tools.Method.GetPostData(orgId + '☻down');
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/OrgManager/OrgTreeMove?ct=json', 'POST', data, true, function (jsonData) {
            if (jsonData) {
                Tools.Method.ShowTipsMsg('组织机构下移成功！', 3000, 1, null);
                grid.store.reload();
            } else {
                Tools.Method.ShowTipsMsg('组织机构下移失败！请联系管理员', 3000, 2, null);
            }
        });
    },
    onOperationChildAdd: function (grid, rindex, cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = grid.up('#tab-OrgManager-grid');
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        view.down('#' + view.eName + 'Form').getForm().reset();//表单清空
        view.getViewModel().getData().rec = null;
        view.down('#' + view.eName + 'Form').down('#hfOrg').setValue(Record.data.OID);
        view.down('#' + view.eName + 'Form').down('#orgPicker').setValue(Record.data.Name);
    },
    onOperationClickDelete: function (grid, rindex, cindex) {
        if (!Tools.Method.IsLogin())
            return;
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/OrgManager/Delete?ct=json';
        var view = grid.up('#tab-OrgManager-grid');
        var OrgOID = eval($.cookie('CurUser'))[2];
        var Rows = grid.store.data.items;
        var LT = Record.data.LT;
        var RT = Record.data.RT;
        var isBreak = false;
        $.each(Rows, function (index, row) {
            if (row.data.OID == OrgOID) {
                if (row.data.LT >= LT || row.data.RT <= RT) {
                    isBreak = true;
                }
                return false;
            }
        })
        if (isBreak) {
            Tools.Method.ShowTipsMsg('只允许删除当前登录人组织机构以下的机构', 3000, 2, null);
            return false;
        }
        //用户确认删除操作-----点击“确认”并输入“删除”
        Ext.Msg.prompt('提醒', '确定要删除选中行？如果确定删除请输入“删除”，并点击确定', function (btn, text) {
            if (btn == 'ok' && text == '删除') {
                var delOIDs = new Array(0);
                delOIDs.push(Record.data.OID);
                var data = { PostData: Ext.encode(delOIDs) };
                Tools.Method.ExtAjaxRequestEncap(ActionDelete, 'POST', data, true, function (jsonData) {
                    if (jsonData.result) {
                        Tools.Method.ShowTipsMsg(Tools.Method.StrFormat(Tools.Msg.MSG00141, [jsonData.succount, jsonData.errorcount]), '4000', '1', null);
                        if (view.down('#' + view.eName + 'Form'))
                            view.down('#' + view.eName + 'Form').getForm().reset();
                        view.getViewModel().getData().rec = null;
                        grid.store.reload();
                    }
                    else {
                        Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                    }
                });
            }
        });
    }
});
function checkChild(node, state) {
    if (node.hasChildNodes()) {
        node.eachChild(function (child) {
            child.set('checked', state);
            checkChild(child, state);
        });
    }
}