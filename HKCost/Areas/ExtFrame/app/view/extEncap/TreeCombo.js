/** 
 * A Picker field that contains a tree panel on its popup, enabling selection of tree nodes. 
 */
Ext.define('ExtFrame.view.extEncap.TreeCombo', {
    extend: 'Ext.form.field.Picker',
    xtype: 'multitreepicker',
    uses: [
        'Ext.tree.Panel'
    ],

    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

    config: {
        /**
         * @cfg {Ext.data.TreeStore} store
         * A tree store that the tree picker will be bound to
         */
        store: null,

        /**
         * @cfg {String} displayField
         * The field inside the model that will be used as the node's text.
         * Defaults to the default value of {@link Ext.tree.Panel}'s `displayField` configuration.
         */
        displayField: null,

        /**
         * @cfg {Array} columns
         * An optional array of columns for multi-column trees
         */
        columns: null,

        /**
         * @cfg {Boolean} selectOnTab
         * Whether the Tab key should select the currently highlighted item. Defaults to `true`.
         */
        selectOnTab: true,

        /**
         * @cfg {Number} maxPickerHeight
         * The maximum height of the tree dropdown. Defaults to 300.
         */
        maxPickerHeight: 300,

        /**
         * @cfg {Number} minPickerHeight
         * The minimum height of the tree dropdown. Defaults to 100.
         */
        minPickerHeight: 100
    },

    editable: false,

    /**
     * @event select
     * Fires when a tree node is selected
     * @param {Ext.ux.TreePicker} picker        This tree picker
     * @param {Ext.data.Model} record           The selected record
     */

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.mon(me.store, {
            scope: me,
            load: me.onLoad,
            update: me.onUpdate
        });
    },

    /**
     * Creates and returns the tree panel to be used as this field's picker.
     */
    createPicker: function () {
        var me = this,
            picker = new Ext.tree.Panel({
                shrinkWrapDock: 2,
                store: me.store,
                floating: true,
                displayField: me.displayField,
                columns: me.columns,
                minHeight: me.minPickerHeight,
                maxHeight: me.maxPickerHeight,
                rootVisible: this.rootVisible === undefined ? false : this.rootVisible,
                manageHeight: true,
                shadow: false,
                allowDeselect: true,
                //selModel: Ext.create('Ext.selection.CheckboxModel', {
                //    checkOnly: true
                //}),
                listeners: {
                    scope: me,
                    itemclick: me.onItemClick
                },
                viewConfig: {
                    listeners: {
                        scope: me,
                        render: me.onViewRender
                    }
                }
            }),
            view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    },

    onViewRender: function (view) {
        view.getEl().on('keypress', this.onPickerKeypress, this);
    },

    /**
     * repaints the tree view
     */
    repaintPickerView: function () {
        var style = this.picker.getView().getEl().dom.style;

        // can't use Element.repaint because it contains a setTimeout, which results in a flicker effect
        style.display = style.display;
    },

    /**
     * Handles a click even on a tree node
     * @private
     * @param {Ext.tree.View} view
     * @param {Ext.data.Model} record
     * @param {HTMLElement} node
     * @param {Number} rowIndex
     * @param {Ext.event.Event} e
     */
    onItemClick: function (view, record, node, rowIndex, e) {
        this.selectItem(record);
    },

    /**
     * Handles a keypress event on the picker element
     * @private
     * @param {Ext.event.Event} e
     * @param {HTMLElement} el
     */
    onPickerKeypress: function (e, el) {
        var key = e.getKey();

        if (key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
            this.selectItem(this.picker.getSelectionModel().getSelection()[0]);
        }
    },

    /**
     * Changes the selection to a given record and closes the picker
     * @private
     * @param {Ext.data.Model} record
     */
    selectItem: function (record) {
        var me = this;
        var values = me.getValue() == undefined ? new Array() : me.getValue();
        if (me.picker.getSelectionModel().getCount() != values.length) {
            if ($.inArray(record.getId(), values) == -1)
                values.push(record.getId());
            else
                values.splice($.inArray(record.getId(), values), 1);
            me.setValue(values);
        }
        me.fireEvent('select', me, record);
        //me.collapse();
        //var checked = record.data.checked ? false : true;
        //me.onCheckChange(record, checked);
    },
    //onCheckChange: function (node, checked) {//only one level's checked is changed  
    //    var me = this;
    //    node.set('checked', checked);
    //    if (checked) {//change from unchecked to checked  
    //        node.cascadeBy(function (cNode) {/*ok~*/
    //            //me.removeChildItems(cNode);
    //            if (cNode.hasChildNodes()) {
    //                cNode.eachChild(function (childNode) {
    //                    childNode.set('checked', true);
    //                });
    //            }
    //        });
    //        me.selectItem(node);//this function can refresh the value shown in textfield//  
    //        node.bubble(function (pNode) {//pNode begins from the current Node/*ok~*/  
    //            /*so i directly find it's parent and check if the parent's children 
    //            *is all checked(true), if it is then set the parentNode's checked 
    //            *'true*/
    //            if (pNode.parentNode != null) {
    //                var checkParent = true;
    //                pNode.parentNode.eachChild(function (subling) {
    //                    if (!subling.data.checked) { checkParent = false; }
    //                });
    //                if (checkParent) {
    //                    pNode.parentNode.set('checked', true);
    //                    me.removeChildItems(pNode.parentNode);
    //                    me.selectItem(pNode.parentNode);
    //                }
    //            }
    //        });
    //    } else {//change from checked to unchecked  
    //        node.bubble(function (pNode) {
    //            if (pNode.parentNode != null) {
    //                me.addChildItems(pNode.parentNode);//the current node is also added  
    //            }
    //            me.removeItem(pNode);//the current node is also removed   
    //            pNode.set('checked', false);
    //        });
    //        node.cascadeBy(function (cNode) {
    //            cNode.set('checked', false);
    //        });

    //    }
    //},
    /**
     * Runs when the picker is expanded.  Selects the appropriate tree node based on the value of the input element,
     * and focuses the picker so that keyboard navigation will work.
     * @private
     */
    onExpand: function () {
        var me = this,
            picker = me.picker,
            store = picker.store,
            value = me.value,
            node;


        if (value) {
            node = store.getNodeById(value);
        }

        if (!node) {
            node = store.getRoot();
        }

        picker.selectPath(node.getPath());
    },

    /**
     * Sets the specified value into the field
     * @param {Mixed} value
     * @return {Ext.ux.TreePicker} this
     */
    setValue: function (values) {
        var me = this,
                record;
        if (values) {

            if ((typeof (values[0])).toLocaleLowerCase() == 'object') {
                var v = [];
                $.each(values, function (index, o) {
                    v.push(o[me.valueField]);
                });
                values = v;
            }
            me.value = values;
            me.callParent(arguments);
            if (me.store.loading) {
                // Called while the Store is loading. Ensure it is processed by the onLoad method.
                return me;
            }
            // try to find a record in the store that matches the value
            var displayFields = new Array();
            var records = new Array();
            $.each(values, function (index, value) {
                var record = me.store.getNodeById(value);
                records.push(record);
                displayFields.push(record.get(me.displayField));
            });
            //me.fireEvent('select', me, records[0]);
            //me.picker.getSelection();
            //// set the raw value to the record's display field if a record was found
            me.setRawValue(displayFields.length > 0 ? displayFields : '');
        } else {
            me.value = '';
            me.setRawValue('');
            me.callParent(arguments);
        }
        return me;
    },

    getSubmitValue: function () {
        return this.value;
    },

    /**
     * Returns the current data value of the field (the idProperty of the record)
     * @return {Number}
     */
    getValue: function () {
        return this.value;
    },

    /**
     * Handles the store's load event.
     * @private
     */
    onLoad: function () {
        var value = this.value;

        if (value) {
            this.setValue(value);
        }
    },

    onUpdate: function (store, rec, type, modifiedFieldNames) {
        var display = this.displayField;

        if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.getId()) {
            this.setRawValue(rec.get(display));
        }
    }

});