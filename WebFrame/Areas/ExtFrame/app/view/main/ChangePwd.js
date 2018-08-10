Ext.define('ExtFrame.view.main.ChangePwd', {
    requires: ['ExtFrame.view.main.ChangePwdController'],
    extend: 'Ext.window.Window',
    controller: 'changePwdController',
    resizable: false,
    modal: true,
    //draggable: false,
    autoShow: true,
    title: '更改密码',
    glyph: 'xf007@FontAwesome',
    buttons: [{
        name: 'registbutton',
        text: '确定',
        glyph: 'xf118@FontAwesome',
        listeners: {
            click: 'onChangePwdClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
        }
    }],
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',//父窗体
            reference: 'form',
            bodyPadding: 20,
            fieldDefaults: {
                labelAlign: 'right'
            },
            items: [{
                xtype: 'displayfield',
                itemId: 'UserName',
                labelWidth: 100,
                fieldLabel: '重置密码用户名',
                allowBlank: false,
                value: me.userName
            }, {
                xtype: 'textfield',
                itemId: 'OldPwd',
                labelWidth: 120,
                fieldLabel: '请输入原密码',
                inputType: 'password',
                allowBlank: false,
                emptyText: '请输入原密码'
            }, {
                xtype: 'textfield',
                itemId: 'NewPwd',
                labelWidth: 120,
                fieldLabel: '请输入新密码',
                inputType: 'password',
                allowBlank: false,
                emptyText: '请输入新密码',
                vtype: 'EquaVerification',
                AgainField: 'ReNewPwd'

            }, {
                xtype: 'textfield',
                itemId: 'ReNewPwd',
                labelWidth: 120,
                fieldLabel: '请再次输入新密码',
                inputType: 'password',
                allowBlank: false,
                emptyText: '请再次输入新密码',
                vtype: 'EquaVerification',
                firstField: 'NewPwd'
            }]
        }]
        this.callParent();
    }
});