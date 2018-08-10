Ext.define('ExtFrame.view.main.cms.articleManager.ArticleTabPanle', {
      extend: 'Ext.panel.Panel',
      requires: ['ExtFrame.view.extEncap.UEditor', 'Ext.data.TreeStore', 'ExtFrame.view.main.cms.articleManager.AttachGrid', 'ExtFrame.view.main.cms.articleManager.ArticleCommentGrid'],//请求MainController类
      layout: { type: 'border' },
      controller: 'articleManager',
      viewModel: { type: 'ArticleManagerModel' },
      initComponent: function () {
          var me = this;
          me.items = [{
              xtype: 'tabpanel',
              region: 'north',
              height: '100%',
              resizable: true,
              activeTab: 1,
              minTabWidth: 130,
              split: true,
              listeners: {
                  afterrender: function (tabpanel, eOpts) {
                      tabpanel.setActiveTab(3);
                      tabpanel.setActiveTab(2);
                      tabpanel.setActiveTab(0);
                  }
              },
              items: [{
                  title: '基本信息',
                  xtype: 'form',
                  itemId: 'ArticleTabForm',
                  eName: me.eName,
                  scrollable: true,
                  fieldDefaults: {
                      labelAlign: 'right'
                  },
                  items: [{
                      xtype: 'hiddenfield',
                      itemId: 'hfOID',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'OID',
                      bind: '{rec.OID}'
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfImgUrl',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'ArticleImage',
                      bind: '{rec.ArticleImage}',
                      listeners: {
                          change: function (obj) {
                              Ext.getCmp('tab-ArticleTabPanle').down('#imgBox').getEl().dom.src = '/' + obj.rawValue;
                          }
                      }
                  }, {
                      xtype: 'textfield',
                      name: 'ArticleTitle',
                      bind: '{rec.ArticleTitle}',
                      fieldLabel: '文章标题',
                      emptyText: '请输入文章标题',
                      allowBlank: false,
                      width: 700
                  }, {
                      xtype: 'textarea',
                      fieldLabel: '文章摘要',
                      emptyText: '请输入文章摘要',
                      name: 'ArticleAbstract',
                      bind: '{rec.ArticleAbstract}',
                      allowBlank: false,
                      width: 700
                  }, {
                      xtype: 'textfield',
                      name: 'CallIndex',
                      itemId: 'txtCallIndex',
                      bind: '{rec.CallIndex}',
                      fieldLabel: '调用别名',
                      emptyText: '请输入调用别名',
                      ArticleOID:me.ArticleOID,
                      allowBlank: false,
                      width: 300,
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              var OID;
                              if (me.ArticleOID != undefined && me.ArticleOID != '') {
                                  OID = me.ArticleOID;
                                  me.ArticleOID = '';
                              } else {
                                  OID = me.up('#ArticleTabForm').down('#hfOID').getValue();
                              }

                              valid = false;
                              Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath() + '/api/Article/GetCallIndexBool?ct=json&ArticleOID=' + OID + '&CallIndex=' + newValue + '',
                                  'GET', null, false, function (jsonData) {
                                      if (!jsonData) {
                                          valid = "调用别名已经存在";
                                      }
                                  });
                              me.validation = valid;
                          }
                      }
                  }, {
                      xtype: 'textfield',
                      fieldLabel: '文章作者',
                      emptyText: '请输入文章作者',
                      name: 'ArticleAuthor',
                      bind: '{rec.ArticleAuthor}',
                      allowBlank: false,
                      width: 300
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfCategoryOID',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'ArticleCategoryOID',
                      bind: '{rec.ArticleCategoryOID}',
                      listeners: {
                          change: function (me, newValue, oldValue, eOpts) {
                              me.up('#ArticleTabForm').down('#typePicker').setValue(newValue);
                          }
                      }
                  }, {
                      xtype: 'treepicker',
                      itemId: 'typePicker',
                      fieldLabel: '文章类型',
                      name: 'ArticleCategoryOID',
                      bind: '{rec.ArticleCategoryOID}',
                      displayField: 'Name',
                      valueField: 'OID',
                      forceSelection: true,// 只能选择下拉框里面的内容
                      emptyText: '请选择',
                      blankText: '请选择',// 该项如果没有选择，则提示错误信息
                      rootVisible: false,
                      initComponent: function () {
                          var treepicker = this;
                          treepicker.store = Ext.create('Ext.data.TreeStore', {
                              model: 'Ext.data.TreeModel',
                              autoLoad: true,
                              root: {
                                  OID: '00000000-0000-0000-0000-000000000000',
                                  Name: '', 
                                  id: '00000000-0000-0000-0000-000000000000',
                                  expanded: true
                              },
                              proxy: {
                                  type: 'ajax',
                                  url: Tools.Method.getAPiRootPath() + '/api/ArticleCategory/GetTreeList?ct=json',
                                  ansy:false,
                                  reader: {
                                      type: 'json',
                                      rootproperty: 'children',//数据根节点名称
                                  }
                              },
                              clearOnLoad: true,
                              nodeParam: 'PID'
                          });
                          treepicker.callParent();
                      },
                      listeners: {
                          select: function (treepicker, record, eOpts) {
                              var form = treepicker.up('#ArticleTabForm');
                              form.down('#hfCategoryOID').setValue(treepicker.value);
                          }
                      }
                  }, {
                      xtype: 'datefield',
                      itemId: 'datePublish',
                      editable: false,// 是否允许输入
                      allowBlank: false,
                      fieldLabel: '发布日期',
                      emptyText: '请选择发布日期',
                      blankText: '请选择发布日期',
                      format: 'Y-m-d',
                      width: 300,
                      listeners: {
                          change: function (dateCombo, newValue, oldValue, eOpts) {
                              dateCombo.up('#ArticleTabForm').down('#hfPublishTime').setValue(Ext.util.Format.date(newValue, 'Y-m-d') + ' 00:00:00');
                          }
                      }
                  }, {
                      xtype: 'hiddenfield',
                      itemId: 'hfPublishTime',//注意，此itemId要写固定，functionjs中重置from有用到
                      name: 'PublishTime',
                      bind: '{rec.PublishTime}',
                      listeners: {
                          change: function (obj,newValue) {
                              obj.up('#ArticleTabForm').down('#datePublish').setValue(newValue.substr(0, 10));
                          }
                      }
                  }, {
                      xtype: 'numberfield',
                      fieldLabel: '排序',
                      emptyText: '输入数字',
                      name: 'SortId',
                      bind: '{rec.SortId}',
                      allowBlank: false,
                      width: 300,
                      minValue:0
                  }, {
                      xtype: 'textfield',
                      fieldLabel: '文章来源网站',
                      emptyText: '请输入文章来源网站',
                      name: 'ArticleSource',
                      bind: '{rec.ArticleSource}',
                      allowBlank: false,
                      width: 300
                  }, {
                      xtype: 'textfield',
                      fieldLabel: '文章来源网站路径',
                      emptyText: '请输入文章来源网站路径',
                      name: 'ArticleUrl',
                      bind: '{rec.ArticleUrl}',
                      allowBlank: false,
                      width: 700
                  }, {
                      xtype: 'panel',
                      region: 'north',
                      height: 110,
                      resizable: false,
                      split: true,
                      items: [{
                          layout: 'column',
                          itemId: 'column1',
                          items: [{
                              xtype: 'label',
                              text: '文章图片:',
                              style: {
                                  width: 100,
                                  marginLeft: '40px'
                              }
                          },{
                              xtype: 'box', //或者xtype: 'component',
                              itemId:'imgBox',
                              width: 100, //图片宽度
                              height: 100, //图片高度
                              autoEl: {
                                  tag: 'img',    //指定为img标签
                                  src: ''    //指定url路径
                              }
                          }]
                      }]
                  }, {
                      xtype: "button",
                      text: "浏览图片",
                      style: {
                          width: 100,
                          marginLeft: '7.3%'
                      },
                      eName:me.eName,
                      handler: function () {
                          Ext.create('ExtFrame.view.extEncap.FileUpload', {
                              PlUploadOpts: {
                                  uniqueNames: true, //当值为true时会为每个上传的文件生成一个唯一的文件名
                                  fileCount: 1,//允许上传文件个数
                                  path: 'UpLoad', //上传路径，从应用程序根目录写起，前后不带'/'。
                                  mimeType: [{ title: "文档或表格", extensions: "jpg,png,bmp" }], //定上传文件的类型 例如：[{ title: "Image files", extensions: "jpg,gif,png" }]
                                  maxFileSize: '512mb', //限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
                                  preventDuplicates: true, //不允许选取重复文件
                                  officeConvert: false//是否在线转换，默认为false。目前仅支持word文档转html，excel文档转html
                              },
                              returnFun: function (data) {
                                  if (data.length > 0) {
                                      Ext.MessageBox.show({
                                          msg: '正在保存上传',
                                          progressText: '请稍后...',
                                          width: 300,
                                          wait: {
                                              interval: 200
                                          }
                                      });
                                      var me = this;
                                      var t = setTimeout(function () {
                                          Ext.MessageBox.hide();
                                          Ext.MessageBox.alert('警告', '上传超时，刷新重试', this.showResult, this);
                                      }, 20000);
                                      Ext.MessageBox.hide();
                                      clearTimeout(t);
                                      Ext.getCmp('tab-ArticleTabPanle').down('#hfImgUrl').setValue(data[0].Path);
                                      //Ext.getCmp('tab-ArticleTabPanle').down('#imgBox').getEl().dom.src ='/'+data[0].Path;
                                  }
                              }
                          });
                      }
                  }, {
                      xtype: 'checkboxgroup',
                      fieldLabel: '状态',
                      cls: 'x-check-group-alt',
                      items: [
                          { boxLabel: '是否热门', name: 'cb-auto-4', width: 100, name: 'IsHot', bind: '{rec.IsHot}' },
                          { boxLabel: '是否置顶', name: 'cb-auto-1', width: 100, name: 'IsTop', bind: '{rec.IsTop}' },
                          { boxLabel: '是否推荐', name: 'cb-auto-2', width: 100, name: 'IsRecommend', bind: '{rec.IsRecommend}' },
                          { boxLabel: '是否允许评论', name: 'cb-auto-3', width: 100, name: 'IsReply', bind: '{rec.IsReply}' }
                      ],
                      width: 500
                  }, {
                      xtype: 'textfield',
                      fieldLabel: 'TGA标签以","分隔',
                      emptyText: 'TGA标签以\',\'分隔',
                      name: 'Tags',
                      bind: '{rec.Tags}',
                      allowBlank: true,
                      width: 500
                  }, {
                      xtype: 'textfield',
                      fieldLabel: 'SeoKeyword',
                      emptyText: '请输入SeoKeyword',
                      name: 'SeoKeyword',
                      bind: '{rec.SeoKeyword}',
                      allowBlank: true,
                      width: 700
                  }, {
                      xtype: 'textfield',
                      fieldLabel: 'SeoTitle',
                      emptyText: '请输入SeoTitle',
                      name: 'SeoTitle',
                      bind: '{rec.SeoTitle}',
                      allowBlank: true,
                      width: 700
                  }, {
                      xtype: 'textfield',
                      fieldLabel: 'SeoDescription',
                      emptyText: '请输入SeoDescription',
                      name: 'SeoDescription',
                      bind: '{rec.SeoDescription}',
                      allowBlank: true,
                      width: 700
                  }, {
                      xtype: 'combo',
                      name: 'CURSTATE',
                      emptyText: '请选择状态',
                      allowBlank: false,
                      name: 'State',
                      bind: '{rec.State}',
                      blankText: '请选择状态',
                      editable: false,// 是否允许输入
                      store: Ext.create('Ext.data.Store', {
                          fields: ['abbr', 'name'],
                          data: [{ 'abbr': '0', 'name': '正常' }, { 'abbr': '1', 'name': '停用' }]
                      }),
                      queryMode: 'local',
                      displayField: 'name',
                      valueField: 'abbr',
                      fieldLabel: '状态',
                      width: 300,
                      value: 0
                  }]
              }, {
                  title: '文章正文',
                  xtype: 'form',
                  itemId:'ArticleContentForm',
                  bodyPadding: 5,
                  scrollable: true,
                  padding: 2,
                  defaults: {
                      bodyPadding: 5
                  },
                  fieldDefaults: {
                      labelAlign: 'right'
                  },
                  items: [{
                      xtype: 'ueditor',
                      itemId:'txtUeditor',
                      allowBlank: false,
                      emptyText: '请输入文章正文',
                      blankText: '请输入文章正文',
                      width: 800,
                      height: 400,
                      fieldLabel: '文章正文'
                  }]
              }, {
                  title: '附件',
                  xtype: 'form',
                  itemId: 'AttachForm',
                  scrollable: true,
                  fieldDefaults: {
                      labelAlign: 'right'
                  },
                  items: [{
                      xtype: 'button',itemId:'btnUpload', text: '上传文件', handler: 'onClickUpload', ArticleOID: me.ArticleOID
                  }, {
                      xtype: 'attachgrid',
                      id: 'AttachGrid',
                      itemId: 'AttachGrid',
                      AttachData: me.AttachData,
                      ArticleOID: me.ArticleOID,
                      region: 'center'
                  }]
              }, {
                  xtype: 'articlecommentgrid',
                  itemId: 'ArticleCommentGrid',
                  CommentData: me.CommentData
              }]
          }];
          me.callParent();
      }, buttons: [{
          xtype: 'button', text: '保存', handler: 'onClickButtonSave'
      }]
  });