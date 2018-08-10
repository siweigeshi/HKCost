Ext.define('ExtFrame.view.main.cms.articleManager.ArticleGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.articlegrid',
    fit: true,
    stripeRows: true,
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
             { text: '文章标题', dataIndex: 'ArticleTitle', searchable: true, width: 300, fieldType: 'string' },
              {
                  text: '文章类型', dataIndex: 'ArticleCategory', width: 150, fieldType: 'string', renderer: function (v) {
                      if (v!=null) {
                          return v.Name;
                      }
                  }
              },
             { text: '文章摘要', dataIndex: 'ArticleAbstract', fieldType: 'string' },
             { text: '调用别名', dataIndex: 'CallIndex', fieldType: 'string' },
             { text: '文章作者', dataIndex: 'ArticleAuthor', searchable: true, fieldType: 'string' },
             { text: '文章来源', dataIndex: 'ArticleSource', searchable: true, width: 180, fieldType: 'string' },
              { text: '文章来源路径', dataIndex: 'ArticleUrl', width: 200, fieldType: 'string' },
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
                 text: '发布时间', dataIndex: 'PublishTime', renderer: function (v) {
                     if (v != undefined && v != '' && v.length >= 10) {
                         return v.substr(0, 10);
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
                url: Tools.Method.getAPiRootPath() + '/api/Article/GetArticleList?ct=json',
                reader: {
                    type: 'json',
                    rootProperty: 'ArticleList',//数据根节点名称
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
        me.dockedItems = [{
            xtype: 'gridsearchtoolbar',
            itemId: 'gridtoolbar',
            hasSearch: true,
            eName: me.eName,//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            searchCols: me.columns.filter(function (col) {
                return col.searchable;
            }),
            dock: 'top',
            items: [{
                xtype: 'treepicker',
                itemId: 'CategoryPicker',
                fieldLabel: '文章类型',
                displayField: 'Name',
                valueField: 'OID',
                forceSelection: true,// 只能选择下拉框里面的内容
                emptyText: '请选择',
                blankText: '请选择',// 该项如果没有选择，则提示错误信息
                rootVisible: false,
                labelWidth: 80,
                valid: true,
                initComponent: function () {
                    var treepicker = this;
                    treepicker.store = Ext.create('Ext.data.TreeStore', {
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
                            url: Tools.Method.getAPiRootPath() + '/api/ArticleCategory/GetTreeList?ct=json',
                            reader: {
                                type: 'json',
                                rootproperty: 'children',//数据根节点名称
                            }
                        },
                        clearOnLoad: true,
                        nodeParam: 'PID'
                    });
                    treepicker.callParent();
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
        me.callParent();
    }
});
