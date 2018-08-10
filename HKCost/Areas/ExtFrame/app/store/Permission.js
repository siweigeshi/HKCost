Ext.define('ExtFrame.store.Permission', {
    extend: 'Ext.data.Store',
    requires: ['ExtFrame.model.Permission'],
    model: 'ExtFrame.model.Permission',
    autoLoad: true
});