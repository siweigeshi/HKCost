Ext.define('ExtFrame.view.main.jurisdiction.userRoleManager.UserRoleGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.userRoleGrid',
    fit: true,
    stripeRows: true,
    selType: 'checkboxmodel',
    listeners: {
        selectionchange: function (me, selected, eOpts) {
            var selecttionUser = me.getSelection();
            var roleUserGrid = Ext.getCmp("RoleUserGrid");
            if (me.getSelection().length == 1) {
                var roles = me.getSelection()[0].data.Roles;
                $.each(roleUserGrid.store.data.items, function (index, record) {
                    $.each(roles, function (index, role) {
                        if (role.OID == record.data.OID) {
                            roleUserGrid.selModel.select(record, true, true);
                        }
                    });
                });
            } else {
                $.each(roleUserGrid.store.data.items, function (index, record) {
                    roleUserGrid.selModel.deselect(record, true);
                });
            }
        }
    },
    initComponent: function () {
        var me = this;
        var need_select = false;
        /********************** 根据具体业务需要适当修改 ***********************/
        var pageSize = 10;//分页条数
        var OrderField = 'base_userinfo.CreateTime';//默认排序字段
        var OrderType = 'DESC';//默认排序类型 ASC/DESC
        /*
        ** grid控件绑定列
        ** text: 前台显示文字, dataIndex: 数据绑定字段, sortable: 能否排序（缺省值为true）
        ** searchable: 能否查询（缺省值为false）
        ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
           其中string类型使用'like'关键字查询，其余的使用'='关键字查询）
        */
        me.columns = [
             { text: 'No.', xtype: 'rownumberer', width: 30 },
             { text: 'OID', dataIndex: 'OID', hidden: true },
             { text: '姓名', dataIndex: 'Name', searchable: true, sortable: false, fieldType: 'string' },
             { text: '用户名', dataIndex: 'UserName', searchable: true, sortable: false, fieldType: 'string' },
             {
                 text: '状态', dataIndex: 'State', sortable: false, renderer: function (v) {
                     if (v == 1) {
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             },
             {
                 text: '所属组织机构', dataIndex: 'Orgs', flex: 3, sortable: false, renderer: function (v) {
                     var value = "";
                     if (v != null) {
                         $.each(v, function (i, o) {
                             value += o.Name + ",";
                         });
                         value = value.substring(0, value.length - 1);
                         return value;
                     }
                 }
             },
             {
                 text: '拥有角色', dataIndex: 'Roles', flex: 5, sortable: false, renderer: function (v) {
                     var value = "";
                     if (v != null) {
                         $.each(v, function (i, o) {
                             value += o.Name + ",";
                         });
                         value = value.substring(0, value.length - 1);
                         return value;
                     }
                 }
             }
        ];
        //构造grid store
        me.store = Ext.create('Ext.data.Store', {
            model: 'Ext.data.Model',
            autoLoad: true,
            pageSize: pageSize,
            remoteSort: true,
            sortOnLoad: true,
            sorters: { property: OrderField, direction: OrderType },
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath() + "/api/UserManager/GetUserList?ct=json",
                reader: {
                    type: 'json',
                    rootProperty: 'users',//数据根节点名称
                    totalProerty: 'total',//数据总数节点名称
                    idProperty: 'OID'//id标示节点名称
                },
                //扩展参数
                extraParams: {
                    'swhere': "",
                    'type': 'org'
                },
                listeners: {
                    //捕捉异常处理
                    exception: function (theproxy, response, operation, options) {
                        Tools.Method.ExceptionEncap(response);
                    }
                }
            },
            listeners: {
                beforeload: function (store, operation, eOpts) {
                    var aaa = store;
                },
            }
        });
        //grid 停靠item
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            itemId: 'searchtoolbar',
            eName: me.eName,//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            searchEx: false,//扩展查询，当为true时，查询控件会自动构造sql语句的整个语句
            searchCols: me.columns.filter(function (col) {
                return col.searchable;
            }),
            dock: 'top',
            items: [{
                xtype: 'treepicker',
                itemId: 'orgPicker',
                fieldLabel: '选择组织机构',
                displayField: 'Name',
                valueField: 'OID',
                forceSelection: true,// 只能选择下拉框里面的内容
                emptyText: '请选择组织机构',
                allowBlank: false,// 不允许为空
                blankText: '请选择组织机构',// 该项如果没有选择，则提示错误信息
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
                        //选择的组织机构id
                        var orgid = record.getData().OID;
                        var type = "org";
                        var rtype = "org";
                        var swhere = "OID|STRING|" + orgid + "|=";
                        var rwhere = swhere;
                        //alert(orgid);
                        if (orgid == "4ED05627-65A3-4692-9199-95D21CB86650") { //如果选择的是公司机构) {
                            swhere = rwhere = "";
                        }
                        var userGrid = me.up("#UserRoleManagerGrid");
                        var roleGrid = userGrid.up("#tab-UserRoleManager-grid").down("#RoleUserGrid");
                        //带附加参数重构grid store数据
                        userGrid.store.getProxy().extraParams = {
                            "swhere": swhere,
                            'type': type
                        };
                        //重新加载grid
                        userGrid.store.reload();
                        roleGrid.store.getProxy().extraParams = {
                            "swhere": rwhere,
                            'type': rtype
                        };
                        roleGrid.store.reload();
                    }
                }
            }]
        }, {
            xtype: 'pagingtoolbar',
            store: me.store,//分页控件数据（同grid的数据保持一致）
            dock: 'bottom',
            displayInfo: true,
            items: [
                '-', {
                    cls: 'x-btn-text-icon details'
                }
            ]
        }];
        /********************** 根据具体业务需要适当修改 ***********************/
        me.callParent();
    }
});
