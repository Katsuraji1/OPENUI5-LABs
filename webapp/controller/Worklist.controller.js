/*global location history */
sap.ui.define([
		"zjblessons/Worklist/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Worklist/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.Worklist", {

			formatter: formatter,

			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay

				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					delay : 0,
					busy: true,
				});
				const list = this.getView().byId('list');
				this.setModel(oViewModel, 'worklistView');
				iOriginalBusyDelay = list.setBusyIndicatorDelay(0);

				list.attachEventOnce("updateFinished", function(){
					oViewModel.setProperty("/busy", false);
				});
			},


			onUpdateFinished : function (oEvent) {
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},


			onSelectionChange: function(oEvent){
				this.oData = oEvent.getSource().getSelectedContexts()[0].getProperty();
				this._showObject(this.oData.MaterialID);
				this._publishOData(this.oData);
			},

			_publishOData: function(oData){
				const bus = this.getOwnerComponent().getEventBus();
				let timer = sap.ui.getCore().byId('Worklist---object') ? 0 : 1000;
				setTimeout(() => {
					bus.publish('channelA', 'orderSelected',{
						oData
					})
				}, timer);
			},


			onNavBack : function() {
				history.go(-1);
			},


			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						aTableSearchState = [new Filter("MaterialText", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(aTableSearchState);
				}

			},

			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},

			_showObject : function (MaterialID) {
				this.getRouter().navTo("object", {
					MaterialID,
				});
			},

			
			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);