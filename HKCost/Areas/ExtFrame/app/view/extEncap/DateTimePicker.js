/**
 * Picker for Ext.ux.form.field.DateTime.
 *
 * @author wangzilong
 * update Ext - 4.1 27/04/2012
 *
 */

Ext.define('ExtFrame.view.extEncap.DateTimePicker', {
	extend: 'Ext.picker.Date',
	alias: 'widget.datetimepicker',
	requires: [
		'ExtFrame.view.extEncap.Time',
		'Ext.button.Button'
	],
	todayText: '现在',
	timeLabel: '时间',
	applyLabel: '确定',
	childEls: [
		'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'timeEl', 'footerEl', 'acceptEl'
	],

	initComponent: function() {
	  // keep time part for value
	  var value = this.value || this.config.value || new Date();

	  this.callParent();
	  this.on('show', function(){
		  this.timefield.hoursSpinner.focus();
	  });
		/**
		 * @event todayClick
		 * Fires when the today button is clicked
		 * @param {Ext.picker.Date} this DatePicker
		 * @param {Date} date The selected date
		 */

	  this.value = value;
	},

	/**
	 * @cfg
	 * @inheritdoc
	 */
	renderTpl: [
		'<div id="{id}-innerEl" data-ref="innerEl">',
		'<div class="{baseCls}-header">',
		'<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="button" title="{prevText}"></div>',
		'<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
		'<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="button" title="{nextText}"></div>',
		'</div>',
		'<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" {%',
		// If the DatePicker is focusable, make its eventEl tabbable.
		// Note that we're looking at the `focusable` property because
		// calling `isFocusable()` will always return false at that point
		// as the picker is not yet rendered.
		'if (values.$comp.focusable) {out.push("tabindex=\\\"0\\\"");}',
		'%} cellspacing="0">',
		'<thead><tr role="row">',
		'<tpl for="dayNames">',
		'<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
		'<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
		'</th>',
		'</tpl>',
		'</tr></thead>',
		'<tbody><tr role="row">',
		'<tpl for="days">',
		'{#:this.isEndOfWeek}',
		'<td role="gridcell">',
		'<div hidefocus="on" class="{parent.baseCls}-date"></div>',
		'</td>',
		'</tpl>',
		'</tr></tbody>',
		'</table>',
		'<div role="presentation" id="{id}-timeEl" data-ref="timeEl" class="x-datepicker-footer ux-timefield"></div>',
		'<table role="grid" id="{id}-footerEl" data-ref="footerEl" class="{baseCls}-inner" cellspacing="0">',
		'<tbody><tr role="row" style="text-align:center;">',
		'<tpl if="showToday">',
		'<td role="gridcell"><div role="presentation">{%this.renderTodayBtn(values, out)%}</div></td>',
		'</tpl>',
		'<td role="gridcell"><div id="{id}-acceptEl" data-ref="acceptEl" role="presentation">{%this.renderAcceptBtn(values, out)%}</div></td>',
		'</tr></tbody>',
		'</table>',
		'</div>',
		{
			firstInitial: function(value) {
				return Ext.picker.Date.prototype.getDayInitial(value);
			},
			isEndOfWeek: function(value) {
				// convert from 1 based index to 0 based
				// by decrementing value once.
				value--;
				var end = value % 7 === 0 && value !== 0;
				return end ? '</tr><tr role="row">' : '';
			},
			renderTodayBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
			},
			renderMonthBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
			},
			renderAcceptBtn: function(values, out) {
				Ext.DomHelper.generateMarkup(values.$comp.acceptBtn.getRenderTree(), out);
			}
		}
	],

	beforeRender: function () {
		var me = this;
		me.acceptBtn = Ext.create('Ext.button.Button',{
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			text: me.applyLabel,
			handler: me.acceptClick,
			width: 60,
			scope: me
		});
		me.timefield = Ext.create('ExtFrame.view.extEncap.Time', {
			ownerCt: me,
			ownerLayout: me.getComponentLayout(),
			fieldLabel: me.timeLabel,
			labelWidth: 40,
			value: Ext.Date.format(me.value, 'H:i:s')
		});

		me.callParent();

		if (me.showToday) {
			me.todayBtn.setWidth(60);
		}
	},

	getRefItems: function() {
		var results = this.callParent();
		results.push(this.timefield);
		results.push(this.acceptBtn);
		return results;
	},

	privates: {
		finishRenderChildren: function () {
			this.callParent();
			this.acceptBtn.finishRender();
		}
	},

	onRender: function(container, position) {
		this.callParent(arguments);
		this.timefield.render(this.el.child('div div.ux-timefield'));
		this.timefield.on('change', this.timeChange, this);
	},

	acceptClick: function(tf, time, rawtime){
	    var me = this;
		me.fireEvent('select', me, me.value);
		if (me.handler) {
			me.handler.call(me.scope || me, me, me.value);
		}
		me.onSelect();
	},

	// listener 时间域修改, timefield change
	timeChange: function (tf, time, rawtime) {
		this.setValue(this.fillDateTime(this.value));
	},

	// @private
	fillDateTime: function (value) {
	  if(this.timefield) {
		  var rawtime = this.timefield.getRawValue();
		  value.setHours(rawtime.h);
		  value.setMinutes(rawtime.m);
		  value.setSeconds(rawtime.s);
	  }
	  return value;
	},

	// @private
	changeTimeFiledValue: function(value) {
	  this.timefield.setValue(this.value);
	},

	/* TODO 时间值与输入框绑定, 考虑: 创建this.timeValue 将日期和时间分开保存. */
	// overwrite
	setValue: function(value) {
	  this.value = value;
	  // this.value = value ? Ext.Date.clearTime(value, true) : null;
	  this.changeTimeFiledValue(value);
	  return this.update(this.value);
	},

	// overwrite
	getValue: function() {
	  return this.fillDateTime(this.value);
	},

	// overwrite : fill time before setValue
	handleDateClick: function(e, t) {
	  var me = this,
		handler = me.handler;

	  e.stopEvent();
	  if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
		  me.doCancelFocus = me.focusOnSelect === false;
		  me.setValue(this.fillDateTime(new Date(t.dateValue))); // overwrite: fill time before setValue
		  delete me.doCancelFocus;
		  me.fireEvent('select', me, me.value);
		  if(handler) {
			  handler.call(me.scope || me, me, me.value);
		  }
		  me.onSelect();
	  }
	},

	// overwrite : fill time before setValue
	selectToday: function() {
	  var me = this,
		btn = me.todayBtn,
		handler = me.handler;

	  if(btn && !btn.disabled) {
		  me.setValue(new Date());// overwrite: fill time before setValue
		  me.fireEvent('select', me, me.value);
		  me.fireEvent('todayClick', me, me.value);

		  if(handler) {
			  handler.call(me.scope || me, me, me.value);
		  }
		  me.onSelect();
	  }
	  return me;
	}

});
