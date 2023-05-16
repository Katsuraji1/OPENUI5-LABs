sap.ui.define([
	] , function () {
		"use strict";

		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			},
			
			formatTime: function(oEvent){
				const hours = oEvent.getHours().toString().length === 1 ? `0${oEvent.getHours()}` : oEvent.getHours();
				const minutes = oEvent.getMinutes().toString().length === 1 ? `0${oEvent.getMinutes()}` : oEvent.getMinutes();
				const day = oEvent.getDate().toString().length === 1 ? `0${oEvent.getDate()}` : oEvent.getDate();
				const month = oEvent.getMonth().toString().length === 1 ? `0${oEvent.getMonth()}` : oEvent.getMonth();
				return `${hours}:${minutes} ${day}/${month}/${oEvent.getFullYear()}`;
			}

		};

	}
);