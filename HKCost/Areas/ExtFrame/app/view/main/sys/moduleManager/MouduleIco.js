Ext.define('ExtFrame.view.main.sys.moduleManager.MouduleIco', {
    extend: 'Ext.window.Window',
    requires: ['ExtFrame.view.main.sys.moduleManager.ModuleManagerModel'],
    controller: 'moduleManager',
    closable: true,
    resizable: false,
    autoShow: true,
    modal: true,
    cls: 'button-view',
    layout: 'vbox',
    width: 783,
    height: 480,
    autoScroll: true,
    closeAction: 'destroy',
    title: '选择图标',
    viewModel: { type: 'moduleManagerModel' },
    initComponent: function () {
        var me = this;
        /* 请求本页面buttons栏按钮数据 */
        var buttons = new Array();
        Tools.Method.ExtAjaxRequestEncap('data/iconselection.json', 'GET', null, false, function (jsonData) {
            $.each(jsonData.iconselection, function (i, btn) {
                buttons.push({
                    xtype: 'button',
                    style: {
                        background: '#fff'
                    },
                    cls: 'blackIco',
                    icoInfo: btn.glyph + '|' + btn.icoInfo,
                    glyph: Ext.decode(btn.glyph)//将字符串 转换为符合font-awesome规范的  16进制
                });
            });
        });
        var operationButtons = new Array();
        Tools.Method.ExtAjaxRequestEncap('data/OperationIcon.json', 'GET', null, false, function (jsonData) {
            $.each(jsonData.operationIcons, function (i, btn) {
                operationButtons.push({
                    xtype: 'button',
                    style: {
                        background: '#fff'
                    },
                    cls: 'blackIco',
                    iconCls: btn.iconCls,
                    icoInfo: btn.iconCls,
                });
            });
        });

        me.items = [{
            xtype: 'tabpanel',
            fit: true,
            items: [{
                fit:true,
                title:'字体图标',
                layout: {
                    type: 'table',
                    columns: 18,
                    tdAttrs: { style: 'padding: 5px 9px;' }
                },
                defaults: {
                    enableToggle: true,
                    listeners: {
                        click: function (me, t, eOpts) {
                            var menuIco = Ext.getCmp('MemuIco');
                            menuIco.setValue(me.icoInfo);
                            me.up('window').close();
                        }
                    }
                },
                items: buttons
            }, {
                title: '行操作按钮图标',
                width: 773,
                layout: {
                    type: 'table',
                    columns: 18,
                    tdAttrs: { style: 'padding: 5px 9px;' }
                },
                defaults: {
                    enableToggle: true,
                    listeners: {
                        click: function (me, t, eOpts) {
                            var menuIco = Ext.getCmp('MemuIco');
                            menuIco.setValue(me.icoInfo);
                            me.up('window').close();
                        }
                    }
                },
                items: operationButtons
            }]
        }];
        me.callParent();

    }
})