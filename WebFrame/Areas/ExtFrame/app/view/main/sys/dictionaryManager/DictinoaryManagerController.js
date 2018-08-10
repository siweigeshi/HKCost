Ext.define('ExtFrame.view.main.sys.dictionaryManager.DictinoaryManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dictionaryManager',

    onClickButtonLook: function () {
        Tools.GridSearchToolbar.LookEncap(this);
        var grid = Ext.getCmp('showSelect');
        var store = grid.getStore();
        store.removeAll();
        Ext.getCmp('showSelect').setValue("");
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getSelection();//获取grid选中行records
        if (selectRecords[0].data.CONTENT!='') {
            var str = selectRecords[0].data.CONTENT.split(',');
            for (var i = str.length - 1; i >= 0; i--) {
                var r = Ext.create('data', { name: str[i].split('|')[0], abbr: str[i].split('|')[1] });//这里的数据如果是用户输入的话，只需要换成那个文本框的值就行了，val: Ext.getCmp('xxxid号').getValue()
                cData.insert(0, r);
                if (i == 0) {
                    Ext.getCmp('showSelect').setValue(str[i].split('|')[1]);
                }
            }
        }
    },
    onClickButtonAdd: function () {
        Tools.GridSearchToolbar.AddEncap(this);
        var grid = Ext.getCmp('showSelect');
        var store = grid.getStore();
        store.removeAll();
        Ext.getCmp('showSelect').setValue("");
    },
    onClickButtonEdit: function () {
        Tools.GridSearchToolbar.EditEncap(this);
        var grid = Ext.getCmp('showSelect');
        var store = grid.getStore();
        store.removeAll();
        Ext.getCmp('showSelect').setValue("");
        var view = this.getView();
        var pnGrid = view.down('#' + view.eName + 'Grid');//获取当前grid控件
        var selectRecords = pnGrid.getSelection();//获取grid选中行records
        if (selectRecords[0].data.CONTENT!='') {
            var str = selectRecords[0].data.CONTENT.split(',');
            for (var i = str.length - 1; i >= 0; i--) {
                var r = Ext.create('data', { name: str[i].split('|')[0], abbr: str[i].split('|')[1] });//这里的数据如果是用户输入的话，只需要换成那个文本框的值就行了，val: Ext.getCmp('xxxid号').getValue()
                cData.insert(0, r);
                if (i == 0) {
                    Ext.getCmp('showSelect').setValue(str[i].split('|')[1]);
                }
            }
        }
    },
    onClickButtonSave: function () {
        if (!Tools.Method.IsLogin())
            return;
        var view = this.getView();
        var form = view.down('#' + view.eName + 'Form');
        if (form.isValid()) {
            var record = view.getViewModel().getData().rec;
            var content = '';
            var grid = Ext.getCmp('showSelect');
            var store = grid.getStore();
            for (var i = 0; i < store.getCount() ; i++) {
                content += store.getAt(i).data.name + '|' + store.getAt(i).data.abbr+',';
            }
            if (content=='') {
                Tools.Method.ShowTipsMsg('请添加下拉框的值', '2000', '3', null);
                return false;
            }
            record.CONTENT = content.substring(0, content.length - 1);
            var pnGrid = view.down('#' + view.eName + 'Grid');
            var data = Tools.Method.GetPostData(Ext.encode(record));
            if (record) {
                store.removeAll();
                Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/DictionaryManager/PostSave?ct=json', 'POST', data, true, function (jsonData) {
                    if (jsonData) {
                        view.down('#' + view.eName + 'Form').getForm().reset();
                        view.getViewModel().getData().rec = null;
                        Tools.Method.ShowTipsMsg(Tools.Msg.MSG0006, '4000', '1', null);
                        pnGrid.store.reload()
                    } else {
                        Tools.Method.ShowTipsMsg(Tools.Msg.MSG0022, '4000', '2', null);//修改失败
                    }
                });
            } else {
                Ext.MessageBox.alert('提示', '请先填写数据！');
            }
        }
    },
    onClickButtonDel: function () {
        Tools.GridSearchToolbar.DeleteByOIDEncap(this, Tools.Method.getAPiRootPath() + '/api/DictionaryManager/Delete?ct=json');
    },
    onClickSearch: function () {
        Tools.GridSearchToolbar.SearchEncap(this);
    }
});