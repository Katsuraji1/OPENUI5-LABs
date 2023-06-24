/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/library","sap/m/Image","sap/m/Label","./BusyIndicatorRenderer"],function(t,e,i,s,o,a){"use strict";var n=i.TextDirection;var r=e.extend("sap.m.BusyIndicator",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Data",defaultValue:""},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:n.Inherit},customIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:""},customIconRotationSpeed:{type:"int",group:"Appearance",defaultValue:1e3},customIconDensityAware:{type:"boolean",defaultValue:true},customIconWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"44px"},customIconHeight:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"44px"},size:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"1rem"},design:{type:"string",group:"Appearance",defaultValue:"auto",deprecated:true}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}},renderer:a});r.prototype.init=function(){this.setBusyIndicatorDelay(0)};r.prototype.onBeforeRendering=function(){if(this.getCustomIcon()){this.setBusy(false)}else{this.setBusy(true,"busy-area")}if(this._busyLabel){this._busyLabel.setTextDirection(this.getTextDirection())}if(this._iconImage){this._iconImage.setDensityAware(this.getCustomIconDensityAware());this._iconImage.setSrc(this.getCustomIcon());this._iconImage.setWidth(this.getCustomIconWidth());this._iconImage.setHeight(this.getCustomIconHeight())}else if(!this._iconImage&&this.getCustomIcon()){this._createCustomIcon(this.getCustomIcon()).addStyleClass("sapMBsyIndIcon")}if(this._busyLabel){this._busyLabel.setText(this.getText());this._busyLabel.setTextDirection(this.getTextDirection())}else if(!this._busyLabel&&this.getText()){this._createLabel(this.getText())}};r.prototype.onAfterRendering=function(){this._setRotationSpeed()};r.prototype.exit=function(){if(this._iconImage){this._iconImage.destroy();this._iconImage=null}if(this._busyLabel){this._busyLabel.destroy();this._busyLabel=null}};r.prototype._createCustomIcon=function(t){this._iconImage=new s(this.getId()+"-icon",{src:t,width:this.getCustomIconWidth(),height:this.getCustomIconHeight(),densityAware:this.getCustomIconDensityAware()});return this._iconImage};r.prototype._createLabel=function(t){this._busyLabel=new o(this.getId()+"-label",{labelFor:this.getId(),text:t,textAlign:"Center",textDirection:this.getTextDirection()});return this._busyLabel};r.prototype._setRotationSpeed=function(){if(!this._iconImage){return}var t=this.getCustomIconRotationSpeed();if(t===this.getMetadata().getProperty("customIconRotationSpeed").getDefaultValue()){return}t=Math.max(0,t);var e=this._iconImage.$();var i=t+"ms";e.css("animation-duration",i);e.css("display","none");setTimeout(function(){e.css("display","inline")},0)};return r});
//# sourceMappingURL=BusyIndicator.js.map