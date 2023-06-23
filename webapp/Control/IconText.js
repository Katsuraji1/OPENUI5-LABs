sap.ui.define([
	'sap/m/Text',
	'sap/ui/core/Control',
	'sap/ui/core/Icon'
], function(Text,Control,Icon) {
	'use strict';
	return Control.extend('./IconText', {
		metadata: {
			properties: {
				icon: {type: 'sap.ui.core.URI'},
				text: {type: 'string', defaultValue: 'no data'},
                iconColor: {type: 'sap.ui.core.IconColor'}
			},
			aggregations: {
				_icon: {type: 'sap.ui.core.Icon', multiple: false, visibility : "hidden"},
				_text: {type: 'sap.m.Text', multiple: false, visibility : "hidden"}
			},
			events: {
				press: {}
			}
		},
		init: function(){
			this.setAggregation('_icon', new Icon({
				src: this.getIcon(),
			}).addStyleClass("cursorPointer"));
			this.setAggregation('_text', new Text({
				text: this.getText()
			}).addStyleClass("cursorPointer"));
		},

        onclick: function(){
            this.firePress();
        },

		setText: function(fValue){
			this.setProperty('text', fValue);
			this.getAggregation('_text').setText(fValue);
			return this;
		},

		setIcon: function(fValue){
			this.getAggregation('_icon').setSrc(fValue);
			return this;
		},

		renderer: {
			apiVersion: 4,
			render: function(oRm, oControl){
				oRm.openStart("div", oControl);
				oRm.class('customControl')
				oRm.openEnd();
				oRm.renderControl(oControl.getAggregation("_icon").setColor(oControl.getIconColor()));
				oRm.renderControl(oControl.getAggregation("_text"));
				oRm.close("div");
			}
		},
	})
});