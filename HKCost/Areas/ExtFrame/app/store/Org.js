Ext.define('ExtFrame.store.Org', {
    extend: 'Ext.data.Store',//Ext.data.TreeStore
    requires: ['ExtFrame.model.Org'],
    model: 'ExtFrame.model.Org',
    autoLoad: true
});

