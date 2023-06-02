/*global location history */
sap.ui.define([
		"zjblessons/Worklist/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Worklist/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment",
	"sap/m/TextArea"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Fragment) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.Worklist", {

			formatter: formatter,
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");
					
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

				this._aTableSearchState = [];

				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0,
					validateError: false,
					dialogParams: {
						height: '400px',
						width: '250px',
					},
					textAreaHeight: '130px',
				});
				this.setModel(oViewModel, "worklistView");

				this.getRouter().getRoute('worklist').attachPatternMatched(this._onObjectMatched, this);

				oTable.attachEventOnce("updateFinished", function(){
					
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
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

			
			onPress : function (oEvent) {
				this._showObject(oEvent.getSource());
			},
			
			_onObjectMatched: function() {
				this.getModel().resetChanges();
			},

			_loadCreateMateriaFragment: function(oEntryContext){
				if(!this.oCreateDialog){
					this.pCreateMaterial = Fragment.load({
						name:"zjblessons.Worklist.view.fragment.CreateMaterial",
						controller: this,
						id:"fCreateDialog"
					}).then(oDialog => {
						this.oCreateDialog = oDialog;
						this.getView().addDependent(this.oCreateDialog);
						return Promise.resolve(oDialog);
					});
				}
				this.pCreateMaterial.then(oDialog => {
					oDialog.setBindingContext(oEntryContext);
					oDialog.data('errors',[])
					oDialog.open();
				});
			},
			
			onPressCreateMaterial: function() {
				const mProps = {
					Language: "RU",
					Version: "A" ,
					MaterialID:"0"
				};
				
				const oEntryContext=this.getModel().createEntry('/zjblessons_base_Materials', {
					properties: mProps,
				});
				
				this._loadCreateMateriaFragment(oEntryContext);
			},

			oClearCreateDialog: function(){
				const fieldIds = this.getView().getControlsByFieldGroupId();
				fieldIds.forEach((oItem) => {
					if(oItem.mProperties.fieldGroupIds[0]){
						oItem.setValueState('None');
						oItem.setValueStateText('');
					}
				})
			},
			
			onPressCloseCreateDialog: function(){
				this.oCreateDialog.close();
			},
			
			onPressSaveCreateMaterial: function(){
				this._validateSaveMaterial();
				if(!this.getModel("worklistView").getProperty('/validateError')){
					this.getModel().submitChanges();
					this.oCreateDialog.close()
				}
			},

			_validateSaveMaterial: function() {
				const fieldIds = this.getView().getControlsByFieldGroupId();
				fieldIds.forEach((oItem) => {
					if(oItem.mProperties.fieldGroupIds[0]){
						oItem.fireValidateFieldGroup()
					}
				})
			},
			
			onPressDeleteEntry: function(oEvent){
				this.sEntryPath = oEvent.getSource().getBindingContext().getPath();
				sap.m.MessageBox.confirm(this.getResourceBundle().getText('msgdeletionConfiramtion'),{
					actions:[
							sap.m.MessageBox.Action.OK,
							sap.m.MessageBox.Action.CANCEL
						],
					emphasizedAction: sap.m.MessageBox.Action.OK,
					initialFocus: null,
					onClose: function(sAction){
						if(sAction === 'OK'){
							this.getModel().remove(this.sEntryPath);
						}
					}.bind(this)
				});
			},

			onNavBack : function() {
				history.go(-1);
			},


			onSearchMaterialText : function (oEvent) {
				const sValue = oEvent.getParameter('query') || oEvent.getParameter('newValue');
				const aFilters = [];
				if(sValue){
					aFilters.push(
						new Filter({
							filters: [
								new Filter('MaterialText', FilterOperator.Contains, sValue),
								new Filter('MaterialDescription', FilterOperator.Contains, sValue),

								new Filter({
									filters: [
										new Filter('CreatedByFullName', FilterOperator.Contains, sValue),
										new Filter('ModifiedByFullName', FilterOperator.Contains, sValue)
									],
									and: true
								})
							],
							and: false
						})
					)
				};
				this.byId('table').getBinding('items').filter(aFilters);
			},
			
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},
			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("MaterialID")
				});
			},

			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");

				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			},
			

			validateFieldGroupMaterial: function(oEvent){
				const oSource = oEvent.getSource();
				const aErrors = this.oCreateDialog.data('errors');
				let bSuccess = true;
				let sErrorText;
				switch(oSource.getProperty('fieldGroupIds')[0]){
					case 'input':
						bSuccess = !!oSource.getValue()
						sErrorText = this.getResourceBundle().getText('ttlInputError');
						break;
					case 'select' :
						bSuccess = !!oSource.getSelectedItem()
						sErrorText = sErrorText = this.getResourceBundle().getText('ttlSelectError');
						break;
					case 'inputRating':
							const pattern = /^[0-9]\.\d{1,2}$/;
							if(oSource.getValue()){
								bSuccess = pattern.test(oSource.getValue());
								sErrorText = sErrorText = this.getResourceBundle().getText('ttlInputRatingError');
							} else {
								bSuccess = !!oSource.getValue()
								sErrorText = this.getResourceBundle().getText('ttlInputError');
							}
						break
				}
				oSource.setValueState(bSuccess ? 'None': 'Error');
				oSource.setValueStateText(sErrorText);

				if(bSuccess){
					if(aErrors.indexOf(oSource) === -1) return;
					aErrors.splice(aErrors.indexOf(oSource), 1)
				} else {
					if(aErrors.indexOf(oSource) === -1){
						aErrors.push(oSource);
					}
				}

				this.getModel("worklistView").setProperty('/validateError', !!aErrors.length)
			},

			onBeforeCloseDialog: function(oEvent){
				const oDialogSize = oEvent.getSource()._oManuallySetSize;
				if(oDialogSize){
					this.getModel('worklistView').setProperty('/dialogParams/height', oDialogSize.height + 'px');
					this.getModel('worklistView').setProperty('/dialogParams/width', oDialogSize.width + 'px');
				} else {
					oEvent.getSource().destroy();
					this.oCreateDialog = null;
				}
				sap.ui.core.ResizeHandler.deregister(oEvent.getSource());
				this.getModel().resetChanges();
				this.oClearCreateDialog();
			},
			onPressMaterialTextDropInfo: function(oEvent){
				const oSource = oEvent.getSource();

				if(!this.oMaterialPopover){
					this.oMaterialPopover = Fragment.load({
						name: 'zjblessons.Worklist.view.fragment.Popover',
						id: this.getView().getId(),
						controller: this
					}).then((oPopover) => {
						this.getView().addDependent(oPopover);
						return oPopover;
					})
				}
				this.oMaterialPopover.then((oPopover) => {
					oPopover.setBindingContext(oSource.getBindingContext());
					oPopover.openBy(oSource);
				})
			},

			onPressCloseMaterialPopover: function(oEvent) {
				oEvent.getSource().getParent().getParent().close()
			},

			onPressGoToMaterial: function(oEvent){
				this._showObject(oEvent.getSource())
			},
			onPressOpenActionSheet: function(oEvent){
				const oSource = oEvent.getSource();

				if(!this._pActionSheet){
					this._pActionSheet = Fragment.load({
						id: this.getView().getId(),
						controller: this,
						name: 'zjblessons.Worklist.view.fragment.ActionSheet',
					}).then((oAction) => {
						this.getView().addDependent(oAction);
						return oAction;
					})
				}

				this._pActionSheet.then((oAction) => {
					oAction.openBy(oSource);
				})
			},

			onAfterOpenDialog: function(oEvent){

				const oSource= oEvent.getSource();

				sap.ui.core.ResizeHandler.register(oSource, () => {
					const footerTop = oSource.getFooter().getDomRef().getBoundingClientRect().top;
					const textAreaTop = oSource.getContent()[0].mAggregations.items[9].getDomRef().getBoundingClientRect().top 
					this.getModel('worklistView').setProperty('/textAreaHeight', (footerTop - textAreaTop - 20) + 'px')
				})
			}
		});
	}
);