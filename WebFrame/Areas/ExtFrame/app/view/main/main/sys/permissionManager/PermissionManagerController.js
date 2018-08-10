Ext.define('ExtFrame.view.main.sys.permissionManager.PermissionManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.permissionManager',

    onClickButtonLook: function () {
        Tools.GridSearchToolbar.LookEncap(this);
    },
    onClickButtonAdd: function () {
        Tools.GridSearchToolbar.AddEncap(this);
    },
    onClickButtonEdit: function () {
        Tools.GridSearchToolbar.EditEncap(this);
    },
    onClickButtonSave: function () {
        Tools.GridSearchToolbar.SaveEncap(this, Tools.Method.getAPiRootPath()+'/api/PermissionManager/PostSave?ct=json');
    },
    onClickButtonDel: function () {
        Tools.GridSearchToolbar.DeleteByOIDEncap(this, Tools.Method.getAPiRootPath()+'/api/PermissionManager/Delete?ct=json');
    },
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    }
});