Ext.define('ExtFrame.store.Student', {
    extend: 'Ext.data.Store',
    requires: ['ExtFrame.model.Student'],
    model: 'ExtFrame.model.Student',
    autoLoad: true,
    pageSize: 4,
    proxy: {
        type: 'ajax',
        url: 'data/students.json',
        reader: {
            type: 'json',
            rootProperty: 'students',
            totalProerty: 'total',
            idProperty: 'id'
        }
    }
});