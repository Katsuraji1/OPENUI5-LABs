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

				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
				const bus = this.getOwnerComponent().getEventBus()
				bus.subscribe('channelA', 'orderSelected', this.bindData, this)
				/* this.oModel = new sap.ui.model.odata.v2.ODataModel('/Material')
				this.oModel.setDeferredGroups(['material', 'description']) */
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
				this.getModel().setDeferredGroups(['material', 'description'])
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
				const sPath = oEvent.getSource().getBindingContext().sPath
				this.getModel().update(sPath, {			
						MaterialText: this.getView().byId('inputText').getValue(),
				}, {
					groupId: 'material'
				})
				this.getModel().submitChanges({
					groupId: 'material',
					success: () => {
						new sap.m.MessageToast.show(this.getResourceBundle().text(''))
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
				});
			},

		});

	}
);