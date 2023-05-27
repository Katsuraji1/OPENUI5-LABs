/*global location */
sap.ui.define([
		"zjblessons/MasterDetail/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/MasterDetail/model/formatter",
	"sap/m/Table"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("zjblessons.MasterDetail.controller.Detail", {

			formatter: formatter,

			_oViewModel: new JSONModel({
				masterItem: ""
			}),

			onInit : function () {

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(this._oViewModel, "detailView")
			},


			_onObjectMatched : function (oEvent) {
				const sEntity = oEvent.getParameter('arguments').entity;

				this.getModel('detailView').setProperty('/masterItem', sEntity);

				switch(sEntity){
					case "All":
						break
					default:
						if(this.byId(sEntity).getBinding('rows')){
							this.byId(sEntity).getBinding('rows').refresh();
						} else {
							this.byId(sEntity).bindRows({
								path: "/zjblessons_base_"+sEntity,
								template: new sap.ui.table.Row({})
							})
						}

				}
			},


			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("detailView");

				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.HeaderID,
					sObjectName = oObject.CreatedByFullName,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/busy", true);
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);