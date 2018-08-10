Ext.define('ExtFrame.view.main.sys.dictionaryManager.DictionaryGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.dictionarygrid',
    fit: true,
    stripeRows: true,
    selType: 'checkboxmodel',
    initComponent: function () {
        var me = this;
        var need_select = false;
        /********************** 根据具体业务需要适当修改 ***********************/
        var pageSize = 10;//分页条数
        var OrderField = 'FILENAME';//默认排序字段
        var OrderType = 'DESC';//默认排序类型 ASC/DESC
        /*
        ** grid控件绑定列
        ** text: 前台显示文字, dataIndex: 数据绑定字段, sortable: 能否排序（缺省值为true）
        ** searchable: 能否查询（缺省值为false）
        ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
           其中string类型使用'like'关键字查询，其余的使用'='关键字查询）
        */
        me.columns = [
             { text: 'OID', dataIndex: 'OID', searchable: true, fieldType: 'string', hidden: true },
             { text: '说明', dataIndex: 'TITLE', searchable: true, fieldType: 'string' },
             { text: '对应字段', dataIndex: 'FILENAME', searchable: true, fieldType: 'string' },
             { text: '内容', dataIndex: 'CONTENT', searchable: true, fieldType: 'string' },
             {
                 text: '状态', dataIndex: 'STATE', renderer: function (v) {
                     if (v == 1) {
                         return '停用';
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             }, {
                 text: '下拉框演示', dataIndex: 'CONTENT', renderer: function (v) {
                     var strHtml = '<select>';
                     var selectList = v.split(',');
                     for (var i = 0; i < selectList.length; i++) {
                         strHtml += ' <option value="' + selectList[i].split('|')[1] + '">' + selectList[i].split('|')[0] + '</option>';
                     }
                     strHtml += '</select>';
                     return strHtml;
                 }
             }, { text: '备注', dataIndex: 'REMARK', width: 220 }
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
                url: Tools.Method.getAPiRootPath() + '/api/DictionaryManager/GetModelsList?ct=json&type=',
                reader: {
                    type: 'json',
                    rootProperty: 'dictionarys',//数据根节点名称
                    totalProerty: 'total',//数据总数节点名称
                    idProperty: 'OID'//id标示节点名称
                },
                //扩展参数
                extraParams: {
                    'swhere': ""
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
            searchCols: me.columns.filter(function (col) {
                return col.searchable;
            }),
            dock: 'top',
            items: []
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
