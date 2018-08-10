Ext.define('ExtFrame.view.main.jurisdiction.orgRoleManager.OrgTreeGrid', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'ExtFrame.view.main.jurisdiction.orgRoleManager.OrgRoleManagerController'
    ],
    alias: 'widget.orgTreeGrid',
    controller: 'orgRoleManager',
    reserveScrollbar: true,
    rootVisible: false,
    fit: true,
    stripeRows: true,
    listeners:{
        selectionchange: function (me, selected, eOpts) {
            var roleGrid = Ext.getCmp("OrgRoleManagerGrid");
            if (selected.length == 1) {
                Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()+'/api/OrgManager/GetOrgList?ct=json&orgId=' + selected[0].data.OID + '&type=one', 'GET', null, true, function (jsonData) {
                    $.each(roleGrid.store.data.items, function (index, record) {
                        $.each(jsonData.Roles, function (index, Roles) {
                            if (Roles.OID == record.data.OID) {
                                roleGrid.selModel.select(record, true, true);
                            }
                        });
                    });
                });
            }
            else {
                $.each(roleGrid.store.data.items, function (index, record) {
                    roleGrid.selModel.deselect(record, true);
                });
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Ext.data.TreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath()+'/api/OrgManager/GetOrgList?ct=json&type=all',
                //扩展参数
                extraParams: {
                    'orgId': '00000000-0000-0000-0000-000000000000'
                }
            },
            folderSort: true
        }),

        me.columns = [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: '名称',
            //flex: 1.5,
            width: 200,
            dataIndex: 'Name'
        }]

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
            mode: 'single',//multi,simple,single；默认为多选multi
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