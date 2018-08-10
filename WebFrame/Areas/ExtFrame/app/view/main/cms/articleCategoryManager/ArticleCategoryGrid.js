Ext.define('ExtFrame.view.main.cms.articleCategoryManager.ArticleCategoryGrid', {
    alias: 'widget.articlecategorygrid',
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn'
    ],
    fit: true,
    reserveScrollbar: true,
    rootVisible: false,
    stripeRows: true,
    initComponent: function () {
        var me = this;
        var need_select = false;
        /********************** 根据具体业务需要适当修改 ***********************/
        var pageSize = 10;//分页条数
        var OrderField = 'CreateTime';//默认排序字段
        var OrderType = 'DESC';//默认排序类型 ASC/DESC
        /*
        ** grid控件绑定列
        ** text: 前台显示文字, dataIndex: 数据绑定字段, sortable: 能否排序（缺省值为true）
        ** searchable: 能否查询（缺省值为false）
        ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
           其中string类型使用'like'关键字查询，其余的使用'='关键字查询）
        */
        me.columns = [
             { text: 'OID', dataIndex: 'OID', hidden: true },
             { text: '类型名称', dataIndex: 'Name', searchable: true, xtype: 'treecolumn', width: 300, fieldType: 'string' },
             { text: '调用别名', dataIndex: 'CallIndex', fieldType: 'string' },
             { text: 'SeoDescription', dataIndex: 'SeoDescription', fieldType: 'string' },
             { text: 'SeoKeyword', dataIndex: 'SeoKeyword', fieldType: 'string' },
             { text: 'SeoTitle', dataIndex: 'SeoTitle', fieldType: 'string' },
             {
                 text: '状态', dataIndex: 'State', renderer: function (v) {
                     if (v == 1) {
                         return '停用';
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             },
             {
                 text: '创建时间', dataIndex: 'CreateTime', renderer: function (v) {
                     if (v != undefined && v != '' && v.length >= 10) {
                         return v.substr(0, 10);
                     }
                 }
             }
        ];
        Tools.Grid.CreateOperationBtn(me, me.eName);
        //构造grid store
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Ext.data.TreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath() + "/api/ArticleCategory/GetAllForTree?ct=json",
                folderSort: false
            }
        });
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            itemId: 'gridtoolbar',
            hasSearch: false,
            eName: me.eName,//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            dock: 'top',
            items: []
        }];
        me.callParent();
    },
    listeners: {
        checkchange: 'checkChild'
    }
});
