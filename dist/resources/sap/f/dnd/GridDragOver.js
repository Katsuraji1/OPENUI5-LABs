/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/core/Configuration","sap/ui/core/Element"],function(t,jQuery,i,e,o){"use strict";var r=t.extend("sap.f.dnd.GridDragOver",{_iTimeoutBeforeDrop:200,_$indicator:jQuery("<div class='sapUiDnDGridIndicator'></div>"),constructor:function(){this._oDragControlDelegate={ondragend:this.scheduleEndDrag};this._oDropContainerDelegate={ondragleave:this._onDragLeave,onBeforeRendering:this._onDropContainerBeforeRendering,onAfterRendering:this._onDropContainerAfterRendering}},destroy:function(){this._oDragEndDelegate=null}});r.prototype.setCurrentContext=function(t,i,e,o){if(this._oDragControl===t&&this._oDropContainer===i&&this._sTargetAggregation===e){return this}if(this._oDragControl&&this._oDragControl!==t){this.endDrag()}this._oDragControl=t;this._oDragContainer=t.getParent();this._oDropContainer=i;this._sTargetAggregation=e;this._oCoreDragSession=o;this._mDragItemDimensions=this._getDimensions(t);this._bIsInSameContainer=this._oDragContainer===this._oDropContainer;if(this._bIsInSameContainer){this._iDragFromIndex=i.indexOfAggregation(e,t)}else{this._iDragFromIndex=null}i.getAggregation(e).forEach(function(t){t.addStyleClass("sapUiDnDGridControl")});this._attachEventDelegates();this._hideCoreDefaultIndicator();return this};r.prototype.handleDragOver=function(t){if(this._shouldFreeze(t.pageX,t.pageY)){return}this._hideCoreDefaultIndicator();var i=this._calculateDropPosition(t);if(!i){return}if(this._timeoutOnSamePosition(i)){if(i.targetControl===this._oDragControl){return}this._hideDraggedItem();this._showIndicator(i,t);this._freezeCurrentPosition(t.pageX,t.pageY)}};r.prototype.getSuggestedDropPosition=function(){return this._mLastDropPosition};r.prototype.setDropIndicatorSize=function(t){if(!t){this._mDropIndicatorSize=null;return}if(!t.rows||!t.columns){i.error("Custom indicator size for grid drag and drop is not valid. It must be an object with rows and columns properties: '{rows: <int>, columns: <int>}'.");this._mDropIndicatorSize=null;return}this._mDropIndicatorSize=t};r.prototype.scheduleEndDrag=function(){if(!this._isDragActive()){return}var t=this._oDropContainer.getBindingInfo(this._sTargetAggregation);if(t&&t.template){setTimeout(this.endDrag.bind(this),0)}else{this.endDrag()}};r.prototype.endDrag=function(){if(!this._isDragActive()){return}this._hideIndicator();this._showDraggedItem();this._removeEventDelegates();this._resetCoreDefaultIndicator();this._mDropIndicatorSize=null;this._oDragControl=null;this._oDropContainer=null;this._sTargetAggregation=null;this._iDragFromIndex=null;this._iDropPositionHoldStart=null;this._mLastDropPosition=null;this._mFreezePosition=null;this._oCoreDragSession=null};r.prototype._isDragActive=function(){return this._oDragControl&&this._oDropContainer};r.prototype._showIndicator=function(t,i){var e=this._oDropContainer,o=e.getDomRefForSetting(this._sTargetAggregation)||e.getDomRef(),r=t.targetControl,n=e.indexOfAggregation(this._sTargetAggregation,r),s,a,g;if(r){s=this._findContainingGridItem(r);a=s||r.$()}if(this._mDropIndicatorSize){g={"grid-row-start":"span "+this._mDropIndicatorSize.rows,"grid-column-start":"span "+this._mDropIndicatorSize.columns}}else{g={"grid-column-start":this._mDragItemDimensions.columnsSpan,"grid-row-start":this._mDragItemDimensions.rowsSpan}}if(g){this._$indicator.css(g)}if(a&&t.position=="Before"){this._$indicator.insertBefore(a)}else if(a){this._$indicator.insertAfter(a);n+=1}else{o.appendChild(this._$indicator[0])}this._$indicator.show();this._iDragFromIndex=n};r.prototype._hideIndicator=function(){this._$indicator.detach();this._$indicator.attr("style","")};r.prototype._hideDraggedItem=function(){this._oDragControl.$().hide();var t=this._findContainingGridItem(this._oDragControl);if(t&&this._bIsInSameContainer){t.hide()}};r.prototype._showDraggedItem=function(){if(this._oDragControl.getDomRef()){this._oDragControl.$().show()}var t=this._findContainingGridItem(this._oDragControl);if(t){t.show()}};r.prototype._hideCoreDefaultIndicator=function(){var t=this._oCoreDragSession.getIndicator(),i={visibility:"hidden",position:"relative"};this._oCoreDragSession.setIndicatorConfig(i);if(t){jQuery(t).css(i)}};r.prototype._resetCoreDefaultIndicator=function(){var t=this._oCoreDragSession.getIndicator(),i={visibility:"visible",position:"absolute"};this._oCoreDragSession.setIndicatorConfig(i);if(t){jQuery(t).css(i)}};r.prototype._timeoutOnSamePosition=function(t){if(!this._mLastDropPosition||t.targetControl!==this._mLastDropPosition.targetControl||t.position!=this._mLastDropPosition.position){this._iDropPositionHoldStart=Date.now();this._mLastDropPosition=t;return false}return Date.now()-this._iDropPositionHoldStart>this._iTimeoutBeforeDrop};r.prototype._shouldFreeze=function(t,i){var e=20;return this._mFreezePosition&&Math.abs(this._mFreezePosition.pageX-t)<e&&Math.abs(this._mFreezePosition.pageY-i)<e};r.prototype._freezeCurrentPosition=function(t,i){this._mFreezePosition={pageX:t,pageY:i}};r.prototype._calculateDropPosition=function(t){var i=this._findItemFromPoint(t.pageX,t.pageY),e,r,n;if(!i){e=this._findClosestItem(t.pageX,t.pageY)}if(e){i=e.target}if(e&&e.direction==="Left"){n="After"}if(!i){i=this._getLastItem();n="After"}if(!i){return{targetControl:null,position:"After"}}if(i.hasClass("sapUiDnDGridIndicator")){return null}r=o.closestTo(i[0],true);if(!n){n=this._calculateDropBeforeOrAfter(r,t)}return{targetControl:r,position:n}};r.prototype._calculateDropBeforeOrAfter=function(t,i){var e=this._getDimensions(t),o=e.rect;if(this._oDragControl===t){return"Before"}if(this._mDragItemDimensions.rect.width*1.5<o.width){var r=window.pageXOffset,n={left:o.left+r,width:o.width},s=i.pageX-n.left;return s<n.width*.5?"Before":"After"}if(this._iDragFromIndex===null){return"Before"}var a=this._oDropContainer.indexOfAggregation(this._sTargetAggregation,t);if(this._iDragFromIndex>a){return"Before"}return"After"};r.prototype._getDimensions=function(t){var i=this._findContainingGridItem(t);if(i){return{rect:i[0].getBoundingClientRect(),columnsSpan:i.css("grid-column-start"),rowsSpan:i.css("grid-row-start")}}return{rect:t.getDomRef().getBoundingClientRect(),columnsSpan:"span 1",rowsSpan:"span 1"}};r.prototype._findContainingGridItem=function(t){var i=t.$(),e=i.parent().css("display");if(e==="grid"||e==="inline-grid"){return i}e=i.parent().parent().css("display");if(e==="grid"||e==="inline-grid"){return i.parent()}return null};r.prototype._getLastItem=function(){var t=this._oDropContainer.getAggregation(this._sTargetAggregation),i;if(t&&t.length){i=t[t.length-1].$()}return i};r.prototype._findItemFromPoint=function(t,i){var e=document.elementFromPoint(t-window.pageXOffset,i-window.pageYOffset),o=jQuery(e).closest(".sapUiDnDGridControl, .sapUiDnDGridIndicator");if(o.hasClass("sapUiDnDGridIndicator")){return o}if(o.hasClass("sapUiDnDGridControl")){return o}return null};r.prototype._findClosestItem=function(t,i){var o=e.getRTL(),r=o?-1:1,n=80*r,s=20,a,g,h=0,d=t-n;while(!a&&d>0&&h<4){a=this._findItemFromPoint(d,i);d-=n;h++}if(a){g="Left"}if(!a&&i-s>0){a=this._findItemFromPoint(t,i-20);g="Top"}return{target:a,direction:g}};r.prototype._removeEventDelegates=function(){if(this._oDropContainer){this._oDropContainer.removeEventDelegate(this._oDropContainerDelegate)}if(this._oDragControl){this._oDragControl.removeEventDelegate(this._oDragControlDelegate)}};r.prototype._attachEventDelegates=function(){this._removeEventDelegates();this._oDragControl.addEventDelegate(this._oDragControlDelegate,this);this._oDropContainer.addEventDelegate(this._oDropContainerDelegate,this)};r.prototype._onDragLeave=function(t){var i=document.elementFromPoint(t.pageX-window.pageXOffset,t.pageY-window.pageYOffset),e=this._oDropContainer.getDomRef().contains(i);if(!e){this.scheduleEndDrag()}};r.prototype._onDropContainerBeforeRendering=function(){if(!this._isDragActive()){return}this._hideIndicator()};r.prototype._onDropContainerAfterRendering=function(){if(!this._isDragActive()){return}this._hideDraggedItem();if(this._mLastDropPosition){this._showIndicator(this._mLastDropPosition)}};var n;r.getInstance=function(){if(!n){n=new r}return n};return r});
//# sourceMappingURL=GridDragOver.js.map