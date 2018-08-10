Ext.define('ExtFrame.view.main.studentManager.StudentDetail', {
    extend: 'Ext.window.Window',
    requires: ['ExtFrame.view.main.studentManager.StudentDetailModel', 'ExtFrame.view.main.studentManager.StudentDetailController'],
    controller: 'studentDetailController',
    closable: true,
    resizable: false,
    autoShow: true,
    modal: true,
    closeAction: 'destroy',
    title: '学生信息',
    viewModel: { type: 'studentDetailModel' },
    initComponent: function () {
        var me = this;
        if (me.cmd == 'look') {
            me.items = [
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 20,
                    defaults: {
                        readOnly: true
                    },
                    items: [
                        {
                            xtype: 'hiddenfield',
                            bind: '{rec.id}'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.name}',
                            fieldLabel: '姓名'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.email}',
                            fieldLabel: '电子邮箱'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.phone}',
                            fieldLabel: '电话'
                        }
                    ]
                }
            ];
            me.buttons = [
                { xtype: "button", text: "关闭", handler: function () { this.up("window").close(); } }
            ];
        }
        else if (me.cmd == 'add') {
            me.items = [
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 20,
                    items: [
                        {
                            xtype: 'hiddenfield',
                            bind: '{rec.id}'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.name}',
                            fieldLabel: '姓名'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.email}',
                            fieldLabel: '电子邮箱'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.phone}',
                            fieldLabel: '电话'
                        }
                    ]
                }
            ];
            me.buttons = [
                { xtype: "button", text: "添加", handler: 'onAddClick' },
                { xtype: "button", text: "关闭", handler: function () { this.up("window").close(); } }
            ];
        }
        else if (me.cmd == 'edit') {
            me.items = [
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 20,
                    items: [
                        {
                            xtype: 'hiddenfield',
                            bind: '{rec.id}'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.name}',
                            fieldLabel: '姓名'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.email}',
                            fieldLabel: '电子邮箱'
                        },
                        {
                            xtype: 'textfield',
                            bind: '{rec.phone}',
                            fieldLabel: '电话'
                        }
                    ]
                }
            ];
            me.buttons = [
                { xtype: "button", text: "保存", handler: 'onSaveClick' },
                { xtype: "button", text: "关闭", handler: function () { this.up("window").close(); } }
            ];
        }
        this.callParent();
    }
})