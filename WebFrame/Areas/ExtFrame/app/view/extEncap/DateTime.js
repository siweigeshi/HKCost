/**
 * Date and time widget.
 *
 * @author wangzilong
 * update Ext - 4.1 27/04/2012
 *
 */

Ext.define('ExtFrame.view.extEncap.DateTime', {
	extend: 'Ext.form.field.Date',
	alias: 'widget.datetimefield',
	uses: ['ExtFrame.view.extEncap.DateTimePicker'],

  /**
   * @cfg timeFormat
   */
  timeFormat: "H:i:s",

	initComponent: function() {
    this.format = this.format + ' ' + this.timeFormat;
		this.callParent();
	},

	/**
   * Do not close picker when clicking on time controls.
   */
	collapseIf: function(e) {
    var me = this;
    if (!e.within(me.picker.timeEl)) {
      me.callParent(arguments);
    }
    else {
      console.log ("not collapsing")
    }
  },

	// overwrite
	createPicker: function() {
		var me = this,
		   format = Ext.String.format;

		return Ext.create('ExtFrame.view.extEncap.DateTimePicker', {
      pickerField: me,
      floating: true,
      focusable: false,
			hidden: true,
			minDate: me.minValue,
			maxDate: me.maxValue,
			disabledDatesRE: me.disabledDatesRE,
			disabledDatesText: me.disabledDatesText,
			disabledDays: me.disabledDays,
			disabledDaysText: me.disabledDaysText,
			format: me.format,
			showToday: me.showToday,
			startDay: me.startDay,
			minText: format(me.minText, me.formatDate(me.minValue)),
			maxText: format(me.maxText, me.formatDate(me.maxValue)),
			listeners: {
				scope: me,
				select: me.onSelect
			},
			keyNavConfig: {
				esc: function() {
					me.collapse();
				}
			}
		});
	}

});
