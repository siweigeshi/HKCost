Ext.define('ExtFrame.view.extEncap.LinkButton', {
    extend: 'Ext.Component',
    alias: 'widget.linkbutton',
    renderTpl: '<div id="{id}-btnWrap" style="min-height:24px;" class="{baseCls}-linkbutton">' +
    '<a id="{id}-btnEl" href="#" <tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="link">' +
    '<tpl if="iconCls">' + '<span style="min-width:18px;min-height:24px;float:left;" class="{iconCls}"></span>' + '</tpl>' +
    '<span id="{id}-btnInnerEl" class="{baseCls}-inner">' + '{text}' + '</span>' + '<span id="{id}-btnIconEl" class="{baseCls}-icon"></span>' + '</a>' + '</div>',
    renderSelectors: {
        linkEl: 'a'
    },
    initComponent: function () {
        this.callParent(arguments);
        this.renderData = {
            text: this.text,
            iconCls: this.iconCls
        };
    },
    listeners: {
        render: function (c) {
            c.el.on('click', c.handler);
        }
    },
    handler: function (e) {
    }
});