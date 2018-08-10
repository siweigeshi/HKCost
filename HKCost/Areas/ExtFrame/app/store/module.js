Ext.define('ExtFrame.store.Module', {
    extend: 'Ext.data.Store',
    requires: ['ExtFrame.model.Module'],
    model: 'ExtFrame.model.Module',
    autoLoad: true
});