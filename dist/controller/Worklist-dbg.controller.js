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
					Messages: [],
				});
				this.setModel(oViewModel, "worklistView");

				this.getRouter().getRoute('worklist').attachPatternMatched(this._onObjectMatched, this);

				oTable.attachEventOnce("updateFinished", function(){
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});

				this.oLink = new sap.m.Link({
					text: this.getResourceBundle().getText('ttlShowMoreInfo'),
					href: "http://sap.com",
					target: "_blank"
				});
	
				this.oMessageTemplate = new sap.m.MessageItem({
					type: '{worklistView>type}',
					title: '{worklistView>title}',
					activeTitle: "{worklistView>active}",
					description: '{worklistView>description}',
					subtitle: '{worklistView>subtitle}',
					counter: '{worklistView>counter}',
					link: this.oLink
				});
	
				this.oMessagePopover = new sap.m.MessagePopover({
					items: {
						model: 'worklistView',
						path: 'worklistView>/Messages',
						template: this.oMessageTemplate
					}
				});
				
				this.byId('messagePopoverBtn').addDependent(this.oMessagePopover)

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
				this._showObject(oEvent);
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

			oClearDialog: function(oEvent){
				const fieldIds = oEvent.getSource().getControlsByFieldGroupId();
				fieldIds.forEach((oItem) => {
					if(oItem.mProperties.fieldGroupIds[0]){
						oItem.setValue('');
						oItem.setValueState('None');
						oItem.setValueStateText('');
					}
				})
			},
			
			onPressCloseCreateDialog: function(oEvent){
				oEvent.getSource().getParent().getParent().close();
			},
			
			onPressSaveCreateMaterial: function(){
				this._validateSaveMaterial(this.oCreateDialog);
				if(!this.getModel("worklistView").getProperty('/validateError')){
					this.getModel().submitChanges({
						success: (oData) => {
							this.addMessageCreated(oData);
						},
						error: (oError) => {
							this.addMessageErrorCreated(oError);
						}
					});
					this.oCreateDialog.close()
				}
			},

			addInfoMessage: function(oEvent){
				const materialText = oEvent.getSource().mAggregations.cells ? oEvent.getSource().mAggregations.cells[0].mProperties.text : oEvent.getSource().getParent().getParent().getTitle();
				const aMessages = this.getModel('worklistView').getProperty('/Messages').slice();

				aMessages.push({
					type: sap.ui.core.MessageType.Information,
					title: this.getResourceBundle().getText('ttlViewed'),
					description: `${this.getResourceBundle().getText('descMaterialTextMessPopover')} ${materialText}`,
					subtitle: `${materialText} ${this.getResourceBundle().getText('msgViewed')}`,
					counter: 1,
					link: this.oLink
				})

				this.getModel('worklistView').setProperty('/Messages', aMessages);
			},

			addMessageCreated: function(oData){
				const aResponse = oData.__batchResponses[0].__changeResponses[0].data;
				const aMessages = this.getModel('worklistView').getProperty('/Messages').slice();
				

				aMessages.push({
					type: sap.ui.core.MessageType.Success,
					title: this.getResourceBundle().getText('ttlCreated'),
					description: `${this.getResourceBundle().getText('descMaterialTextMessPopover')} ${aResponse.MaterialText}`,
					subtitle: `${aResponse.MaterialText} ${this.getResourceBundle().getText('msgCreated')}`,
					counter: 1,
					link: this.oLink
				})

				this.getModel('worklistView').setProperty('/Messages', aMessages);
			},

			addMessageErrorCreated: function(oError){
				const aMessages = this.getModel('worklistView').getProperty('/Messages').slice();

				aMessages.push({
					type: sap.ui.core.MessageType.Error,
					title: this.getResourceBundle().getText('ttlNotCreated'),
					description: `${this.getResourceBundle().getText('ttlError')} ${oError.message}`,
					subtitle: `${this.oDeletedMaterial.MaterialText} ${this.getResourceBundle().getText('msgNotCreated')}`,
					counter: 1,
					link: this.oLink
				})

				this.getModel('worklistView').setProperty('/Messages', aMessages);
			},

			_validateSaveMaterial: function(oDialog) {
				const fieldIds = oDialog.getContent()[0].getControlsByFieldGroupId();
				fieldIds.forEach((oItem) => {
					if(oItem.mProperties.fieldGroupIds[0]){
						oItem.fireValidateFieldGroup()
					}
				})
			},
			
			onPressDeleteEntry: function(oEvent){
				this.sEntryPath = oEvent.getSource().getBindingContext().getPath();
				this.oDeletedMaterial = oEvent.getSource().getBindingContext().getObject()
				sap.m.MessageBox.confirm(this.getResourceBundle().getText('msgdeletionConfiramtion'),{
					actions:[
							sap.m.MessageBox.Action.OK,
							sap.m.MessageBox.Action.CANCEL
						],
					emphasizedAction: sap.m.MessageBox.Action.OK,
					initialFocus: null,
					onClose: function(sAction){
						if(sAction === 'OK'){
							this.getModel().remove(this.sEntryPath, {
								success: () => {
									this.addMessageDeleted();
								},
								error: (oError) => {
									this.addMessageErrorDeleted(oError);
								}
							});
						}
					}.bind(this)
				});
			},

			addMessageDeleted: function(){
				const aMessages = this.getModel('worklistView').getProperty('/Messages').slice();
				
				aMessages.push({
					type: sap.ui.core.MessageType.Warning,
					title: this.getResourceBundle().getText('ttlDeleted'),
					description: `${this.getResourceBundle().getText('descMaterialTextMessPopover')} ${this.oDeletedMaterial.MaterialText}`,
					subtitle: `${this.oDeletedMaterial.MaterialText} ${this.getResourceBundle().getText('msgDeleted')}`,
					counter: 1,
					link: this.oLink
				});

				this.getModel('worklistView').setProperty('/Messages', aMessages);
			},

			addMessageErrorDeleted: function(oError){
				const aMessages = this.getModel('worklistView').getProperty('/Messages').slice();

				aMessages.push({
					type: sap.ui.core.MessageType.Error,
					title: this.getResourceBundle().getText('ttlNotDeleted'),
					description: `${this.getResourceBundle().getText('ttlError')} ${oError.message}`,
					subtitle: `${this.oDeletedMaterial.MaterialText} ${this.getResourceBundle().getText('msgNotDeleted')}`,
					counter: 1,
					link: this.oLink
				});

				this.getModel('worklistView').setProperty('/Messages', aMessages);
			},

			onNavBack : function() {
				history.go(-1);
			},


			onSearchMaterialText : function (oEvent) {
				const sValue = oEvent.getParameter('query') || oEvent.getParameter('newValue');
				this.byId('table').getBinding('items').filter(this.getFilters(sValue));
			},

			getFilters: function(sValue){
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

				return aFilters;
			},
			
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},
			_showObject : function (oItem) {
				this.addInfoMessage(oItem);
				this.getRouter().navTo("object", {
					objectId: oItem.getSource().getBindingContext().getProperty("MaterialID")
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
				this.oClearDialog(oEvent);
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
						return Promise.resolve(oPopover);
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
				this._showObject(oEvent)
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
						return Promise.resolve(oAction);
					})
				}

				this._pActionSheet.then((oAction) => {
					oAction.openBy(oSource);
				})
			},

			onAfterOpenDialog: function(oEvent){

				const oSource= oEvent.getSource();

				sap.ui.core.ResizeHandler.register(oSource, () => {
					const footerTop = oSource.getFooter().getDomRef().getBoundingClientRect().top,
						aDialogAggregations =  oSource.getContent()[0].mAggregations.items,
						textAreaTop = aDialogAggregations[aDialogAggregations.length - 1].getDomRef().getBoundingClientRect().top 
					this.getModel('worklistView').setProperty('/textAreaHeight', (footerTop - textAreaTop - 20) + 'px')
				})
			},

			onPressMessagePopover: function(oEvent){
				this.oMessagePopover.toggle(oEvent.getSource());
			},

			//Select Diloag

			onPressOpenSelectDialog: function() {
					if(!this._pSelectDialog) {
						this._pSelectDialog = Fragment.load({
							controller: this,
							id: this.getView().getId(),
							name: 'zjblessons.Worklist.view.fragment.SelectDialog'
						}).then((oSelectDialog) => {
							this.getView().addDependent(oSelectDialog);
							return Promise.resolve(oSelectDialog);
						})
					}

					this._pSelectDialog.then((oSelectDialog) => {
						oSelectDialog.getBinding('items').filter([]);
						oSelectDialog.open();
					})
			},

			onSearchSelectDialog: function(oEvent){
				const sValue = oEvent.getParameter('value');
				oEvent.getParameter('itemsBinding').filter(this.getFilters(sValue));
			},


			//homework 12

			onPressRegistration: function(){
				return new Promise((resolve, reject) => {
					if(!this._pRegistrationFragment){
						this._pRegistrationFragment = Fragment.load({
							name: 'zjblessons.Worklist.view.fragment.Registration',
							controller: this,
							id: this.getView().getId()
						}).then((oDialog) => {
							this.getView().addDependent(oDialog)
							return oDialog;
						})
					}

					this._pRegistrationFragment.then((oDialog) => {
						oDialog.data('errors',[])
						resolve(oDialog.open())
					}).catch((oError) => {
						sap.m.MessageBox.error(oError.toString());
						reject()
					})
				})
			},

			validateFieldGroupRegistration: function(oEvent){
				const oSource = oEvent.getSource();
				const oDialog = oSource.getParent().getParent()
				this.aErrors =	oDialog.data('errors') || [];
				let bSuccess = true;
				switch(oSource.getProperty('fieldGroupIds')[0]){
					case 'input':
						bSuccess = !!oSource.getValue()
						break;
					case 'timePicker':
						bSuccess = !!oSource.getValue() && oSource._isValidValue()
						break;
					case 'datePicker':
						bSuccess = !!oSource.getValue() && oSource.isValidValue()
						break;
					case 'inputEmail':
						try{
							bSuccess = this.validateEmail(oSource.getValue());;
						} catch(oError){
							bSuccess=false
							this.craeteMessageErrorStrip(oSource, oError);
						} finally {
							//отключение кнопки "Save" сделано ниже для всех ошибок валидации
							break;
						}
				}
				

				try{
					if(bSuccess){
						if(this.aErrors.indexOf(oSource) === -1) return;
						this.aErrors.splice(this.aErrors.indexOf(oSource), 1)
					} else {
						if(this.aErrors.indexOf(oSource) === -1){
							this.aErrors.push(oSource);
						}
					}
					oSource.setValueState(bSuccess ? 'None': 'Error');
				} catch(oError) {
					switch(oDialog.getId().replace('Worklist---worklist--', '')){
						case 'registrationDialog':
							this.craeteMessageErrorStrip(oSource, oError);
							break;
						case 'dateTimeDialog':
							sap.m.MessageToast.show(oError.toString())
							break;
						default:
							sap.m.MessageToast.show(oError.toString())
							break;
					}
				} finally {
					this.saveBtnSearch(oSource);
				}
			},

			saveBtnSearch: function(oSource){
				if(!!oSource.mAggregations.footer){
					oSource.getFooter().mAggregations.content[2].setEnabled(!this.aErrors.length);
				} else {
					this.saveBtnSearch(oSource.getParent())
				}
			},

			craeteMessageErrorStrip: function(oSource, oError){
				if(!this.oMsgStrip) this.oMsgStrip = new sap.m.MessageStrip({
					text: `${oError}`,
					showCloseButton: true,
					showIcon: false,
					type: sap.ui.core.MessageType.Error,
					close: () => {
						this.oMsgStrip = null
					}
				});
				oSource.getParent().getParent().addContent(this.oMsgStrip);
			},

			onpRressRegistrationSave: function(oEvent){
				this._validateRegistration(oEvent.getSource().getParent().getParent());
			},

			_validateRegistration: function(oDialog) {
				const fieldIds = oDialog.getContent()[0].getControlsByFieldGroupId();
				fieldIds.forEach((oItem) => {
					if(oItem.mProperties.fieldGroupIds[0]){
						oItem.fireValidateFieldGroup()
					}
				})
			},

			beforeCloseHandler: function(oEvent){
				if(this.oMsgStrip) {
					this.oMsgStrip.close()
					this.oMsgStrip = null;
				};
				this.getModel().resetChanges();
				oEvent.getSource().getFooter().mAggregations.content[2].setEnabled(true);
				this.oClearDialog(oEvent);
			},

