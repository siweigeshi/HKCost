//批量设置角色权限
Ext.define('ExtFrame.view.main.sys.roleManager.RolePermissionSet', {
    extend: 'Ext.window.Window',
    closable: true,
    layout: { type: 'border' },
    resizable: false,
    autoShow: true,
    modal: true,
    width: 400,
    height: 200,
    closeAction: 'destroy',
    
    initComponent: function () {
        var me = this;
        var checkbox = new Array();
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + "/api/PermissionManager/GetPermissionList?ct=json", 'GET', null, false, function (jsonData) {
            $.each(jsonData, function (i, btn) {
                checkbox.push({
                    boxLabel: btn.Name,
                    name: 'rb',
                    inputValue: btn.OID
                });
            });
        });
        me.items = [{
            xtype: 'form',
            region: 'center',
            autoScroll: true,
            bodyPadding: 5,
            padding: 2,
            defaults: {
                bodyPadding: 5
            },
            fieldDefaults: {
                labelAlign: 'right'
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: '选择项',
                labelWidth: 60,
                value: me.displayName
            }, {
                xtype: 'checkboxgroup',
                itemId: 'lblName',
                name: 'lblName',
                fieldLabel: '勾选权限',
                labelWidth: 60,
                columns: 5,
                vertical: true,
                items: checkbox,
            }]
        }];
        if (me.Operation == 'add') {
            me.title = '批量添加权限';
            
        } else if (me.Operation == 'remove') {
            me.title = '批量移除权限';
        }
        me.buttons = [
                { xtype: "button", text: "保存", handler: 'onSavePermission' },
                { xtype: "button", text: "关闭", handler: function () { this.up("window").close(); } }
        ];
        this.callParent();
    }
});