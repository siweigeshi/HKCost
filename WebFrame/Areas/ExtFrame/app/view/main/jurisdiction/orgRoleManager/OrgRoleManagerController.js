Ext.define('ExtFrame.view.main.jurisdiction.orgRoleManager.OrgRoleManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.orgRoleManager',
    onClickButtonSave: function () {
        //Tools.GridSearchToolbar.SaveEncap(this, Tools.Method.getAPiRootPath()+'/api/UserManager/PostSave?ct=json');
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var orgTreeGrid = view.down("#orgTree");
        var roleGrid = view.down("#OrgRoleManagerGrid");
        var checkedOrg = new Array(0);
        var checkedRole = new Array(0);

        $.each(orgTreeGrid.getSelection(), function (index, org) {
            checkedOrg.push(org.data.OID);
        });
        if (checkedOrg.length == 0) {
            Tools.Method.ShowTipsMsg(Tools.Msg.MSG00221, '4000', '3', null);
        } else {
            $.each(roleGrid.getSelection(), function (index, role) {
                checkedRole.push(role.data.OID);
            });
            if (checkedRole.length == 0) {
                Ext.MessageBox.confirm('提醒', '确定要清空所选组织机构的角色吗？', function (btn) {
                    if (btn == 'yes') {
                        var data = { PostData: Ext.encode({ 'Orgs': checkedOrg, 'Roles': checkedRole }) };
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()+'/api/OrgManager/PostOrgRoleSave?ct=json', 'POST', data, true, function (jsonData) {
                            if (jsonData) {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0007, '4000', '1', null);
                            }
                            else {
                                Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);
                            }
                        });
                    }
                });
            } else {
                Ext.MessageBox.confirm('提醒', '确定要修改所选组织机构的角色吗？', function (btn) {
                    if (btn == 'yes') {
                        var data = { PostData: Ext.encode({ 'Orgs': checkedOrg, 'Roles': checkedRole }) };
                        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()+'/api/OrgManager/PostOrgRoleSave?ct=json', 'POST', data, true, function (jsonData) {
                            if (jsonData) {
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
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    }
});