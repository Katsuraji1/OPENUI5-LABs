sap.ui.define([
    "zjblessons/Worklist/controller/BaseController",
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "zjblessons/Worklist/model/formatter",
], function(
    BaseController,
    History,
    JSONModel,
    formatter
) {
	"use strict";

	return BaseController.extend("zjblessons.Worklist.controller.List", {
        formatter: formatter,
        onInit : function () {
            var oList = this.byId("list"),
            iOriginalBusyDelay = oList.getBusyIndicatorDelay(),
            oViewModel = new JSONModel({
                    delay : 0,
                    busy: true,
                });

            this.getRouter().getRoute("list").attachPatternMatched(this._onObjectMatched, this);

            iOriginalBusyDelay = this.getView().setBusyIndicatorDelay(0);
            this.setModel(oViewModel, "listView");
            this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                    oViewModel.setProperty("/delay", iOriginalBusyDelay);
                }
            );
            oList.attachEventOnce("updateFinished", function(){
                this.getModel('listView').setProperty('/busy', false) 
            });
        },

        _onObjectMatched : function () {
            try {
                this.getModel().read('/zjblessons_base_Materials', {
                    success: (oData) => {
                        this._setListData(oData);
                    },
                    error: (oError) => {
                        new sap.m.MessageToast.show(oError.message)
                    }
                });
            } catch(oError){
                debugger;
                new sap.m.MessageToast.show(oError.toString())
            } finally{
                //отклбчение busy индикатора в "updateFinished", тк finally отрабатывает до биндинга таблицы
            }
        },

        _setListData: function(oData){
            
            const oList = this.getView().byId('list');
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oData);    	  
            oList.setModel(oModel);
            oList.bindItems(
                {
                    path: '/results',
                    template: new sap.m.StandardListItem({
                        title: "{MaterialText}",
                        description: "{MaterialDescription}"
                    })
            }
            );
        }
	});
});