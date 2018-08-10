Ext.define('ExtFrame.view.main.jurisdiction.orgRoleManager.RoleGrid', {
    extend: 'Ext.grid.GridPanel',
    alias: 'widget.roleGrid',
    fit: true,
    stripeRows: true,
    initComponent: function () {
        var me = this;
        var need_select = false;
        /********************** 根据具体业务需要适当修改 ***********************/
        var pageSize = 9999;//分页条数
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
             { text: '编号', dataIndex: 'Code', flex: 1, searchable: true, fieldType: 'string' },
             { text: '名称', dataIndex: 'Name', flex: 1, searchable: true, fieldType: 'string' },
             {
                 text: '状态', dataIndex: 'State', flex: 1, renderer: function (v) {
                     if (v == 1) {
                         return '停用';
                     }
                     else if (v == 0) {
                         return '正常';
                     }
                 }
             },
             {
                 text: '所属组织机构', dataIndex: 'Orgs', flex: 5, renderer: function (v) {
                 var text = '';
                 $.each(v, function (index, Org) {
                     text += Org.Name + '&nbsp;&nbsp;';
                 });
                 return text;
             }}
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
                url: Tools.Method.getAPiRootPath()+"/api/RoleManager/GetRoleList?ct=json&type=uor",
                reader: {
                    type: 'json',
                    rootProperty: 'roles',//数据根节点名称
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
            eName: 'OrgRoleManager',//搜索栏父级grid 对应类名称，用于GridSearchToolbar查找父级grid对象
            searchEx: false,//扩展查询，当为true时，查询控件会自动构造sql语句的整个语句
            searchCols: me.columns.filter(function (col) {
                return col.searchable;
            }),
            dock: 'top',
            items: []
        }];
        /********************** 根据具体业务需要适当修改 ***********************/

        me.on('beforecellclick', function (sender, td, cellIndex, record, tr, rowIndex, e) {
            if (cellIndex == 0) {
                need_select = true;
                e.stopEvent();
                if (me.selModel.isSelected(record))
                    me.selModel.doDeselect(record, false);
                else
                    me.selModel.doSelect(record, true);
            }
            return true;
        });
        function select_deselect(model, record, index) {
            index = me.store.indexOf(record);

            me.getView().focusRow(index);
            if (need_select) {
                if (need_select != 'all' || (need_select == 'all' && me.view.all.count - 1 == index)) {
                    need_select = false;
                }
                return true;
            }
            return false;
        };
        me.on('beforeselect', select_deselect);
        me.on('beforedeselect', select_deselect);
        me.selModel = Ext.create('Ext.selection.CheckboxModel', {
            mode: 'SIMPLE',//multi,simple,single；默认为多选multi
            injectCheckbox: 0,//checkbox位于哪一列，默认值为0
            checkOnly: true,//如果值为true，则只用点击checkbox列才能选中此条记录
            enableKeyNav: true,
            onKeySpace: function (e) {
                need_select = true;

                var record = e.record || this.lastFocused;
                if (record) {
                    this.afterKeyNavigate(e, record);
                }
            },
            onHeaderClick: function (headerCt, header, e) {
                need_select = 'all';
                if (header.isCheckerHd) {
                    e.stopEvent();
                    var me = this,
                        isChecked = header.el.hasCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');

                    me.preventFocus = true;
                    if (isChecked) {
                        me.deselectAll();
                    } else {
                        me.selectAll();
                    }
                    delete me.preventFocus;
                }
            }
        });//添加复选框列  如果不想有复选框是需要把selModel换成Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"})就ok了
        me.callParent();
    }
});
