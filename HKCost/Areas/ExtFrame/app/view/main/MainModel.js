/**
 * 应用程序主要视图.
 */
Ext.define('ExtFrame.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    //数据模块  ViewModel中的data可以在指定当前ViewModel的地方获取
    data: {
        name: 'oaSystem'
    }

    //增加 data, formulas and/or methods 来支持你的视图
});