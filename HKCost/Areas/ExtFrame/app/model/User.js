Ext.define('ExtFrame.model.User', {
    extend: 'Ext.data.Model',
    idProperty: 'OID',
    fields: ['OID', 'Name', 'UserName', 'UserPwd', 'State', 'CreateTime'],
    manyToMany: 'Org'
    //hasMany: [{
    //    name: 'Orgs',
    //    reference: 'ExtFrame.model.Org',
    //    model: 'ExtFrame.model.Org'
        
    //}]
});