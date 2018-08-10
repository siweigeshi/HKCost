Ext.define('ExtFrame.view.main.sys.moduleManager.ModuleManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.moduleManager',

    onClickButtonLook: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getChecked();//获取grid选中行records
        //根据oid取出module已配置的权限
        var oid = selectRecords[0].getData().OID;
        var permission = null;
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/GetModulePermissionByOid?ct=json&oid=' + oid, 'GET', null, false, function (jsonData) {
            permission = jsonData;
        })
        selectRecords[0].data.Permissions = permission;
        view.down('#ModuleManagerForm').down('#EName').OID = oid;
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
        //根据oid取出module已配置的权限
        var oid = selectRecords[0].getData().OID;
        var permission = null;
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/GetModulePermissionByOid?ct=json&oid=' + oid, 'GET', null, false, function (jsonData) {
            permission = jsonData;
        })
        selectRecords[0].data.Permissions = permission;
        view.down('#ModuleManagerForm').down('#EName').OID = oid;
        //仅能选择一项数据
        if (Tools.Method.IsEditData(selectRecords)) {
            view.down('#' + view.eName + 'Form').getForm().loadRecord(selectRecords[0]);
        }
    },
    onClickButtonSave: function () {
        var ActionEdit = Tools.Method.getAPiRootPath() + '/api/ModuleManager/PostSave?ct=json';
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var form = view.down('#' + view.eName + 'Form');
        if (form.isValid()) {
            var record = view.getViewModel().getData().rec;
            record.ParentOID = form.down('#hfModule').value;
            if (record.ButtonId == '')
                delete record['ButtonId'];
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
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/ModuleManager/Delete?ct=json';
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
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    },
    onClickButtonIco: function () {
        Ext.create('ExtFrame.view.main.sys.moduleManager.MouduleIco')

    },
    onOperationClickButtonLook: function (grid, rindex, cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = grid.up('#tab-ModuleManager-grid').down('#ModuleManagerForm');
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        //根据oid取出module已配置的权限
        var oid = Record.getData().OID;
        var permission = null;
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/GetModulePermissionByOid?ct=json&oid=' + oid, 'GET', null, false, function (jsonData) {
            permission = jsonData;
        })
        Record.data.Permissions = permission;
        //grid.setSelection(Record);
        view.down('#EName').OID = oid;
        view.getForm().loadRecord(Record);
        Record.data.Permissions = [];
        var row = grid.store.data.items;
        view.down('#hfModule').setValue(Record.data.ParentOID);
        if (Record.data.ParentOID == '00000000-0000-0000-0000-000000000000') {
            view.down('#modulePicker').setValue('根节点');
        }
        else {
            for (var i = 0; i < row.length; i++) {
                if (row[i].data.OID == Record.data.ParentOID) {
                    view.down('#modulePicker').setValue(row[i].data.Name);
                }
            }
        }
    },
    checkChild: function (node, state) {
        checkChild(node, state);
    },
    //权限分配工具栏按钮
    onClickForPermission: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getChecked();//获取grid选中行records
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRecords)) {
            var selectRecordsOid = new Array();
            var nameList = new Array();
            $.each(selectRecords, function (index, row) {
                var PermissionsOid = new Array();
                $.each(row.data.Permissions, function (i, per) {
                    PermissionsOid.push(per.OID);
                });
                selectRecordsOid.push({
                    OID: row.data.OID, Permissions: PermissionsOid
                });
                nameList.push(row.data.Name);
            });
            var nameDisplay = "";
            if (nameList.length > 10) {
                for (var i = 0; i < 10; i++) {
                    nameDisplay += nameList[i] + ',';
                }
                nameDisplay = nameDisplay.substr(0, nameDisplay.length - 1) + '...';
            } else {
                nameDisplay = nameList.toString();
            }
            Ext.create('ExtFrame.view.main.sys.roleManager.RolePermissionSet', {
                Operation: 'add',
                selectModules: selectRecordsOid,
                displayName: nameDisplay,
                controller: 'moduleManager',
                width: 560,
                height: 360
            });
        }
    },
    //移除权限工具栏按钮
    onClickRemovePermission: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getChecked();//获取grid选中行records
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRecords)) {
            var selectRecordsOid = new Array();
            var nameList = new Array();
            $.each(selectRecords, function (index, row) {
                var PermissionsOid = new Array();
                $.each(row.data.Permissions, function (i, per) {
                    PermissionsOid.push(per.OID);
                });
                selectRecordsOid.push({
                    OID: row.data.OID, Permissions: PermissionsOid
                });
                nameList.push(row.data.Name);
            });
            var nameDisplay = "";
            if (nameList.length > 10) {
                for (var i = 0; i < 10; i++) {
                    nameDisplay += nameList[i] + ',';
                }
                nameDisplay = nameDisplay.substr(0, nameDisplay.length - 1) + '...';
            } else {
                nameDisplay = nameList.toString();
            }
            Ext.create('ExtFrame.view.main.sys.roleManager.RolePermissionSet', {
                Operation: 'remove',
                selectModules: selectRecordsOid,
                displayName: nameDisplay,
                controller: 'moduleManager',
                width: 560,
                height: 360
            });
        }
    },
    //批量添加、移除权限窗体保存按钮
    onSavePermission: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var checkboxs = view.down("#lblName").getChecked();//获取选中的checkbox的值
        if (checkboxs.length > 0) {
            var selectModules = view.selectModules;
            var delModules = [];
            $.each(checkboxs, function (i, checkbox) {
                $.each(selectModules, function (j, Module) {
                    if (view.Operation == 'add') {
                        if (Module.Permissions.toString().indexOf(checkbox.inputValue) == -1) {
                            Module.Permissions.push(checkbox.inputValue);
                        }
                    } else if (view.Operation == 'remove' ) {
                        Module.Permissions.push(checkbox.inputValue);
                    }
                });
            });
            var url = Tools.Method.getAPiRootPath() + '/api/ModuleManager/PostPermissionSave?ct=json';
            if (view.Operation == 'remove') {
                url = '/api/ModuleManager/PostDelPermissionSave?ct=json';
            }
            var data = Tools.Method.GetPostData(Ext.encode(selectModules));
            Tools.Method.ExtAjaxRequestEncap(url, 'POST', data, true, function (jsonData) {
                if (jsonData) {
                    view.close();//修改成功
                    if (view.Operation == 'add') {
                        Tools.Method.ShowTipsMsg('批量添加权限是成功！', 3000, 1, null);
                    } else {
                        Tools.Method.ShowTipsMsg('批量移除权限成功！', 3000, 1, null);
                    }
                    //刷新grid
                    Ext.getCmp('ModuleManagerGrid').store.reload();
                } else {
                    if (view.Operation == 'add') {
                        Tools.Method.ShowTipsMsg('批量添加权限是失败！', 3000, 2, null);
                    } else {
                        Tools.Method.ShowTipsMsg('批量移除权限失败！', 3000, 2, null);
                    }
                }
            });
        } else {
            if (view.Operation == 'add') {
                Tools.Method.ShowTipsMsg('请选择要添加的权限', 3000, 3, null);
            } else {
                Tools.Method.ShowTipsMsg('请选择要移除的权限', 3000, 3, null);
            }
        }
    },
    onOperationClickUp: function (grid, rindex, cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var moduleId = grid.store.getAt(rindex).data.OID;//获取grid选中行orgid
        var data = Tools.Method.GetPostData(moduleId + '☻up');
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/ModuleTreeMove?ct=json', 'POST', data, true, function (jsonData) {
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
        var moduleId = grid.store.getAt(rindex).data.OID;//获取grid选中行orgid
        var data = Tools.Method.GetPostData(moduleId + '☻down');
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/ModuleTreeMove?ct=json', 'POST', data, true, function (jsonData) {
            if (jsonData) {
                Tools.Method.ShowTipsMsg('组织机构下移成功！', 3000, 1, null);
                grid.store.reload();
            } else {
                Tools.Method.ShowTipsMsg('组织机构下移失败！请联系管理员', 3000, 2, null);
            }
        });
    },
    onOperationChildAdd: function(grid,rindex,cindex) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = grid.up('#tab-ModuleManager-grid');
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        view.down('#' + view.eName + 'Form').getForm().reset();//表单清空
        view.getViewModel().getData().rec = null;
        if (Record.data.OID != '' && Record.data.OID!=undefined) {
            view.down('#' + view.eName + 'Form').down('#hfModule').setValue(Record.data.OID);
            view.down('#' + view.eName + 'Form').down('#modulePicker').setValue(Record.data.Name);
        }
        else {
            view.down('#' + view.eName + 'Form').down('#hfModule').setValue('00000000-0000-0000-0000-000000000000');
            view.down('#' + view.eName + 'Form').down('#modulePicker').setValue('根节点');
        }
    },
    onOperationClickDelete: function (grid, rindex, cindex) {
        if (!Tools.Method.IsLogin())
            return;
        var Record = grid.store.getAt(rindex);//获取grid选中行records
        var ActionDelete = Tools.Method.getAPiRootPath() + '/api/ModuleManager/Delete?ct=json';
        var view = grid.up('#tab-ModuleManager-grid');
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
    },
    onClickButtonAddRoot: function () {
        var view = this.getView();//获取当前grid控件
        view.down('#' + view.eName + 'Form').getForm().reset();
        view.getViewModel().getData().rec = null;
        view.down('#' + view.eName + 'Form').down('#hfModule').setValue('00000000-0000-0000-0000-000000000000');
        view.down('#' + view.eName + 'Form').down('#modulePicker').setValue('根节点');
        view.down('#' + view.eName + 'Form').down('#State').setValue(0);
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