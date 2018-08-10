Ext.define('ExtFrame.view.main.studentManager.StudentList', {
    extend: 'Ext.grid.GridPanel',
    requires: ['ExtFrame.view.main.studentManager.StudentListController'],
    controller: 'studentList',
    alias: 'widget.studentgrid',
    stripeRows: true,
    initComponent: function () {
        /********************** 根据具体业务需要适当修改 ***********************/
        var me = this;
        var need_select = false;
        me.store = Ext.create('ExtFrame.store.Student'),
        me.dockedItems = [{
            xtype: 'gridtoolbar',
            dock: 'top'
        }, {
            xtype: 'pagingtoolbar',
            store: me.store,
            dock: 'bottom',
            displayInfo: true,
            items: [
                '-', {
                    cls: 'x-btn-text-icon details'
                }
            ]
        }];
        me.columns = [
             { text: 'ID', dataIndex: 'id' },
             { text: 'Name', dataIndex: 'name' },
             { text: 'Email', dataIndex: 'email', flex: 1 },
             { text: 'Phone', dataIndex: 'phone' }
        ];
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
            }//,
            //listeners: {
            //    deselect: function (model, record, index) {//取消选中时产生的事件
            //    },
            //    select: function (model, record, index) {//record被选中时产生的事件
            //        var selectName = record.get('name');//选中的人员名称
            //        alert(selectName);
            //    },
            //    selectionchange: function (model, selected) {//选择有改变时产生的事件
            //        var records = model.getSelection();
            //        if (records != '') {
            //            for (var i in records) {
            //                records[i].get('name')//选中的人员名称（方法一）
            //            }
            //        }
            //
            //        if (selected != '') {
            //            for (var p in selected) {
            //                selected[p].get('name') //选中的人员名称（方法二）
            //            }
            //        }
            //    }
            //}
        });//添加复选框列  如果不想有复选框是需要把selModel换成Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"})就ok了
        me.callParent();
    }
});
