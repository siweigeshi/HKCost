Ext.define('ExtFrame.view.main.teacherManager.TeacherList', {
    extend: 'Ext.grid.GridPanel',
    requires: ['ExtFrame.view.main.teacherManager.TeacherListController'],
    controller: 'teacherList',
    alias: 'widget.teachergrid',

    dockedItems: [{
        xtype: 'gridtoolbar',
        dock: 'top'
    }],
    columns: [
         { text: 'Name', dataIndex: 'name' },
         { text: 'Email', dataIndex: 'email', flex: 1 },
         { text: 'Phone', dataIndex: 'phone' }
    ],
    stripeRows: true,
    selModel: Ext.create('Ext.selection.CheckboxModel', { mode: "SIMPLE" }),//添加复选框列  如果不想有复选框是需要把selModel换成Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"})就ok了
    
    store: Ext.create('Ext.data.Store',
    {
        fields: ['name', 'email', 'phone'],
        data: {
          'items': [
		   { 'id': '1', 'name': 'LisaT', "email": "lisa@simpsons.com", "phone": "555-111-1224" },
	       { 'id': '2', 'name': 'BartT', "email": "bart@simpsons.com", "phone": "555-222-1234" },
	       { 'id': '3', 'name': 'HomerT', "email": "homer@simpsons.com", "phone": "555-222-1244" },
	       { 'id': '4', 'name': 'MargeT', "email": "marge@simpsons.com", "phone": "555-222-1254" }
          ]
        },
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                rootProperty: 'items'
            }
        }
    })
});