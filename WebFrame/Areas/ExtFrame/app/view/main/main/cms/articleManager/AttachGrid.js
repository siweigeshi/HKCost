Ext.define('ExtFrame.view.main.cms.articleManager.AttachGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.attachgrid',
    selType: 'checkboxmodel',
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
             { text: '文件名称', dataIndex: 'FileName', searchable: true,flex:4, fieldType: 'string' },
             { text: '文件扩展名', dataIndex: 'FileExt', flex: 1, fieldType: 'string' },
             {
                 text: '操作', fieldType: 'string', align: 'center', flex: 1, xtype: 'actioncolumn',
                 items: [{
                     icon: '/Areas/ExtFrame/ico/delete.gif',
                     tooltip: '删除',
                     handler: 'onClickOperationDelete',
                 }]
             }
        ];

        //构造grid store
        me.store = Ext.create('Ext.data.Store', {
            model: 'Ext.data.Model',
            pageSize: pageSize,
            extend: 'Ext.data.ArrayStore',
            model: 'Ext.data.Model',
            data: me.AttachData,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'AttachInfo',//数据根节点名称
                    totalProerty: 'total',//数据总数节点名称
                    idProperty: 'OID'//id标示节点名称
                }
            }
        });
        me.callParent();
    }
});
