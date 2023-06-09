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
            var iOriginalBusyDelay,
                oViewModel = new JSONModel({
                    busy : true,
                    delay : 0,
                });

            this.getRouter().getRoute("list").attachPatternMatched(this._onObjectMatched, this);

            iOriginalBusyDelay = this.getView().setBusyIndicatorDelay(0).getBusyIndicatorDelay();
            this.setModel(oViewModel, "listView");
            this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                    oViewModel.setProperty("/delay", iOriginalBusyDelay);
                }
            );
        },

        _onObjectMatched : function () {
            this.getModel().read('/zjblessons_base_Materials', {
                success: (oData) => {
                    this._setListData(oData);
                }
            });
        },

        _setListData: function(oData){
            
            const oList = this.getView().byId('list');
            var oModel = new sap.ui.model.json.JSONModel(oData);
            debugger;
            oModel.setData({list: oData});    	  
            oList.setModel(oModel);
            oList.bindItems(
                {
                    path: '/list',
                    template: new sap.m.StandardListItem({
                        title: "{MaterialText}",
                        description: "{MaterialDescription}"
                    })
            }
            ); 
        }
	});
});