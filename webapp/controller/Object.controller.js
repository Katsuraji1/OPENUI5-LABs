/*global location*/
sap.ui.define([
		"zjblessons/Worklist/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zjblessons/Worklist/model/formatter"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter
	) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.Object", {

			formatter: formatter,

			onInit : function () {
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0
					});

				iOriginalBusyDelay = this.getView().setBusyIndicatorDelay(0);
				this.setModel(oViewModel, "objectView");
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
				const bus = this.getOwnerComponent().getEventBus()
				bus.subscribe('channelA', 'orderSelected', this.bindData, this);
				
			},

			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onObjectMatched: function(){
				this.getModel().setDeferredGroups(['material', 'description'])
			},


			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.MaterialID,
					sObjectName = oObject.MaterialText;

				oViewModel.setProperty("/busy", false);
			},

			bindData: function(channelID, eventID, parametersMap){
				const oData =  parametersMap.oData;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("zjblessons_base_Materials", {
						groupId: ['material', 'description'],
						MaterialID: oData.MaterialID
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			onPressSubmitMaterialText: function(oEvent){
				const sPath = oEvent.getSource().getBindingContext().sPath;
				this.getModel().update(sPath, {			
						MaterialText: this.getView().byId('inputText').getValue(),
				}, {
					groupId: 'material'
				})
				this.getModel().submitChanges({
					groupId: 'material',
					success: () => {
						new sap.m.MessageToast.show(this.getResourceBundle().getText('msgSuccessfullyChanged'))
					},
					error: (oError) => {
						new sap.m.MessageBox.error(oError.toString())
					}
				});
			},

			onPressSubmitMateriaDescription: function(oEvent){
				const sPath = oEvent.getSource().getBindingContext().sPath
				this.getModel().update(sPath, {
						MaterialDescription: this.getView().byId('inputDescription').getValue(),
				}, {
					groupId: 'description'
				})
				this.getModel().submitChanges({
					groupId: 'description',
					success: () => {
						new sap.m.MessageToast.show(this.getResourceBundle().getText('msgSuccessfullyChanged'))
					},
					error: (oError) => {
						new sap.m.MessageBox.error(oError.toString())
					}
				});
			},

		});

	}
);