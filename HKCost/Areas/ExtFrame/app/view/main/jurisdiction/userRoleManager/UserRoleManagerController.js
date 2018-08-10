Ext.define('ExtFrame.view.main.jurisdiction.userRoleManager.UserRoleManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.userRoleManager',

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
        //Tools.GridSearchToolbar.SaveEncap(this, Tools.Method.getAPiRootPath()+'/api/UserManager/PostSave?ct=json');
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var userGrid = view.down("#UserRoleManagerGrid");
        var roleGrid = view.down("#RoleUserGrid");
        var orgText = userGrid.down("#searchtoolbar").down("#orgPicker").getValue();//searchtoolbar
        var checkedUser = new Array(0);
        var checkedRole = new Array(0);
        //alert(orgText);
        if (orgText == "00000000-0000-0000-0000-000000000000" || orgText == "undefined") {
            Tools.Method.ShowTipsMsg("请先选择一个组织机构！", '4000', '3', null);
            return;
        }
        $.each(userGrid.getSelection(), function (index, user) {
            checkedUser.push(user.data.OID);
        });
        if (checkedUser.length == 0) {
            Tools.Method.ShowTipsMsg("请先选择要配置的用户！", '4000', '3', null);
        } else {
            $.each(roleGrid.getSelection(), function (index, role) {
                checkedRole.push(role.data.OID);
            });
            if (checkedRole.length == 0) {
                Ext.MessageBox.confirm('提醒', '确定要清空所选用户的角色吗？', function (btn) {
                    if (btn == 'yes') {
                        var data = { PostData: Ext.encode({ 'Users': checkedUser, 'Roles': checkedRole }) };
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()+'/api/UserManager/SaveUserRoleRelation?ct=json', 'POST', data, true, function (jsonData) {
                            if (jsonData) {
                                //重新加载grid
                                userGrid.store.reload();
                                roleGrid.store.reload();
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0007, '4000', '1', null);
                            }
                            else {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                            }
                        });
                    }
                });
            } else {
                Ext.MessageBox.confirm('提醒', '确定要修改所选用户的角色吗？', function (btn) {
                    if (btn == 'yes') {
                        var data = { PostData: Ext.encode({ 'Users': checkedUser, 'Roles': checkedRole }) };
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()+'/api/UserManager/SaveUserRoleRelation?ct=json', 'POST', data, true, function (jsonData) {
                            if (jsonData) {
                                //重新加载grid
                                userGrid.store.reload();
                                roleGrid.store.reload();
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0007, '4000', '1', null);
                            }
                            else {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                            }
                        });
                    }
                });
            }
        }


    },
    onClickButtonDel: function () {
        Tools.GridSearchToolbar.DeleteEncap(this, Tools.Method.getAPiRootPath()+'/api/UserManager/Delete?ct=json');
    },
    onClickSearch: function () {
        //Tools.GridSearchToolbar.SearchEncap(this);
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();//获取当前grid控件
        var pnGrid = view.down('#UserRoleManagerGrid');
        var gridSearchToolbar = pnGrid.getDockedItems('gridsearchtoolbar')[0];//获取gridSearchbar搜索栏
        var fileds = gridSearchToolbar.down('#lastComboID').getValue();//获取搜索字段
        var value = gridSearchToolbar.down('#lastSearchField').getValue();//获取搜索关键字
        var swhere = '';
        var type = "";
        if (value != '') {
            //swhere = Tools.Method.StrFormat('Base_UserInfo.' + fileds, [value]);//拼接查询where字句
            swhere = fileds + "|" + value;
        }

        var orgid = gridSearchToolbar.down('#orgPicker').getValue();//获取选择的组织机构
        if (orgid == "00000000-0000-0000-0000-000000000000" || orgid == "4ED05627-65A3-4692-9199-95D21CB86650") { //如果选择的不是公司机构) {
            swhere += "";
        }
        else {
            if (value != '') {
                //swhere += " and Base_OrgInfo.OID in elements (Base_UserInfo.Orgs) and Base_OrgInfo.OID='" + orgid + "'";
                swhere += ",OID|STRING|" + orgid;
            } else {
                swhere += "OID|STRING|" + orgid;
            }
            type = "org";
        }

        //带附加参数重构grid store数据
        pnGrid.store.getProxy().extraParams = {
            "swhere": swhere,
            "type": type
        };
        //重新加载grid
        pnGrid.store.reload();
    }
});