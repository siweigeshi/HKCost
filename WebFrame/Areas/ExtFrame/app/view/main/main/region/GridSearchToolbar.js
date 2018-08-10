/**  
 * 提取了一个停靠组件的类，方便维护 
 */
Ext.define('ExtFrame.view.main.region.GridSearchToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.gridsearchtoolbar',
    autoScroll: true,
    items:[],
    hasSearch: true,//是否包含查询控件
    searchHandler: 'onClickSearch',//搜索按钮事件，默认值为onClickSearch事件
    hasBtn: true,//是否包含业务按钮
    searchCols: [],//可查询字段数据
    toolbarBtn:[],//自定义功能按钮（如果为“[]”and hasBtn=true 时，则自动读取权限按钮）
    searchEx: false,//扩展查询，当为true时，查询控件会自动构造sql语句的整个语句，当为false时，查询控件构造查询语句的“字段名|值”的“键|值”对传到后台处理
    initComponent: function () {
        var me = this;
        if (me.hasSearch) {
            var columns;
            if (me.searchCols.length > 0)
                columns = me.searchCols;
            else
                columns = me.up('#' + me.eName + 'Grid').columns;
            /*
            ** 构造combo数据
            ** searchable: 能否查询（缺省值为false）
            ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
               其中string类型使用'like'关键字查询，其余的使用'='关键字查询，缺省类型使用'like'关键字查询）
            */
            var ComboData = [];
            $.each(columns, function (i, n) {
                var dataIndex;
                if (n.searchable) {
                    var abbr = "";
                    if (me.searchEx) {
                        if (n.dataIndexEx == undefined) {
                            dataIndex = n.dataIndex;
                        }
                        else {
                            dataIndex = n.dataIndexEx;
                        }
                        if (n.fieldType == 'string') {
                            abbr = dataIndex + " like '{0}%'";
                        } else if (n.fieldType == 'int') {
                            abbr = dataIndex + " ={0}";
                        } else if (n.fieldType == 'datetime') {
                            abbr = dataIndex + " ='{0}'";
                        } else {
                            //缺省类型为 like 链接
                            abbr = dataIndex + " like '%{0}%'";
                        }
                    }
                    else {
                        if (n.dataIndexEx == undefined) {
                            dataIndex = n.dataIndex;
                        }
                        else {
                            dataIndex = n.dataIndexEx;
                        }
                        abbr = dataIndex + "|" + n.fieldType;
                    }
                    var comboItem = { "abbr": abbr, "name": n.text };
                    ComboData.push(comboItem);
                }
            });
            if (ComboData.length > 0) {
                me.items.push({
                    xtype: 'combo',
                    itemId: 'lastComboID',
                    emptyText: '请选择查询项',
                    editable: false,// 是否允许输入
                    store: Ext.create('Ext.data.Store', {
                        fields: ['abbr', 'name'],
                        data: ComboData
                    }),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'abbr',
                    value: ComboData[0].abbr
                });
                me.items.push({
                    xtype: 'textfield',
                    itemId: 'lastSearchField',
                    name: 'searchField',
                    emptyText: '输入您的搜索关键词'
                });
            }
            me.items.push({
                text: '搜索',
                glyph: 0xf00e,
                handler: me.searchHandler
            });
        }
        if (me.hasBtn) {
            //if (me.hasSearch) {  //如果存在搜索工具栏按钮在右侧，否则在左侧
            //    me.items.push('->');
            //}
            me.items.push('->'); //工具栏按钮始终在右侧
            if (me.toolbarBtn.length > 0) {
                $.each(me.toolbarBtn, function (index, btn) {
                    me.items.push(btn);
                });
            } else {
                var userId = Ext.decode($.cookie('CurUser'))[0];
                var orgId = Ext.decode($.cookie('CurUser'))[2];
                /* 请求本页面按钮数据 */
                if ($.data(ExtBtns, me.eName + userId + orgId) == undefined) {
                    Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/Base/GetUserModules?ct=json', 'GET', { 'userId': userId, 'orgId': orgId, 'moduleEname': me.eName }, false, function (jsonData) {
                        //写入缓存
                        $.data(ExtBtns, me.eName + userId + orgId, jsonData);
                    });
                }
                //取出页面按钮缓存
                var btns = $.data(ExtBtns, me.eName + userId + orgId);
                $.each(btns, function (i, n) {
                    if (n.Flag == 1) {
                        if (n.Ico != undefined && n.Ico != '') {
                            me.items.push({
                                text: n.Name,
                                eName: n.EName,
                                glyph: Ext.decode(n.Ico.split('|')[0]),//将字符串 转换为符合font-awesome规范的  16进制
                                handler: n.PathHandler
                            });
                        } else {
                            me.items.push({
                                text: n.Name,
                                eName: n.EName,
                                handler: n.PathHandler
                            });
                        }
                    }
                });
            }
        }
        this.callParent();
    }
});