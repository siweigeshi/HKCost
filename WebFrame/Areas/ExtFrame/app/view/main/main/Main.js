Ext.define(
  'ExtFrame.view.main.Main',
  {
      extend: 'Ext.container.Viewport',
      requires: ['ExtFrame.view.main.MainController', 'ExtFrame.view.main.region.LeftMenu'],//请求MainController类
      layout: { type: 'border' },
      xtype: 'app-main',
      controller: 'main',
      viewModel: { type: 'main' },
      items: [
	  	  {
	  	      xtype: 'maintop',
	  	      region: 'north'
	  	  },
		  {
		      xtype: 'mainbottom',
		      region: 'south',
		      bind: '你好，{currentUser}'
		  },
		  {
		      xtype: 'mainleftmenu',// 'mainleft','mainleftmenu'
		      region: 'west', // 左边面板    
		      width: 220,
		      split: true,
		      collapsible: true,
		      floatable: false
		  },
		  {
		      xtype: 'tabpanel',
		      id: 'main-tabpanel',
		      region: 'center',
		      items: [{
		          title: '首页',
		          itemId: 'tab-index',
		          //html: '<h2>Content appropriate for the current navigation.</h2>',
		          //height:500
		          items: [{
		              xtype: 'form',
		              itemId: 'TestUploadForm',
		              bodyPadding: 5,
		              padding: 2,
		              defaults: {
		                  bodyPadding: 5
		              },
		              fieldDefaults: {
		                  labelAlign: 'right'
		              },
		              items: [{}],
		              buttons: [{
		                  text: '上传控件',
		                  handler: function () {
		                      Ext.create('ExtFrame.view.extEncap.FileUpload', {
		                          PlUploadOpts: {
		                              uniqueNames: true, //当值为true时会为每个上传的文件生成一个唯一的文件名
		                              fileCount: 3,//允许上传文件个数
		                              path: 'Upload', //上传路径，从应用程序根目录写起，前后不带'/'。
		                              mimeType: [{ title: "所有文件", extensions: "*" }], //定上传文件的类型 例如：[{ title: "Image files", extensions: "jpg,gif,png" }]
		                              maxFileSize: '1024mb', //限定上传文件的大小.值可以为一个数字，单位为b,也可以是一个字符串，由数字和单位组成，如'200kb,200mb'
		                              preventDuplicates: true, //不允许选取重复文件
		                              officeConvert: false, //是否在线转换，默认为false。目前仅支持word文档转html，excel文档转html
		                              picShow: true, //图片预览功能，默认为打开
		                              canContinue: true, //是否支持断点续传，默认为不支持
		                              createDateDir: false, //是否创建日期目录，默认为不创建
		                          },
		                          returnFun: function (data) {
		                              alert(Ext.encode(data));
		                          }
		                      });
		                  }
		              }]
		          }]
		      }]
		  }
      ],

      initComponent: function () {
          //设置图标文件，设置后可以使用glyph属性
          Ext.setGlyphFontFamily('FontAwesome');
          this.callParent();
      }
  }

);
