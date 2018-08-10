Ext.define(
  'ExtFrame.view.main.region.Bottom',//定义这个类的名称 放在对应的目录view/main/region下 名称是Bottom.js
  {
	  extend: 'Ext.toolbar.Toolbar',//继承自工具条
	  alias: 'widget.mainbottom', //后期通过xtype来获取类
	  items:[
	   { 
		  xtype: 'tbtext'
	   },
	   '->',
	   {
		  xtype: 'tbtext',
		  text: '关于我们',
		  glyph: 0xf1ae,
		  style: {
		      color: '#fff'
		  }
	   },'-',{
	      xtype: 'tbtext',
		  text: '联系我们',
		  glyph: 0xf003,
		  style: {
		      color: '#fff'
		  }
	   },'-',{
          xtype: 'tbtext',
		  text: '版权声明',
		  glyph: 0xf099,
		  style: {
		      color: '#fff'
		  }
	   }	  
	  ],
	  style: {
	      backgroundColor: '#157fcc',
          color:'#fff'
	  }
  }

);