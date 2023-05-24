/*global location*/
sap.ui.define([
		"zjblessons/Worklist/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zjblessons/Worklist/model/formatter",
	"sap/ui/core/Fragment"
	], function (
		BaseController,
	JSONModel,
	History,
	formatter,
	Fragment
	) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.Object", {

			formatter: formatter,
			onInit : function () {
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0,
						editMode: false,
						selectedKeyITB: 'list'
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				iOriginalBusyDelay = this.getView().setBusyIndicatorDelay(0).getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
			},

			onNavBack : function() {
				const sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
				this.onPressCancelEditMaterial();
			},

			onChange: function(oEvent){
				const bState = oEvent.getParameter('state');
				if(!bState && this.getModel().hasPendingChanges()){
					sap.m.MessageBox.confirm(this.getResourceBundle().getText('ttlSaveChanges'),{
						title: this.getResourceBundle().getText('ttlChooseAction'),
						actions:[
							sap.m.MessageBox.Action.OK,
							sap.m.MessageBox.Action.CANCEL,
							sap.m.MessageBox.Action.CLOSE,
						],
						emphasizedAction: sap.m.MessageBox.Action.OK,
						textDirection: sap.ui.core.TextDirection.Inherit,  
						initialFocus: null,
						onClose:(sAction) => {
							if(sAction === 'OK'){
								this.onPressSaveEditMaterial()
							} else if (sAction==='CANCEL'){
								this.onPressCancelEditMaterial()
							}
						}
					});
					this._setEditMode(true);
				} else{
					this._setEditMode(bState);
				}
			},

			onPressEditMaterial: function(){
				this._setEditMode(true);
			},
			
			onPressCancelEditMaterial: function(){
				this.getModel().resetChanges();
				this._setEditMode(false);
			},

			onPressSaveEditMaterial: function(){
				this.getModel().submitChanges();
				this._setEditMode(false);
			},

			_onObjectMatched : function (oEvent) {
				this._setEditMode(false)
				const sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					const sObjectPath = this.getModel().createKey("zjblessons_base_Materials", {
						MaterialID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
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
					sObjectName = oObject.CreatedBy;

				oViewModel.setProperty("/busy", false);
			},

			_setEditMode: function(bMode){
				this.getModel("objectView").setProperty("/editMode", bMode);
				const sSelectedKey = this.getModel('objectView').getProperty("/selectedKeyITB");

				if(bMode && sSelectedKey === 'list'){

				} else if(sSelectedKey==='form'){
					this._addFormContent(bMode ? "Edit" : "View")
				}
			},

			onSelectIconTabBar: function(oEvent){
				const sSelectedKey = oEvent.getSource().getSelectedKey();
				this.getModel("objectView").setProperty("/selectedKeyITB", sSelectedKey);

				if(sSelectedKey !== 'form') return;

				this._addFormContent('View');
			},

			_addFormContent(sMode){
				if(!this[`pForm${sMode}`]){
					this[`pForm${sMode}`]=Fragment.load({
						name:"zjblessons.Worklist.view.Fragment.Form"+sMode,
						controller: this,
						id: this.getView().getId(),
					}).then((oContent) => {
						this.getView().addDependent(oContent);
						return oContent;
					})
				}

				this[`pForm${sMode}`].then((oContent) => {
					const IconTabFilter = this.byId('FormIconTabFilter');
					IconTabFilter.removeAllContent();
					IconTabFilter.insertContent(oContent, 0);
				})
			}

		});

	}
);