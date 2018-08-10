Ext.define('ExtFrame.view.main.sys.buttonsManager.ButtonsManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.buttonsManager',

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
        Tools.GridSearchToolbar.SaveEncap(this, Tools.Method.getAPiRootPath()+'/api/ButtonsManager/PostSave?ct=json');
    },
    onClickButtonDel: function () {
        Tools.GridSearchToolbar.DeleteByOIDEncap(this, Tools.Method.getAPiRootPath()+'/api/ButtonsManager/Delete?ct=json');
    },
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    }
});