Ext.define('ExtFrame.store.Dictionary', {
    extend: 'Ext.data.Store',
    requires: ['ExtFrame.model.Dictionary'],
    model: 'ExtFrame.model.Dictionary',
    autoLoad: true
});