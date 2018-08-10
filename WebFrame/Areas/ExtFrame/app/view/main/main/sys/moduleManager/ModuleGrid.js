Ext.define('ExtFrame.view.main.sys.moduleManager.ModuleGrid', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn'
    ],
    alias: 'widget.modulegrid',
    fit: true,
    reserveScrollbar: true,
    rootVisible: false,
    stripeRows: true,
    //selType: 'checkboxmodel',
    initComponent: function () {
        var me = this;
        /********************** 根据具体业务需要适当修改 ***********************/
        /*
        ** grid控件绑定列
        ** text: 前台显示文字, dataIndex: 数据绑定字段, sortable: 能否排序（缺省值为true）
        ** searchable: 能否查询（缺省值为false）
        ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
           其中string类型使用'like'关键字查询，其余的使用'='关键字查询）
        */
        me.columns = [
             { text: 'OID', dataIndex: 'OID', hidden: true },
             { text: '名称', dataIndex: 'text', xtype: 'treecolumn', width: 180 },
             { text: '编号', dataIndex: 'Code' },
             { text: '英文名称', dataIndex: 'EName', width: 180 },
             { text: '类名/事件', dataIndex: 'PathHandler', width: 300 },
             {
                 text: '类型', dataIndex: 'Flag', renderer: function (v) {
                     if (v == 0) {
                         return '菜单';
                     }
                     else if (v == 1) {
                         return '工具栏按钮';
                     }
                     else if (v == 2) {
                         return '数据请求';
                     }
                     else if (v == 3) {
                         return '行操作按钮';
                     }
                     else if (v == 4) {
                         return '页面按钮';
                     }
                 }
             },
             {
                 text: '状态', dataIndex: 'State', renderer: function (v) {
                     if (v == 1) {
                         return '停用';
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             }
        ];
        Tools.Grid.CreateOperationBtn(me, 'ModuleManager');
        //构造grid store
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Ext.data.TreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath() + "/api/ModuleManager/GetAllModulesForTree?ct=json",
                folderSort: true
            }
        });
        //grid 停靠item
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            itemId: 'gridtoolbar',
            hasSearch: false,
            eName: me.eName,//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            dock: 'top',
            items: []
        }];
        me.viewConfig = {
            plugins: {
                ptype: 'treeviewdragdrop',
                containerScroll: true,
            },
            listeners: {
                beforedrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
                    dropHandlers.wait = true;
                    var typeStr = '';
                    switch (dropPosition) {
                        case 'before':
                            typeStr = '确认将“{0}”移动到“{1}”<font color="red">之前</font>？';
                            break;
                        case 'after':
                            typeStr = '确认将“{0}”移动到“{1}”<font color="red">之后</font>？';
                            break;
                        case 'append':
                            typeStr = '确认将“{0}”移动到“{1}”<font color="red">之内</font>？';
                            break;
                        default:
                            typeStr = '“{0}”移动到“{1}”移动不合法';
                    }
                    var msg = Tools.Method.StrFormat(typeStr, [data.records[0].getData().text, overModel.getData().text]);
                    var data = Tools.Method.GetPostData(Ext.encode({ dropOID: data.records[0].getData().OID, targetOID: overModel.getData().OID, dropPosition: dropPosition }), true);
                    Ext.MessageBox.confirm('提示', msg, function (btn) {
                        if (btn === 'yes' && msg.indexOf('不合法') < 0) {
                            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/ModuleManager/PostDrop?ct=json', 'POST', data, false, function (jsonData) {
                                if (jsonData) {
                                    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0007, 1000, 1, null);
                                    dropHandlers.processDrop();
                                } else {
                                    Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, 1000, 2, null);
                                    dropHandlers.cancelDrop();
                                }
                            });
                        } else {
                            dropHandlers.cancelDrop();
                        }
                    });
                }
            }
        };
        me.callParent();
    },
    listeners: {
        checkchange: 'checkChild'
        //checkchange: function (node, state) {
        //    if (node.hasChildNodes()) {
        //        for (var i = 0; i < node.childNodes.length; i++) {
        //            node.childNodes[i].set('checked', state);
        //        }
        //        node.eachChild(function (child) {
        //            child.set('checked', state);
        //        });
        //    }
        //}
    }
});
