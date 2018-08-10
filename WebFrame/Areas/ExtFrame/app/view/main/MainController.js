/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('ExtFrame.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    //requires: [
    //    'Ext.MessageBox'
    //],
    alias: 'controller.main',
    constructor: function () { },
    onClickButton: function () {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },
    onShowLogin: function () {
        this.fireViewEvent('onShowLogin');
    },
    onIndexClick: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var pnCenter = Ext.getCmp('main-tabpanel');//获取主页面tabpanel对象
        pnCenter.setActiveTab('tab-index');
    },
    onSignoutClick: function () {
        Tools.Method.AddCookie('CurUser', $.cookie("CurUser"), -1);
        this.fireViewEvent('onSignoutClick');
    },
    //用Left.js手风琴菜单时的菜单单击事件
    onMainMenuClick: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var t = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在请求页面...&nbsp;&nbsp;";
        this.getView().mask(t, 'page-loading');
        var tabTitle = arguments[0].text;//获取菜单名称
        var tabId = 'tab-' + arguments[0].reference;//获取菜单id
        //alert(arguments[0].reference);
        var tabPath = arguments[0].className;//动态加载菜单对应的js窗体  //"ExtFrame.view.main." + Tools.Method.FirstLetterToLower(arguments[0].reference) + "." + Tools.Method.FirstLetterToUpper(arguments[0].reference);//动态加载菜单对应的js窗体----需要完善

        var pnCenter = Ext.getCmp('main-tabpanel');//获取主页面tabpanel对象
        //var newTab = pnCenter.getComponent(tabId);
        var newTab = pnCenter.down('#' + tabId);
        if (!newTab) {
            newTab = pnCenter.add({
                region: "center",
                layout: 'fit',
                id: tabId,
                itemId: tabId,
                title: tabTitle,
                closable: true,
                closeAction: 'destroy',
                items: [Ext.create(tabPath, { type: 'fit', id: tabId + '-grid', itemId: tabId + '-grid', eName: arguments[0].reference })] //id: tabId + '-grid'
            });
            pnCenter.setActiveTab(newTab);
        } else {//如果tab中存在，那么就直接将节点指向这个页面
            pnCenter.setActiveTab(newTab);
        }
        Ext.getBody().unmask();
    },
    //用LeftMenu.js树形菜单时的菜单单击事件
    onTreeMenuClick: function (me, record, item, index, e, eOpts) {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        var t = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在请求页面...&nbsp;&nbsp;";
        this.getView().mask(t, 'page-loading');
        var eName = record.data.id.split('|')[0];
        var PathHandler = record.data.id.split('|')[1];
        if (PathHandler == '') {
            if (!record.isExpanded())
                record.expand();
            else
                record.collapse();
            Ext.getBody().unmask();
            return;
        }
        var tabTitle = record.data.text;//获取菜单名称
        var tabId = 'tab-' + eName;//获取菜单id
        //alert(arguments[0].reference);
        var tabPath = PathHandler;//动态加载菜单对应的js窗体  //"ExtFrame.view.main." + Tools.Method.FirstLetterToLower(arguments[0].reference) + "." + Tools.Method.FirstLetterToUpper(arguments[0].reference);//动态加载菜单对应的js窗体----需要完善

        var pnCenter = Ext.getCmp('main-tabpanel');//获取主页面tabpanel对象
        //var newTab = pnCenter.getComponent(tabId);
        var newTab = pnCenter.down('#' + tabId);
        if (!newTab) {
            newTab = pnCenter.add({
                region: "center",
                layout: 'fit',
                id: tabId,
                itemId: tabId,
                title: tabTitle,
                closable: true,
                closeAction: 'destroy',
                items: [Ext.create(tabPath, { type: 'fit', id: tabId + '-grid', itemId: tabId + '-grid', eName: eName })] //id: tabId + '-grid'
            });
            pnCenter.setActiveTab(newTab);
        } else {//如果tab中存在，那么就直接将节点指向这个页面
            pnCenter.setActiveTab(newTab);
        }
        Ext.getBody().unmask();
    },
    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },
    EditMyInfo: function () {
        //登录状态判断
        if (!Tools.Method.IsLogin())
            return;
        Ext.create('ExtFrame.view.main.UserInfoEdit', {});
    }
});
