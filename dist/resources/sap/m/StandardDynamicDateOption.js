/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","./DynamicDateOption","./Label","./RadioButton","./RadioButtonGroup","sap/ui/core/date/UniversalDateUtils","sap/ui/core/date/UniversalDate","sap/m/DynamicDateValueHelpUIType","./library"],function(e,t,a,s,T,r,n,E,A){"use strict";var R=e.VerticalAlign;var S=t.extend("sap.m.StandardDynamicDateOption",{metadata:{library:"sap.m",properties:{calendarWeekNumbering:{type:"sap.ui.core.date.CalendarWeekNumbering",group:"Appearance",defaultValue:null}}}});var c=1;var i=6e3;var l={DATE:"DATE",DATETIME:"DATETIME",DATERANGE:"DATERANGE",DATETIMERANGE:"DATETIMERANGE",TODAY:"TODAY",YESTERDAY:"YESTERDAY",TOMORROW:"TOMORROW",SPECIFICMONTH:"SPECIFICMONTH",SPECIFICMONTHINYEAR:"SPECIFICMONTHINYEAR",FIRSTDAYWEEK:"FIRSTDAYWEEK",LASTDAYWEEK:"LASTDAYWEEK",FIRSTDAYMONTH:"FIRSTDAYMONTH",LASTDAYMONTH:"LASTDAYMONTH",FIRSTDAYQUARTER:"FIRSTDAYQUARTER",LASTDAYQUARTER:"LASTDAYQUARTER",FIRSTDAYYEAR:"FIRSTDAYYEAR",LASTDAYYEAR:"LASTDAYYEAR",THISWEEK:"THISWEEK",THISMONTH:"THISMONTH",THISQUARTER:"THISQUARTER",THISYEAR:"THISYEAR",LASTWEEK:"LASTWEEK",LASTMONTH:"LASTMONTH",LASTQUARTER:"LASTQUARTER",LASTYEAR:"LASTYEAR",NEXTWEEK:"NEXTWEEK",NEXTMONTH:"NEXTMONTH",NEXTQUARTER:"NEXTQUARTER",NEXTYEAR:"NEXTYEAR",LASTMINUTES:"LASTMINUTES",LASTHOURS:"LASTHOURS",LASTDAYS:"LASTDAYS",LASTWEEKS:"LASTWEEKS",LASTMONTHS:"LASTMONTHS",LASTQUARTERS:"LASTQUARTERS",LASTYEARS:"LASTYEARS",NEXTMINUTES:"NEXTMINUTES",NEXTHOURS:"NEXTHOURS",NEXTDAYS:"NEXTDAYS",NEXTWEEKS:"NEXTWEEKS",NEXTMONTHS:"NEXTMONTHS",NEXTQUARTERS:"NEXTQUARTERS",NEXTYEARS:"NEXTYEARS",FROM:"FROM",TO:"TO",FROMDATETIME:"FROMDATETIME",TODATETIME:"TODATETIME",YEARTODATE:"YEARTODATE",DATETOYEAR:"DATETOYEAR",TODAYFROMTO:"TODAYFROMTO",QUARTER1:"QUARTER1",QUARTER2:"QUARTER2",QUARTER3:"QUARTER3",QUARTER4:"QUARTER4"};var D={SingleDates:1,DateRanges:2,Weeks:3,Months:4,Quarters:5,Years:6};var g={DATE:D.SingleDates,DATETIME:D.SingleDates,DATERANGE:D.DateRanges,DATETIMERANGE:D.DateRanges,TODAY:D.SingleDates,YESTERDAY:D.SingleDates,TOMORROW:D.SingleDates,SPECIFICMONTH:D.Months,SPECIFICMONTHINYEAR:D.Months,FIRSTDAYWEEK:D.SingleDates,LASTDAYWEEK:D.SingleDates,FIRSTDAYMONTH:D.SingleDates,LASTDAYMONTH:D.SingleDates,FIRSTDAYQUARTER:D.SingleDates,LASTDAYQUARTER:D.SingleDates,FIRSTDAYYEAR:D.SingleDates,LASTDAYYEAR:D.SingleDates,THISWEEK:D.Weeks,THISMONTH:D.Months,THISQUARTER:D.Quarters,THISYEAR:D.Years,LASTWEEK:D.Weeks,LASTMONTH:D.Months,LASTQUARTER:D.Quarters,LASTYEAR:D.Years,NEXTWEEK:D.Weeks,NEXTMONTH:D.Months,NEXTQUARTER:D.Quarters,NEXTYEAR:D.Years,LASTMINUTES:D.DateRanges,LASTHOURS:D.DateRanges,LASTDAYS:D.DateRanges,LASTWEEKS:D.DateRanges,LASTMONTHS:D.DateRanges,LASTQUARTERS:D.DateRanges,LASTYEARS:D.DateRanges,NEXTMINUTES:D.DateRanges,NEXTHOURS:D.DateRanges,NEXTDAYS:D.DateRanges,NEXTWEEKS:D.DateRanges,NEXTMONTHS:D.DateRanges,NEXTQUARTERS:D.DateRanges,NEXTYEARS:D.DateRanges,FROM:D.DateRanges,TO:D.DateRanges,FROMDATETIME:D.DateRanges,TODATETIME:D.DateRanges,YEARTODATE:D.DateRanges,DATETOYEAR:D.DateRanges,TODAYFROMTO:D.DateRanges,QUARTER1:D.Quarters,QUARTER2:D.Quarters,QUARTER3:D.Quarters,QUARTER4:D.Quarters};var u=["LASTMINUTES","LASTHOURS","LASTDAYS","LASTWEEKS","LASTMONTHS","LASTQUARTERS","LASTYEARS"];var o=["NEXTMINUTES","NEXTHOURS","NEXTDAYS","NEXTWEEKS","NEXTMONTHS","NEXTQUARTERS","NEXTYEARS"];S.LastXKeys=u;S.NextXKeys=o;var O=sap.ui.getCore().getLibraryResourceBundle("sap.m");S.Keys=l;S.prototype.exit=function(){if(this.aValueHelpUITypes){while(this.aValueHelpUITypes.length){this.aValueHelpUITypes.pop().destroy()}delete this.aValueHelpUITypes}};S.prototype.getText=function(e){var t=this.getKey();var a=e._getOptions();var s=this.getValueHelpUITypes(e);var T=this._getOptionParams(u,a);var r=this._getOptionParams(o,a);if(T){s.push(T)}if(r){s.push(r)}switch(t){case l.LASTMINUTES:case l.LASTHOURS:case l.LASTDAYS:case l.LASTWEEKS:case l.LASTMONTHS:case l.LASTQUARTERS:case l.LASTYEARS:case l.NEXTMINUTES:case l.NEXTHOURS:case l.NEXTDAYS:case l.NEXTWEEKS:case l.NEXTMONTHS:case l.NEXTQUARTERS:case l.NEXTYEARS:return this._getXPeriodTitle(s[1].getOptions());case l.FROMDATETIME:case l.TODATETIME:case l.DATETIMERANGE:return e._findOption(t)._bAdditionalTimeText?O.getText("DYNAMIC_DATE_"+t+"_TITLE")+" ("+O.getText("DYNAMIC_DATE_DATETIME_TITLE")+")":O.getText("DYNAMIC_DATE_"+t+"_TITLE");default:return O.getText("DYNAMIC_DATE_"+t+"_TITLE")}};S.prototype.getValueHelpUITypes=function(e){var t=this.getKey();if(!this.aValueHelpUITypes){switch(t){case l.TODAY:case l.YESTERDAY:case l.TOMORROW:case l.FIRSTDAYWEEK:case l.LASTDAYWEEK:case l.FIRSTDAYMONTH:case l.LASTDAYMONTH:case l.FIRSTDAYQUARTER:case l.LASTDAYQUARTER:case l.FIRSTDAYYEAR:case l.LASTDAYYEAR:case l.THISWEEK:case l.THISMONTH:case l.THISQUARTER:case l.THISYEAR:case l.LASTWEEK:case l.LASTMONTH:case l.LASTQUARTER:case l.LASTYEAR:case l.NEXTWEEK:case l.NEXTMONTH:case l.NEXTQUARTER:case l.NEXTYEAR:case l.YEARTODATE:case l.DATETOYEAR:case l.QUARTER1:case l.QUARTER2:case l.QUARTER3:case l.QUARTER4:this.aValueHelpUITypes=[];break;case l.DATETIME:case l.FROMDATETIME:case l.TODATETIME:this.aValueHelpUITypes=[new E({type:"datetime"})];break;case l.DATE:case l.FROM:case l.TO:this.aValueHelpUITypes=[new E({type:"date"})];break;case l.DATERANGE:this.aValueHelpUITypes=[new E({type:"daterange"})];break;case l.SPECIFICMONTH:this.aValueHelpUITypes=[new E({type:"month"})];break;case l.SPECIFICMONTHINYEAR:this.aValueHelpUITypes=[new E({type:"custommonth"})];break;case l.LASTMINUTES:case l.LASTHOURS:case l.LASTDAYS:case l.LASTWEEKS:case l.LASTMONTHS:case l.LASTQUARTERS:case l.LASTYEARS:case l.NEXTMINUTES:case l.NEXTHOURS:case l.NEXTDAYS:case l.NEXTWEEKS:case l.NEXTMONTHS:case l.NEXTQUARTERS:case l.NEXTYEARS:this.aValueHelpUITypes=[new E({text:O.getText("DDR_LASTNEXTX_LABEL"),type:"int"})];break;case l.TODAYFROMTO:this.aValueHelpUITypes=[new E({text:O.getText("DDR_TODAYFROMTO_FROM_LABEL"),type:"int",additionalText:O.getText("DDR_TODAYFROMTO_TO_ADDITIONAL_LABEL")}),new E({text:O.getText("DDR_TODAYFROMTO_TO_LABEL"),type:"int",additionalText:O.getText("DDR_TODAYFROMTO_TO_ADDITIONAL_LABEL")})];break;case l.DATETIMERANGE:this.aValueHelpUITypes=[new E({text:O.getText("DDR_DATETIMERANGE_FROM_LABEL"),type:"datetime"}),new E({text:O.getText("DDR_DATETIMERANGE_TO_LABEL"),type:"datetime"})];break}}return this.aValueHelpUITypes.slice(0)};S.prototype.createValueHelpUI=function(e,t){var s=e._getOptions(),T=e.getValue()&&Object.assign({},e.getValue()),r=this.getValueHelpUITypes(e),n=[],E,A=e.getCalendarWeekNumbering();if(!e.aControlsByParameters){e.aControlsByParameters={}}e.aControlsByParameters[this.getKey()]=[];var S=this._getOptionParams(u,s),c=this._getOptionParams(o,s);if(S){r.push(S)}if(c){r.push(c)}if(T&&T.values){T.values=T.values.map(function(e){return e})}for(var i=0;i<r.length;i++){E=null;if(r[i].getOptions()&&r[i].getOptions().length<=1){break}else if(r[i].getText()){E=new a({text:r[i].getText(),width:"100%"});n.push(E)}var l;switch(r[i].getType()){case"int":l=this._createIntegerControl(T,i,t);if(T&&r[1]&&r[1].getOptions()&&r[1].getOptions().indexOf(T.operator.slice(4).toLowerCase())!==-1){l.setValue(T.values[i])}break;case"date":l=this._createDateControl(T,i,t,A);break;case"datetime":if(r.length===1){l=this._createDateTimeInnerControl(T,i,t,A)}else if(r.length===2){l=this._createDateTimeControl(T,i,t,A)}break;case"daterange":l=this._createDateRangeControl(T,i,t,A);break;case"month":l=this._createMonthControl(T,i,t);break;case"custommonth":l=this._createCustomMonthControl(T,i,t);break;case"options":l=this._createOptionsControl(T,i,t,r);break;default:break}n.push(l);E&&E.setLabelFor(l);if(r[i].getAdditionalText()){n.push(new a({vAlign:R.Bottom,text:r[i].getAdditionalText()}).addStyleClass("sapMDDRAdditionalLabel"))}e.aControlsByParameters[this.getKey()].push(l)}return n};S.prototype._createIntegerControl=function(e,a,s){var T=t.prototype._createIntegerControl.call(this,e,a,s);var r=this.getKey()==="TODAYFROMTO"?-i:c;var n=!e||this.getKey()!==e.operator;if(n){T.setValue(1)}T.setMin(r);T.setMax(i);return T};S.prototype._createOptionsControl=function(e,t,a,s){var r=new T({buttons:[s[t].getOptions().map(N)]});if(e){var n=s[t].getOptions().indexOf(e.operator.slice(4).toLowerCase());if(n!==-1){r.setSelectedIndex(n)}}if(a instanceof Function){r.attachSelect(function(){a(this)},this)}return r};S.prototype._getOptionParams=function(e,t){if(e.indexOf(this.getKey())!==-1){return new E({text:O.getText("DDR_LASTNEXTX_TIME_PERIODS_LABEL"),type:"options",options:t?t.filter(function(t){return e.indexOf(t.getKey())!==-1}).map(function(e){return e.getKey().slice(4).toLowerCase()}):[]})}return undefined};S.prototype.validateValueHelpUI=function(e){var t=this.getValueHelpUITypes();for(var a=0;a<t.length;a++){var s=e.aControlsByParameters[this.getKey()][a];switch(t[a].getType()){case"int":if(s._isLessThanMin(s.getValue())||s._isMoreThanMax(s.getValue())){return false}break;case"month":case"custommonth":case"date":case"daterange":if(!s.getSelectedDates()||s.getSelectedDates().length==0){return false}break;case"datetime":if(t.length===1){if(!s.getCalendar().getSelectedDates()||s.getCalendar().getSelectedDates().length==0){return false}}else if(!s.getDateValue()&&t.length===2){return false}break;case"options":if(s.getSelectedIndex()<0){return false}break;default:break}}return true};S.prototype.getValueHelpOutput=function(e){var t=e._getOptions();var a=this.getValueHelpUITypes(e),s={},T;if(u.indexOf(this.getKey())!==-1&&e.aControlsByParameters[this.getKey()].length>1){s.operator=t.filter(function(e){return u.indexOf(e.getKey())!==-1})[e.aControlsByParameters[this.getKey()][1].getSelectedIndex()].getKey()}else if(o.indexOf(this.getKey())!==-1&&e.aControlsByParameters[this.getKey()].length>1){s.operator=t.filter(function(e){return o.indexOf(e.getKey())!==-1})[e.aControlsByParameters[this.getKey()][1].getSelectedIndex()].getKey()}else{s.operator=this.getKey()}s.values=[];for(var r=0;r<a.length;r++){var n=e.aControlsByParameters[this.getKey()][r];switch(a[r].getType()){case"int":T=n.getValue();break;case"month":if(!n.getSelectedDates()||!n.getSelectedDates().length){return null}T=n.getSelectedDates()[0].getStartDate().getMonth();break;case"custommonth":if(!n.getSelectedDates()||!n.getSelectedDates().length){return null}T=[n.getSelectedDates()[0].getStartDate().getMonth(),n.getSelectedDates()[0].getStartDate().getFullYear()];break;case"date":if(!n.getSelectedDates().length){return null}T=n.getSelectedDates()[0].getStartDate();break;case"datetime":if(a.length===1){var E,A,R,S;R=n.getCalendar();S=n.getClocks();if(!R.getSelectedDates().length){return null}E=R.getSelectedDates()[0].getStartDate();A=S.getTimeValues();E.setHours(A.getHours(),A.getMinutes(),A.getSeconds());T=E}else if(a.length===2){if(!n.getDateValue()){return null}T=n.getDateValue()}break;case"daterange":if(!n.getSelectedDates().length){return null}var c=n.getSelectedDates()[0].getEndDate()||n.getSelectedDates()[0].getStartDate();T=[n.getSelectedDates()[0].getStartDate(),c];break;default:break}if(Array.isArray(T)){s.values=Array.prototype.concat.apply(s.values,T)}else{T!==null&&T!==undefined&&s.values.push(T)}}return s};S.prototype.getGroup=function(){return g[this.getKey()]};S.prototype.getGroupHeader=function(){return O.getText("DDR_OPTIONS_GROUP_"+g[this.getKey()])};S.prototype.format=function(e,t){return t.format(e,true)};S.prototype.parse=function(e,t){return t.parse(e,this.getKey())};S.prototype.toDates=function(e,t){if(!e){return null}var a=e.operator;var s=e.values[0]||0;switch(a){case"SPECIFICMONTH":var T=new n;T.setMonth(e.values[0]);T=r.getMonthStartDate(T);return r.getRange(0,"MONTH",T);case"SPECIFICMONTHINYEAR":var T=new n;T.setMonth(e.values[0]);T.setYear(e.values[1]);T=r.getMonthStartDate(T);return r.getRange(0,"MONTH",T);case"DATE":return r.getRange(0,"DAY",n.getInstance(e.values[0]));case"DATETIME":var E=new n.getInstance(e.values[0]);return[E,E];case"DATERANGE":var A=n.getInstance(e.values[0]);var R=n.getInstance(e.values[1]);return[r.resetStartTime(A),r.resetEndTime(R)];case"DATETIMERANGE":var A=n.getInstance(e.values[0]);var R=n.getInstance(e.values[1]);A.setMilliseconds(0);R.setMilliseconds(999);return[A,R];case"TODAY":return r.ranges.today();case"YESTERDAY":return r.ranges.yesterday();case"TOMORROW":return r.ranges.tomorrow();case"FIRSTDAYWEEK":return r.ranges.firstDayOfWeek(t);case"LASTDAYWEEK":return r.ranges.lastDayOfWeek(t);case"FIRSTDAYMONTH":return r.ranges.firstDayOfMonth();case"LASTDAYMONTH":return r.ranges.lastDayOfMonth();case"FIRSTDAYQUARTER":return r.ranges.firstDayOfQuarter();case"LASTDAYQUARTER":return r.ranges.lastDayOfQuarter();case"FIRSTDAYYEAR":return r.ranges.firstDayOfYear();case"LASTDAYYEAR":return r.ranges.lastDayOfYear();case"THISWEEK":return r.ranges.currentWeek(t);case"THISMONTH":return r.ranges.currentMonth();case"THISQUARTER":return r.ranges.currentQuarter();case"THISYEAR":return r.ranges.currentYear();case"LASTWEEK":return r.ranges.lastWeek(t);case"LASTMONTH":return r.ranges.lastMonth();case"LASTQUARTER":return r.ranges.lastQuarter();case"LASTYEAR":return r.ranges.lastYear();case"NEXTWEEK":return r.ranges.nextWeek(t);case"NEXTMONTH":return r.ranges.nextMonth();case"NEXTQUARTER":return r.ranges.nextQuarter();case"NEXTYEAR":return r.ranges.nextYear();case"LASTMINUTES":return r.ranges.lastMinutes(s);case"LASTHOURS":return r.ranges.lastHours(s);case"LASTDAYS":return r.ranges.lastDays(s);case"LASTWEEKS":return r.ranges.lastWeeks(s,t);case"LASTMONTHS":return r.ranges.lastMonths(s);case"LASTQUARTERS":return r.ranges.lastQuarters(s);case"LASTYEARS":return r.ranges.lastYears(s);case"NEXTMINUTES":return r.ranges.nextMinutes(s);case"NEXTHOURS":return r.ranges.nextHours(s);case"NEXTDAYS":return r.ranges.nextDays(s);case"NEXTWEEKS":return r.ranges.nextWeeks(s,t);case"NEXTMONTHS":return r.ranges.nextMonths(s);case"NEXTQUARTERS":return r.ranges.nextQuarters(s);case"NEXTYEARS":return r.ranges.nextYears(s);case"FROM":return[n.getInstance(e.values[0])];case"TO":return[n.getInstance(e.values[0])];case"FROMDATETIME":var T=n.getInstance(e.values[0]);T.setMilliseconds(0);return[T];case"TODATETIME":var T=n.getInstance(e.values[0]);T.setMilliseconds(999);return[T];case"YEARTODATE":return r.ranges.yearToDate();case"DATETOYEAR":return r.ranges.dateToYear();case"TODAYFROMTO":if(e.values.length!==2){return[]}var S=e.values[0];var c=e.values[1];var A=S>=0?r.ranges.lastDays(S)[0]:r.ranges.nextDays(-S)[1];var R=c>=0?r.ranges.nextDays(c)[1]:r.ranges.lastDays(-c)[0];if(A.oDate.getTime()>R.oDate.getTime()){R=[A,A=R][0]}return[r.resetStartTime(A),r.resetEndTime(R)];case"QUARTER1":return r.ranges.quarter(1);case"QUARTER2":return r.ranges.quarter(2);case"QUARTER3":return r.ranges.quarter(3);case"QUARTER4":return r.ranges.quarter(4);default:return[]}};S.prototype.enhanceFormattedValue=function(){switch(this.getKey()){case"TODAY":case"YESTERDAY":case"TOMORROW":case"FIRSTDAYWEEK":case"LASTDAYWEEK":case"FIRSTDAYMONTH":case"LASTDAYMONTH":case"FIRSTDAYQUARTER":case"LASTDAYQUARTER":case"FIRSTDAYYEAR":case"LASTDAYYEAR":case"THISWEEK":case"THISMONTH":case"THISQUARTER":case"THISYEAR":case"LASTWEEK":case"LASTMONTH":case"LASTQUARTER":case"LASTYEAR":case"NEXTWEEK":case"NEXTMONTH":case"NEXTQUARTER":case"NEXTYEAR":case"YEARTODATE":case"DATETOYEAR":case"QUARTER1":case"QUARTER2":case"QUARTER3":case"QUARTER4":return true;default:return false}};S.prototype._getXPeriodTitle=function(e){var t,a=this.getKey();if(e.length===1){return O.getText("DYNAMIC_DATE_"+a+"_TITLE")}t=e.map(function(e){return O.getText("DYNAMIC_DATE_"+e.toUpperCase())}).join(" / ");if(a.indexOf("LAST")===0){return O.getText("DYNAMIC_DATE_LASTX_TITLE",t)}if(a.indexOf("NEXT")===0){return O.getText("DYNAMIC_DATE_NEXTX_TITLE",t)}};function N(e){return new s({text:O.getText("DYNAMIC_DATE_"+e.toUpperCase())})}return S});
//# sourceMappingURL=StandardDynamicDateOption.js.map