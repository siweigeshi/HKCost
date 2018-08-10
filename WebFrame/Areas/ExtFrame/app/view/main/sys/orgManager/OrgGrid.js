Ext.define('ExtFrame.view.main.sys.orgManager.OrgGrid', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'ExtFrame.view.extEncap.plugin.TreeViewDragDrop'
    ],
    alias: 'widget.orggrid',
    fit: true,
    reserveScrollbar: true,
    root:'child',
    rootVisible: false,
    stripeRows: false,
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
             { text: '名称', dataIndex: 'Name', xtype: 'treecolumn', flex: 3 },
             { text: '英文名称', dataIndex: 'EnglishName', flex: 2 },
             { text: '机构编号', dataIndex: 'Code', flex: 2 },
             {
                 text: '机构级别', dataIndex: 'Level', flex: 1, renderer: function (v) {
                     if (v == 0) {
                         return '省级';
                     }
                     else if (v == 1) {
                         return '市级';
                     }
                     else if (v == 2) {
                         return '县级';
                     } else {
                         return v;
                     }
                 }
             },
             {
                 text: '状态', dataIndex: 'State', flex: 1, renderer: function (v) {
                     if (v == 1) {
                         return '停用';
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             }
        ];
        Tools.Grid.CreateOperationBtn(me, 'OrgManager');
        //构造grid store
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Ext.data.TreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath() + "/api/OrgManager/GetOrgListForTreegrid?ct=json&orgId=00000000-0000-0000-0000-000000000000",
                folderSort: true,
            }
        });
        //grid 停靠item
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            itemId: 'searchtoolbar',
            hasSearch: false,
            eName: me.eName,//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            dock: 'top',
            items: []
        }];
        me.viewConfig = {
            plugins: {
                ptype: 'treeviewdragdropdiy',
                //displayField: 'Name',
                isAppentToLeafNode: true,//允许添加到叶子节点
                containerScroll: true
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
                    var msg = Tools.Method.StrFormat(typeStr, [data.records[0].getData().Name, overModel.getData().Name]);
                    var targetOID = overModel.id == 'root' ? '00000000-0000-0000-0000-000000000000' : overModel.getData().OID;
                    var data = Tools.Method.GetPostData(Ext.encode({ dropOID: data.records[0].getData().OID, targetOID: targetOID, dropPosition: dropPosition }), true);
                    Ext.MessageBox.confirm('提示', msg, function (btn) {
                        if (btn === 'yes' && msg.indexOf('不合法') < 0) {
                            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/OrgManager/PostDrop?ct=json', 'POST', data, false, function (jsonData) {
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
    }
});
