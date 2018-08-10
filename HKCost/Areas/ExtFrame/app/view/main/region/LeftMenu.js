Ext.define('ExtFrame.view.main.region.LeftMenu', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.mainleftmenu',
    title: '系统菜单',
    glyph: 0xf0c9,
    split: true,
    collapsible: false,
    floatable: false,
    viewModel: 'main',//指定后可获取MainModel中data数据块
    rootVisible: false,
    //useArrows: true,
    listeners: {
        itemclick: 'onTreeMenuClick'
    },
    initComponent: function () {
        var me = this;
        var userId = Ext.decode($.cookie('CurUser'))[0];
        var orgId = Ext.decode($.cookie('CurUser'))[2];
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Ext.data.TreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Tools.Method.getAPiRootPath()+'/api/Base/GetUserMenuTree?ct=json',
                //扩展参数
                extraParams: {
                    'userId': userId,
                    'orgId': orgId
                },
            }
        });
        this.callParent(arguments);
    }
})