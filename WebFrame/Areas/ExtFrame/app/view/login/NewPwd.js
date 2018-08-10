Ext.define('ExtFrame.view.login.NewPwd', {
    requires: ['ExtFrame.view.login.NewPwdController'],
    extend: 'Ext.container.Viewport',
    controller: 'newPwdController',
    closable: false,
    resizable: false,
    loginFailNum: 0,
    //modal: true,
    //draggable: false,
    autoShow: true,
    title: '重置密码---MVCFrame',
    glyph: 'xf007@FontAwesome',
    initComponent: function () {
        var width = 400;
        var me=this;
        this.items = [{
            xtype: 'form',//父窗体
            bodyBorder: true,
            border: false,
            align: 'center',
            plain: true,
            x: $('#bgDiv').width() / 2 - width / 2,
            y: $('#bgDiv').height() / 2 - width / 2,
            width: width,
            buttonAlign: 'center',
            labelAlign: 'right',
            bodyPadding: '30 20 30 20',
            items: [{
                xtype: 'displayfield',
                value: '输入新密码即可重置用户名为"'+me.userName+'"的密码',
                fieldStyle: 'color:red'
            }, {
                xtype: 'label',
                text: '请输入新密码',
                style: {
                    color: '#535353'
                }
            }, {
                xtype: 'textfield',
                itemId: 'NewPwd',
                labelWidth: 50,
                emptyText: '请输入新密码',
                inputType: 'password',
                allowBlank: false,
                vtype: 'EquaVerification',
                AgainField: 'ReNewPwd',
                style: {
                    width: '360px',
                    height: '50px',
                    marginTop: '5px',
                    marginBottom: '10px'
                }
            }, {
                xtype: 'label',
                text: '请再次输入新密码',
                style: {
                    color: '#535353'
                }
            }, {
                xtype: 'textfield',
                itemId: 'ReNewPwd',
                inputType: 'password',
                labelWidth: 50,
                emptyText: '请再次输入新密码',
                allowBlank: false,
                vtype: 'EquaVerification',
                firstField: 'NewPwd',
                style: {
                    width: '360px',
                    height: '50px',
                    marginBottom: '10px'
                }
            }],
            buttons: ['->', {
                text: '重置密码',
                style: {
                    width: '175px',
                    height: '40px',
                    marginBottom: '10px'
                },
                glyph: 'xf110@FontAwesome',
                region: 'center',
                listeners: {
                    click: 'onNewPwdClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
                }
            }]
        }];
        this.callParent();
    }
});