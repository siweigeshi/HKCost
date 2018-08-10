Ext.define('ExtFrame.model.Role', {
    extend: 'Ext.data.Model',
    fields: ['OID', 'Code', 'Name', 'State', 'CreateTime']
    //,hasMany: { model: 'Permission', name: 'gePermissions', autoLoad: false },
});