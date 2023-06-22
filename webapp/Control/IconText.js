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
			}));
			this.setAggregation('_text', new Text({
				text: this.getText()
			}));
		},

        onclick: function(){
            this.firePress();
        },

        onBeforeRendering: function() {
            this.getAggregation('_text').setText(this.getText());
            this.getAggregation('_icon').setSrc(this.getIcon());
        },
		renderer: {
			apiVersion: 4,
			render: function(oRm, oControl){
				oRm.openStart("div", oControl);
				oRm.openEnd();
				oRm.renderControl(oControl.getAggregation("_icon").setColor(oControl.getIconColor()));
				oRm.renderControl(oControl.getAggregation("_text"));
				oRm.close("div");
			}
		},
	})
});