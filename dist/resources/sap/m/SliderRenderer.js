/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./SliderUtilities","sap/ui/core/InvisibleText","sap/ui/core/Configuration"],function(e,t,a){"use strict";var i={apiVersion:2};i.CSS_CLASS="sapMSlider";i.render=function(e,t){var a=t.getEnabled(),r=t.getTooltip_AsString(),s=i.CSS_CLASS,n=t.getAriaLabelledBy().reduce(function(e,t){return e+" "+t},"");e.openStart("div",t);this.addClass(e,t);if(!a){e.class(s+"Disabled")}e.style("width",t.getWidth());if(r&&t.getShowHandleTooltip()){e.attr("title",t._formatValueByCustomElement(r))}e.openEnd();e.openStart("div",t.getId()+"-inner");this.addInnerClass(e,t);if(!a){e.class(s+"InnerDisabled")}e.openEnd();if(t.getEnableTickmarks()){this.renderTickmarks(e,t)}if(t.getProgress()){this.renderProgressIndicator(e,t,n)}this.renderHandles(e,t,n);e.close("div");this.renderLabels(e,t);if(t.getName()){this.renderInput(e,t)}e.close("div")};i.renderProgressIndicator=function(e,t){e.openStart("div",t.getId()+"-progress");this.addProgressIndicatorClass(e,t);e.style("width",t._sProgressValue);e.attr("aria-hidden","true");e.openEnd().close("div")};i.renderHandles=function(e,t,a){this.renderHandle(e,t,{id:t.getId()+"-handle",forwardedLabels:a})};i.renderHandle=function(e,i,r){var s=i.getEnabled();e.openStart("span",r&&r.id);if(i.getShowHandleTooltip()&&!i.getShowAdvancedTooltip()){this.writeHandleTooltip(e,i)}if(i.getInputsAsTooltips()){e.attr("aria-describedby",t.getStaticId("sap.m","SLIDER_INPUT_TOOLTIP"));s&&e.attr("aria-keyshortcuts","F2")}this.addHandleClass(e,i);e.style(a.getRTL()?"right":"left",i._sProgressValue);this.writeAccessibilityState(e,i,r);if(s){e.attr("tabindex","0")}e.openEnd().close("span")};i.writeHandleTooltip=function(e,t){e.attr("title",t._formatValueByCustomElement(t.toFixed(t.getValue())))};i.renderInput=function(e,t){e.voidStart("input",t.getId()+"-input").attr("type","text");e.class(i.CSS_CLASS+"Input");if(!t.getEnabled()){e.attr("disabled")}e.attr("name",t.getName());e.attr("value",t._formatValueByCustomElement(t.toFixed(t.getValue())));e.voidEnd()};i.writeAccessibilityState=function(e,t,a){var i=t.getValue(),r=t._isElementsFormatterNotNumerical(i),s=t._formatValueByCustomElement(i),n;if(t._getUsedScale()&&!r){n=s}else{n=t.toFixed(i)}e.accessibilityState(t,{role:"slider",orientation:"horizontal",valuemin:t.toFixed(t.getMin()),valuemax:t.toFixed(t.getMax()),valuenow:n,labelledby:{value:(a.forwardedLabels+" "+t.getAggregation("_handlesLabels")[0].getId()).trim()}});if(r){e.accessibilityState(t,{valuetext:s})}};i.renderTickmarks=function(t,a){var r,s,n,l,d,o,c,S=a._getUsedScale();if(!a.getEnableTickmarks()||!S){return}o=Math.abs(a.getMin()-a.getMax());c=a.getStep();l=S.getTickmarksBetweenLabels();s=S.calcNumberOfTickmarks(o,c,e.CONSTANTS.TICKMARKS.MAX_POSSIBLE);n=a._getPercentOfValue(this._calcTickmarksDistance(s,a.getMin(),a.getMax(),c));t.openStart("ul").class(i.CSS_CLASS+"Tickmarks").openEnd();this.renderTickmarksLabel(t,a,a.getMin());t.openStart("li").class(i.CSS_CLASS+"Tick").attr("data-ui5-active-tickmark",this.shouldRenderFirstActiveTickmark(a)).style("width",n+"%").openEnd().close("li");for(r=1;r<s-1;r++){if(l&&r%l===0){d=r*n;this.renderTickmarksLabel(t,a,a._getValueOfPercent(d))}t.openStart("li").class(i.CSS_CLASS+"Tick").style("width",n+"%");this.applyTickmarkStyles(t,a,r,s);t.openEnd().close("li")}this.renderTickmarksLabel(t,a,a.getMax());t.openStart("li").class(i.CSS_CLASS+"Tick").attr("data-ui5-active-tickmark",this.shouldRenderLastActiveTickmark(a)).style("width","0").openEnd().close("li");t.close("ul")};i.renderTickmarksLabel=function(e,t,r){var s=t._getPercentOfValue(r);var n=a.getRTL()?"right":"left";var l;r=t.toFixed(r,t.getDecimalPrecisionOfNumber(t.getStep()));l=t._formatValueByCustomElement(r,"scale");e.openStart("li").class(i.CSS_CLASS+"TickLabel").style(n,s+"%").openEnd();e.openStart("div").class(i.CSS_CLASS+"Label").openEnd().text(l).close("div");e.close("li")};i._calcTickmarksDistance=function(e,t,a,i){var r=Math.abs(t-a),s=Math.floor(r/i),n=Math.ceil(s/e);return t+n*i};i.addClass=function(e,t){e.class(i.CSS_CLASS)};i.addInnerClass=function(e,t){e.class(i.CSS_CLASS+"Inner");if(t.getProperty("handlePressed")){e.class(i.CSS_CLASS+"Pressed")}};i.addProgressIndicatorClass=function(e,t){e.class(i.CSS_CLASS+"Progress");if(t.getEnableTickmarks()){e.class(i.CSS_CLASS+"ProgressWithTickmarks")}};i.addHandleClass=function(e,t){e.class(i.CSS_CLASS+"Handle")};i.renderLabels=function(e,t){t.getAggregation("_handlesLabels").forEach(e.renderControl,e)};i.applyTickmarkStyles=function(e,t,a,i){var r=parseInt(t._sProgressValue)/100*i;var s=a<=r;e.attr("data-ui5-active-tickmark",s)};i.shouldRenderFirstActiveTickmark=function(){return true};i.shouldRenderLastActiveTickmark=function(e){return e.getValue()===e.getMax()};return i},true);
//# sourceMappingURL=SliderRenderer.js.map