Ext.define('ExtFrame.view.main.sys.roleManager.RoleManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.roleManager',
    
    onClickButtonLook: function () {
        Tools.GridSearchToolbar.LookEncap(this);
    },
    onClickButtonAdd: function () {
        Tools.GridSearchToolbar.AddEncap(this);
    },
    onClickButtonEdit: function () {
        Tools.GridSearchToolbar.EditEncap(this);
    },
    onClickButtonSave: function () {
        Tools.GridSearchToolbar.SaveEncap(this, Tools.Method.getAPiRootPath()+'/api/RoleManager/PostSave?ct=json');
    },
    onClickButtonDel: function () {
        Tools.GridSearchToolbar.DeleteByOIDEncap(this, Tools.Method.getAPiRootPath()+'/api/RoleManager/Delete?ct=json');
    },
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    },
    //分配权限
    onClickForPermission: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView().ownerCt.down("#RoleManagerGrid");
        var records = new Array();//角色OID
        var nameList = new Array();
        var permissionList = new Array();//权限列表 --用来加载原角色对应的权限OID
        var selectRows = view.getSelectionModel().getSelection();//获取grid选中行
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRows)) {
            $.each(selectRows, function (index, row) {                
                $.each(row.data.Permissions, function (index, permissrow) {
                     permissionList.push(permissrow.OID);
                })
                var hh = { OID: row.data.OID, Permissions: permissionList };
                records.push(hh);//构造的对象
                nameList.push(row.data.Name);
            });
            if (Ext.encode(nameList.length) > 15)
            {
                nameList = nameList.toString().substring(0, 15) + "..";
            }
            var aaa = Ext.create('ExtFrame.view.main.sys.roleManager.RolePermissionSet', {
                    Operation:'add',
                    selectOIDs: records,
                    displayName: nameList,
                    controller: 'roleManager'
            });
        }
    },
    //移除权限
    onClickRemovePermission: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView().ownerCt.down("#RoleManagerGrid");
        var records = new Array();//角色OID
        var nameList = new Array();
        var permissionList = new Array();//权限列表 --用来加载原角色对应的权限OID
        var selectRows = view.getSelectionModel().getSelection();//获取grid选中行
        //至少选择一项数据
        if (Tools.Method.IsDelData(selectRows)) {
            $.each(selectRows, function (index, row) {
                $.each(row.data.Permissions, function (index, permissrow) {
                    permissionList.push(permissrow.OID);
                })
                var hh = { OID: row.data.OID, Permissions: permissionList };
                records.push(hh);//构造的对象
                nameList.push(row.data.Name);
            });
            if (Ext.encode(nameList.length) > 15) {
                nameList = nameList.toString().substring(0, 15) + "..";
            }
            var aaa = Ext.create('ExtFrame.view.main.sys.roleManager.RolePermissionSet', {
                Operation: 'remove',
                selectOIDs: records,
                displayName: nameList,
                controller: 'roleManager'
            });
        }
    },
    onSavePermission: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var checkboxValue = view.down("#lblName").getChecked();//获取选中的checkbox的值
        if (checkboxValue != "") {
            var selectRow = view.down("#lblName").selectOIDs;//选中的grid中的记录
            var checkValue = new Array();//选中的权限           
            var selectOIDs = view.selectOIDs;//得到构造的对象[{OID:'',Permission:[]}]
            $.each(selectOIDs, function (index, row) {                
                $.each(checkboxValue, function (i, item) {
                    if (view.Operation == "add") {
                        if (row.Permissions.toString().indexOf(item.inputValue) > -1) {
                        }
                        else {
                            row.Permissions.push(item.inputValue);
                        }
                    }
                    else {
                        $.each(row.Permissions, function (k, per) {
                            if (per == item.inputValue)
                                row.Permissions.splice(k, 1);
                        });                       
                    }                 
                    });
            })
            var data = Tools.Method.GetPostData(Ext.encode(selectOIDs));
            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + "/api/RoleManager/RolePermissionSave?ct=json", 'POST', data, true, function (jsonData) {
                if (jsonData) {
                    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                    Ext.getCmp("RoleManagerGrid").store.reload();
                    view.close();
                } else {
                    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);//修改失败
                }
            });
        }
        else {
            Tools.Method.ShowTipsMsg("请选择要配置的权限信息!", '4000', '1', null);
        }
        
    }
});