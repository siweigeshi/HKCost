Ext.define('ExtFrame.store.ModuleTree', {
    extend: 'Ext.data.TreeStore',//Ext.data.TreeStore
    requires: ['ExtFrame.model.Module'],
    model: 'ExtFrame.model.Module',
    autoLoad: true
});