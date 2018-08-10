Ext.define(
  'ExtFrame.view.main.region.Left',
  {
  	extend:'Ext.panel.Panel',
  	alias:'widget.mainleft',
  	title:'折叠菜单',
  	glyph:0xf0c9,
  	split:true,
  	collapsible:false,
  	floatable:false,
  	tools:[{type:'pin'}],
  	header:{
  		titlePosition:2,
  		titleAlign:'left'
  	},
  	maximizable:true,
  	layout:{
  		type: 'accordion',    
      animate: true //点击的时候有动画动作   
      //titleCollapse: true,  
      //enableSplitters: true,  
      //hideCollapseTool: true
  	},
  	viewModel:'main',//指定后可获取MainModel中data数据块
  	
  	initComponent:function(){
  	    this.items = [];

  		var LeftMenus = [];
  		var userId = Ext.decode($.cookie('CurUser'))[0];
  		var orgId = Ext.decode($.cookie('CurUser'))[2];
  		Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()+'/api/Base/GetUserModules?ct=json', 'GET', { 'userId': userId, 'orgId': orgId, 'moduleEname': '' }, false, function (jsonData) {
  		    //目前仅符合  一、二级菜单，不支持多级菜单*************需要完善成ExtTree
  		    var firstMenus = [];
  		    var secondMenus = [];
  		    $.each(jsonData, function (i, n) {
  		        if (n.ParentOID == '00000000-0000-0000-0000-000000000000') {
  		            firstMenus.push(jsonData[i]);
  		        } else {
  		            secondMenus.push(jsonData[i]);
  		        }
  		    });
  		    $.each(firstMenus, function (i, n) {
  		        n.items = [];
  		        $.each(secondMenus, function (j, m) {
  		            if (m.ParentOID == n.OID) {
  		                n.items.push({
  		                    Name: m.Name,
  		                    EName: m.EName,
  		                    Ico: Ext.decode(m.Ico.split('|')[0]),
  		                    PathHandler: m.PathHandler
  		                });
  		            }
  		        });
  		        LeftMenus.push({
  		            Name: n.Name,
  		            EName: n.EName,
  		            Ico: Ext.decode(n.Ico.split('|')[0]),
                    items:n.items
  		        });
  		    });
  		});

  		for (var i in LeftMenus) {
  			//先获取分组显示
  		    var group = LeftMenus[i];
  			var leftpanel={
  				menuAccordion:true,
  				xtype:'panel',
  				title: group.Name,
  				glyph: group.Ico,
  				headerStype:{
  					
  				},
  				bodyStype:{
  					padding:'10px'
  				},
  				layout:'fit',
  				dockedItems:[
  					{
  						dock:'left',
  						xtype:'toolbar',
  						items:[]
  					}
  				]
  			};
  			//遍历分组下的菜单项
  			for (var j in group.items) {
  				var menumodule=group.items[j];
  				leftpanel.dockedItems[0].items.push({
  				    text: menumodule.Name,
  				    reference: menumodule.EName,
  					className: menumodule.PathHandler,
  					glyph: menumodule.Ico,
  					handler:'onMainMenuClick'
  				});
  			}
  			this.items.push(leftpanel);
  		}
  		this.callParent(arguments);
  	}
  }
);