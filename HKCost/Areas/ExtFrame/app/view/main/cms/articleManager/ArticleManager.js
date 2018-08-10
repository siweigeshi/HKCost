Ext.define('ExtFrame.view.main.cms.articleManager.ArticleManager', {
    extend: 'Ext.panel.Panel',
    requires: ['ExtFrame.view.main.cms.articleManager.ArticleManagerController', 'ExtFrame.view.main.cms.articleManager.ArticleManagerModel',
        'ExtFrame.view.main.cms.articleManager.ArticleGrid'],//请求MainController类
    layout: { type: 'border' },
    controller: 'articleManager',
    itemId:'ArticleManageForm',
    viewModel: { type: 'ArticleManagerModel' },
    initComponent: function () {
        var me = this;
        me.valid = true;
        me.items = [{
            xtype: 'articlegrid',
            id: 'ArticleManageGrid',
            itemId: me.eName+'Grid',
            eName: me.eName,
            region: 'center'
        }];
        me.callParent();
    }
});