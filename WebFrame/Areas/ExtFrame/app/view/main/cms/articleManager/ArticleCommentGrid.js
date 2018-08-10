Ext.define('ExtFrame.view.main.cms.articleManager.ArticleCommentGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.articlecommentgrid',
    id: 'ArticleCommentGrid',
    requires: ['Ext.ux.grid.SubTable'],
    title: '评论及回复',
    width: 700,
    height: 400,
    selType: 'checkboxmodel',
    initComponent: function () {
        var me = this;
        var need_select = false;
        /********************** 根据具体业务需要适当修改 ***********************/
        var pageSize = 10;//分页条数
        var OrderField = 'CreateTime';//默认排序字段
        var OrderType = 'DESC';//默认排序类型 ASC/DESC
        /*
        ** grid控件绑定列
        ** text: 前台显示文字, dataIndex: 数据绑定字段, sortable: 能否排序（缺省值为true）
        ** searchable: 能否查询（缺省值为false）
        ** fieldType: 字段类型（用户查询控件拼接where字句，目前仅支持 string、int、datetime
           其中string类型使用'like'关键字查询，其余的使用'='关键字查询）
        */
        me.plugins = [{
            ptype: "subtable",
            columns: [
             { text: '回复', dataIndex: 'CommentContent', width: 300, fieldType: 'string' },
             {
                 text: '回复人', dataIndex: 'UserInfo', width: 150, fieldType: 'string', renderer: function (v) {
                     if (v != undefined && v != '') {
                         return v.Name;
                     }
                 }
             },
             { text: '回复IP', dataIndex: 'UserIP', width: 150, fieldType: 'string' },
             {
                 text: '回复时间', dataIndex: 'CreateTime', renderer: function (v) {
                     if (v != undefined && v != '' && v.length >= 10) {
                         return v.substr(0, 10);
                     }
                 }
             }, {
                 text: '操作', fieldType: 'string', renderer: function (v, b, obj) {
                     return '<a href="javascript:void(0)" onclick="aaa(\'' + obj.data.OID + '\')">删除</a>';
                 }
             }],
            getAssociatedRecords: function (record) {
                if (record.data.Reply.length>0) {
                    var store = Ext.create('Ext.data.Store', {
                        model: Ext.create('Ext.data.Model', {})
                    });
                    store.insert(0, record.data.Reply);
                    return store.data.items;
                }
            }
        }],
        me.columns = [
             { text: 'OID', dataIndex: 'OID', hidden: true },
             { text: '评论内容', dataIndex: 'CommentContent', width: 300, fieldType: 'string' },
             {
                 text: '评论人', dataIndex: 'UserInfo', width: 150, fieldType: 'string', renderer: function (v) {
                     if (v != undefined && v != '') {
                         return v.Name;
                     }
                 }
             },
             { text: '评论人IP', dataIndex: 'UserIP', width: 150, fieldType: 'string' },
             {
                 text: '评论时间', dataIndex: 'CreateTime', renderer: function (v) {
                     if (v != undefined && v != '' && v.length >= 10) {
                         return v.substr(0, 10);
                     }
                 }
             }, {
                 text: '操作', fieldType: 'string', align: 'center', xtype: 'actioncolumn',
                 items: [{
                     icon: '/Areas/ExtFrame/ico/delete.gif',
                     tooltip: '删除',
                     handler: 'onClickCommentDelete',
                 }]
        }];
        me.store = Ext.create('Ext.data.Store', {
            model: Ext.create('Ext.data.Model', {}),
            pageSize: pageSize,
            data: me.CommentData,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'ArticleComments',//数据根节点名称
                    totalProerty: 'total',//数据总数节点名称
                    idProperty: 'OID'//id标示节点名称
                }
            }
        });
        me.callParent();
    }
});
function aaa(OID) {
    Ext.MessageBox.confirm('提醒', '确定要删除选中行', function (btn) {
        if (btn == 'yes') {
            var pnGrid = Ext.getCmp('ArticleCommentGrid');
            var data = pnGrid.store.data.items;
            for (var i = 0; i < data.length; i++) {
                var replyArray = new Array();
                for (var j = 0; j < data[i].data.Reply.length; j++) {
                    if (data[i].data.Reply[j].OID != OID) {
                        replyArray.push(data[i].data.Reply[j]);
                    }
                }
                data[i].data.Reply = replyArray;
            }
            pnGrid.store.add(data);
            pnGrid.store.proxy.reader.totalProerty = "total";
            pnGrid.store.proxy.reader.rootProperty = "ArticleComments";
            var ActionDel = Tools.Method.getAPiRootPath() + '/api/Article/CommentDelete?ct=json';
            var data = { PostData: Ext.encode(OID) };
            Tools.Method.ShowTipsMsg(Tools.Msg.MSG0020, '4000', '1', null);
            Tools.Method.ExtAjaxRequestEncap(ActionDel, 'POST', data, true, function (jsonData) { });
        }
    })
}