//TIME AND DATE

			onPressTimeDate: function(){
				return new Promise((resolve, reject) => {
					if(!this._pDateTimeFragment){
						this._pDateTimeFragment = Fragment.load({
							name: 'zjblessons.Worklist.view.fragment.DateTime',
							controller: this,
							id: this.getView().getId()
						}).then((oDialog) => {
							this.getView().addDependent(oDialog)
							return oDialog;
						})
					}

					this._pDateTimeFragment.then((oDialog) => {
						oDialog.data('errors',[])
						resolve(oDialog.open());
					}).catch((oError) => {
						sap.m.MessageBox.error(oError.toString());
						reject();
					})
				})
			},
//LOGIN

			onPressLogin: function(){
				return new Promise((resolve, reject) => {
					if(!this._pLoginFragment){
						this._pLoginFragment = Fragment.load({
							name: 'zjblessons.Worklist.view.fragment.Login',
							controller: this,
							id: this.getView().getId()
						}).then((oDialog) => {
							this.getView().addDependent(oDialog)
							return oDialog;
						})
					}

					this._pLoginFragment.then((oDialog) => {
						oDialog.data('errors',[])
						resolve(oDialog.open());
					}).catch((oError) => {
						sap.m.MessageBox.error(oError.toString());
						reject();
					})
				})
			},

			validateEmail: function(sValue){
				const mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
				if(!mailregex.test(sValue)){
					throw new Error(this.getResourceBundle().getText('msgValidateMailError'));
				}
				return mailregex.test(sValue);
			},

			//

			onPressList: function(){
				this._showList()
			},

			_showList : function () {
				this.getRouter().navTo("list");
			},
		});
	}
);