Ext.define(
  'ExtFrame.view.main.ChooseOrgs',
  {
      requires: ['ExtFrame.view.main.ChooseOrgsController'],
      extend: 'Ext.window.Window',
      controller: 'chooseOrgs',
      closable: false,
      resizable: false,
      modal: true,
      //draggable: false,
      autoShow: true,
      title: '选择登录组织机构',
      glyph: 'xf007@FontAwesome',
      buttons: [{
          name: 'registbutton',
          text: '确定',
          glyph: 'xf118@FontAwesome',
          listeners: {
            click: 'onChooseOrgClick'//单击事件 调用LoginConroller.js中的onLoginbtnClick函数
          }
      }],
      initComponent: function () {
          var orgs = this.orgs;
          this.items=[{
              xtype: 'form',//父窗体
              reference: 'form',
              bodyPadding: 20,
              items: [{
                  xtype: 'combo',
                  name: 'OrgCombo',
                  labelWidth: 90,
                  fieldLabel: '登录组织机构',
                  emptyText: '请选择登录组织机构',
                  allowBlank: false,//不允许为空
                  editable: false,// 是否允许输入
                  store: Ext.create('Ext.data.Store', {
                      fields: ['OID', 'Name'],
                      data: orgs
                  }),
                  queryMode: 'local',
                  displayField: 'Name',
                  valueField: 'OID'
              }, {
                  xtype: 'hiddenfield',
                  name: 'Orgs',
                  value:Ext.encode(orgs)
              }]
          }]
          this.callParent();
      }
  }
);


