Ext.define('ExtFrame.store.User', {
    extend: 'Ext.data.Store',
    requires: ['ExtFrame.model.User'],
    model: 'ExtFrame.model.User',
    autoLoad: true
});