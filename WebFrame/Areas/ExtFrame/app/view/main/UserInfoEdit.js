Ext.define('ExtFrame.view.main.UserInfoEdit', {
    requires: ['ExtFrame.view.main.sys.userManager.UserManagerModel', 'ExtFrame.view.main.UserInfoController', 'ExtFrame.view.extEncap.UEditor'],
    extend: 'Ext.window.Window',
    controller: 'userInfoController',
    viewModel: { type: 'userManagerModel' },
    resizable: false,
    modal: true,
    //draggable: false,
    autoShow: true,
    width: 300,
    title: '更新用户基本信息',
    glyph: 'xf007@FontAwesome',
    buttons: [{
        name: 'registbutton',
        text: '确定',
        glyph: 'xf118@FontAwesome',
        listeners: {
            click: 'onChangeInfoClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
        }
    }],
    initComponent: function () {
        //获取字典值通过状态（是：0；否：1）数据
        if ($.data(ExtCacheData, 'SEX') == undefined) {
            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/base/GetDicList?ct=json&fileName=SEX', 'GET', null, false, function (jsonData) {
                if (jsonData)
                    $.data(ExtCacheData, 'SEX', jsonData);
            });
        }
        var me = this;
        me.items = [{
            xtype: 'form',//父窗体
            reference: 'form',
            itemId: 'UserEditForm',
            scrollable: true,
            height: 100,
            defaults: {
                bodyPadding: 3
            },
            fieldDefaults: {
                labelAlign: 'right'
            },
            items: [{
                layout: 'column',
                itemId: 'column1',
                items: [{
                    xtype: 'hiddenfield',
                    itemId: 'hfOID',//注意，此itemId要写固定，functionjs中重置from有用到
                    name: 'OID',
                    bind: '{rec.OID}'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: '用户名',
                    name: 'UserName',
                    bind: '{rec.UserName}'
                }]
            }, {
                layout: 'column',
                itemId: 'column2',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: '邮箱',
                    itemId:'Email',
                    name: 'EMAIL',
                    bind: '{rec.EMAIL}',
                    labelWidth: 90
                    //listeners: {
                    //    change: function (me, newValue, oldValue, eOpts) {
                    //        if (newValue == '' || newValue == null) {
                    //            return;
                    //        } else if (!Tools.Method.StrValidEncap(newValue, 'email')) {
                    //            valid = "邮箱格式不正确";
                    //        } else {
                    //            var OID = me.OID;
                    //            Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/UserManager/GetIsExist?ct=json&OID=' + OID + '&col=EMAIL&val=' + newValue, 'GET', null, false, function (jsonData) {
                    //                if (jsonData) {
                    //                    valid = "邮箱已存在，请更换";
                    //                }
                    //                else {
                    //                    valid = true;
                    //                }
                    //            });
                    //        }
                    //        me.validation = valid;
                    //    }
                    //}
                }]
            }, {
                layout: 'column',
                itemId: 'column3',
                items: [{
                    xtype: 'textfield',
                    allowBlank: false,
                    emptyText: '请填写姓名',
                    fieldLabel: '姓名',
                    name: 'Name',
                    bind: '{rec.Name}',
                    maxLength: 16,
                    labelWidth: 90
                }]
            }]
        }]
        this.callParent();
        var CurUser = Ext.decode($.cookie('CurUser'));
        Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/Base/PostUserByOID?ct=json', 'POST', { 'OID': CurUser[0] }, true, function (jsonData) {
            me.down('#UserEditForm').down('#column2').down('#Email').OID = jsonData.OID;
            me.down('#UserEditForm').getForm().setValues(jsonData);
        });
    }
});