Ext.define('ExtFrame.view.main.jurisdiction.orgModuleManager.OrgModuleManager', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'ExtFrame.view.main.jurisdiction.orgModuleManager.OrgModuleManagerController'
    ],
    xtype: 'tree-grid',
    controller: 'orgModuleManager',
    id: 'orgModuleManager',
    eName: '',
    reserveScrollbar: true,
    rootVisible: false,
    fit: true,
    stripeRows: true,
    checkToSave: [], //用于保存的权限数据
    listeners: {
        checkchange: 'checkChange'
    },
    initComponent: function () {
        var me = this;
        var parama = Tools.Method.GetUrlParams();
        var type = parama['type'];
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Ext.data.TreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath() + '/api/ModuleManager/GetOrgModulesList?ct=json',
                //扩展参数
                extraParams: {
                    'orgId': '00000000-0000-0000-0000-000000000000'
                },
            },
            listeners: {
                load: function (me, store) {
                    me.checkData = addArray(store);
                }
            }
        }),
        me.columns = [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: '菜单',
            width: 200,
            dataIndex: 'Name'
        }, {
            xtype: 'templatecolumn',
            text: '工具栏按钮',
            flex: 3,
            dataIndex: 'toolbarBtns',
            //add in the custom tpl for the rows
            tpl: Ext.create('Ext.XTemplate', '{toolbarBtns:this.formatActions}', {
                formatActions: function (toolbarBtns) {
                    var str_actions = "";
                    if (toolbarBtns.length > 0) {
                        $.each(toolbarBtns, function (index, toolbarBtn) {
                            if (toolbarBtn.checked) {
                                str_actions += "<div style=\"width:100px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'toolbarBtns');\" id=\"" + toolbarBtn.OID + "\" type=\"checkbox\" checked=\"checked\" />" + toolbarBtn.Name + "</div>";
                            }
                            else {
                                str_actions += "<div style=\"width:100px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'toolbarBtns');\" id=\"" + toolbarBtn.OID + "\" type=\"checkbox\" />" + toolbarBtn.Name + "</div>";
                            }
                        });
                    }
                    return str_actions;
                }
            })
        }, {
            xtype: 'templatecolumn',
            text: '行操作按钮',
            flex: 3,
            dataIndex: 'operationBtns',
            //add in the custom tpl for the rows
            tpl: Ext.create('Ext.XTemplate', '{operationBtns:this.formatActions}', {
                formatActions: function (operationBtns) {
                    var str_actions = "";
                    if (operationBtns.length > 0) {
                        $.each(operationBtns, function (index, operationBtn) {
                            if (operationBtn.checked) {
                                str_actions += "<div style=\"width:100px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'operationBtn');\" id=\"" + operationBtn.OID + "\" type=\"checkbox\" checked=\"checked\" />" + operationBtn.Name + "</div>";
                            }
                            else {
                                str_actions += "<div style=\"width:100px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'operationBtn');\" id=\"" + operationBtn.OID + "\" type=\"checkbox\" />" + operationBtn.Name + "</div>";
                            }
                        });
                    }
                    return str_actions;
                }
            })
        }, {
            xtype: 'templatecolumn',
            text: '页面按钮',
            flex: 3,
            dataIndex: 'pageBtns',
            //add in the custom tpl for the rows
            tpl: Ext.create('Ext.XTemplate', '{pageBtns:this.formatActions}', {
                formatActions: function (pageBtns) {
                    var str_actions = "";
                    if (pageBtns.length > 0) {
                        $.each(pageBtns, function (index, pageBtn) {
                            if (pageBtn.checked) {
                                str_actions += "<div style=\"width:100px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'pageBtn');\" id=\"" + pageBtn.OID + "\" type=\"checkbox\" checked=\"checked\" />" + pageBtn.Name + "</div>";
                            }
                            else {
                                str_actions += "<div style=\"width:100px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'pageBtn');\" id=\"" + pageBtn.OID + "\" type=\"checkbox\" />" + pageBtn.Name + "</div>";
                            }
                        });
                    }
                    return str_actions;
                }
            })
        }];
        if (type!='1') {
            me.columns.push({
                xtype: 'templatecolumn',
                text: '请求',
                flex: 3,
                dataIndex: 'actions',
                //add in the custom tpl for the rows
                tpl: Ext.create('Ext.XTemplate', '{actions:this.formatActions}', {
                    formatActions: function (actions) {
                        var str_actions = "";
                        if (actions.length > 0) {
                            $.each(actions, function (index, action) {
                                if (action.checked) {
                                    str_actions += "<div style=\"width:120px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'action');\" id=\"" + action.OID + "\" type=\"checkbox\" checked=\"checked\" />" + action.Name + "</div>";
                                }
                                else {
                                    str_actions += "<div style=\"width:120px; float:left; text-align:left;\"><input class=\"action\" onclick=\"OrgModuleClick(this,'action');\" id=\"" + action.OID + "\" type=\"checkbox\" />" + action.Name + "</div>";
                                }
                            });
                        }
                        return str_actions;
                    }
                })
            });
        }
        //grid 停靠item
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            hasSearch: false,
            eName: me.eName,
            items: [{
                xtype: 'treepicker',
                itemId: 'orgPicker',
                fieldLabel: '组织机构',
                displayField: 'Name',
                valueField: 'OID',
                forceSelection: true,// 只能选择下拉框里面的内容
                emptyText: '请选择',
                blankText: '请选择',// 该项如果没有选择，则提示错误信息
                labelWidth: 60,
                rootVisible: false,
                store: Ext.create('Ext.data.TreeStore', {
                    model: 'Ext.data.TreeModel',
                    autoLoad: true,
                    root: {
                        OID: '00000000-0000-0000-0000-000000000000',
                        Name: '',
                        id: '00000000-0000-0000-0000-000000000000',
                        expanded: true
                    },
                    proxy: {
                        type: 'ajax',
                        url: Tools.Method.getAPiRootPath() + '/api/OrgManager/GetOrgList?ct=json',
                        reader: {
                            type: 'json',
                            rootproperty: 'children',//数据根节点名称
                        }
                    },
                    clearOnLoad: true,
                    nodeParam: 'PID'
                }),
                listeners: {
                    select: function (me, record, eOpts) {
                        me.up('#tab-OrgModuleManager-grid').store.getProxy().extraParams = {
                            "orgId": record.data.OID,
                        };
                        me.up('#tab-OrgModuleManager-grid').store.reload();
                    },

                }
            }]
        }];
        me.callParent();
    }
});

function addArray(obj) {
    var items = new Array();
    $.each(obj, function (num, rec) {
        var model = {};
        model.Name = rec.data.Name;
        model.OID = rec.data.OID;
        model.checked = rec.data.checked;
        items.push(model);
        Array.prototype.push.apply(items, rec.data.actions);
        Array.prototype.push.apply(items, rec.data.operationBtns);
        Array.prototype.push.apply(items, rec.data.pageBtns);
        Array.prototype.push.apply(items, rec.data.toolbarBtns);
        if (rec.childNodes!=undefined&&rec.childNodes.length>0) {
            Array.prototype.push.apply(items, addArray(rec.childNodes));
        }
    });
    return items;
}