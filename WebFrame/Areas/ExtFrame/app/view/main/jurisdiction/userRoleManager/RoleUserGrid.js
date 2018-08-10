Ext.define('ExtFrame.view.main.jurisdiction.userRoleManager.RoleUserGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.roleUserGrid',
    fit: true,
    stripeRows: true,
    selType: 'checkboxmodel',
    initComponent: function () {
        var me = this;
        var need_select = false;
        /********************** 根据具体业务需要适当修改 ***********************/
        var pageSize = 9999999;//分页条数
        var OrderField = 'base_roleinfo.CreateTime';//默认排序字段
        var OrderType = 'DESC';//默认排序类型 ASC/DESC
        /*
        ** grid控件绑定列
        ** text: 前台显示文字, dataIndex: 数据绑定字段, sortable: 能否排序（缺省值为true）
        ** searchable: 能否查询（缺省值为false）
        ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
           其中string类型使用'like'关键字查询，其余的使用'='关键字查询）
        */
        me.columns = [
             { text: '编号', dataIndex: 'Code', searchable: true, sortable: false, fieldType: 'string' },
             { text: '名称', dataIndex: 'Name', searchable: true, sortable: false, fieldType: 'string' },
             {
                 text: '状态', dataIndex: 'State', sortable: false, renderer: function (v) {
                     if (v == 1) {
                         return '停用';
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             },
             {
                 text: '所属组织机构', dataIndex: 'Orgs', width: 300, sortable: false, renderer: function (v) {
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
                url: Tools.Method.getAPiRootPath() + "/api/RoleManager/GetRoleList?ct=json",
                reader: {
                    type: 'json',
                    rootProperty: 'roles',//数据根节点名称
                    totalProerty: 'total',//数据总数节点名称
                    idProperty: 'OID'//id标示节点名称
                },
                //扩展参数
                extraParams: {
                    'swhere': "",
                    'type': "org"
                },
                listeners: {
                    //捕捉异常处理
                    exception: function (theproxy, response, operation, options) {
                        Tools.Method.ExceptionEncap(response);
                    }
                }
            }
        });
        //grid 停靠item
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            itemId: 'searchtoolbar',
            eName: me.eName,//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            searchEx: true,//扩展查询，当为true时，查询控件会自动构造sql语句的整个语句
            dock: 'top',
            hasSearch: false,
            hasBtn: false,
            items: []
        }];
        /********************** 根据具体业务需要适当修改 ***********************/
        me.callParent();
    }
});
