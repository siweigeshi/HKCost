Ext.define('ExtFrame.store.OrgTree', {
    extend: 'Ext.data.TreeStore',//Ext.data.TreeStore
    requires: ['ExtFrame.model.Org'],
    model: 'ExtFrame.model.Org',
    autoLoad: true
});