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
			
			/* formatTime: function(oEvent){
				const dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: 'HH:mm dd/MM/yyyy'});
				return dateFormat.format(oEvent);
			}, */

			modifiedFormatter: function(ModifiedByFullName, Modified){
				if(ModifiedByFullName && Modified){
					const sSurname = ModifiedByFullName.split(' ')[1];
					const dCurrentDate = new Date();
					const formatedDate = sap.ui.core.format.DateFormat.getDateInstance({pattern: 'EEE, MMM dd, YYYY,'}).format(Modified);

					const oneMin = 1000 * 60,
						oneHour = oneMin * 60,
						oneDay = oneHour * 24
					const diffInTime = dCurrentDate - Modified;
					const diffInDays = Math.floor(diffInTime / oneDay),
						diffInHours = Math.floor(diffInTime / oneHour) - diffInDays * 24,
						diffInMinutes = Math.floor(diffInTime / oneMin) - diffInDays * 24 * 60 - diffInHours * 60
					const diffBTDays = diffInDays > 0 ? `${diffInDays}${this.getResourceBundle().getText('sDays')}` : "",
						diffBTHours = diffInHours > 0 ? `${diffInHours}${this.getResourceBundle().getText('sHours')}` : "",
						diffBTMinutes = diffInMinutes > 0 ? `${diffInMinutes}${this.getResourceBundle().getText('sMinutes')}` : ""

						let sEnding = this.getResourceBundle().getText('sAgo')

						if(!diffBTDays && !diffBTHours && !diffBTMinutes){
							sEnding = this.getResourceBundle().getText('sNow')
						}

					return `${sSurname} ${this.getResourceBundle().getText('sOn')} ${formatedDate} ${this.getResourceBundle().getText('sModified')} ${diffBTDays} ${diffBTHours} ${diffBTMinutes} ${sEnding}`;
				}
			},

			nameFormatter: function(createdByFullName){
				if(createdByFullName) {
					return createdByFullName.split(' ').map((value, index) => index === 0 ? `${value[0]}.` : value).join(" ");
			}
			},

			buttonIconFormatter: function(aMessages = []){
				let sIcon;

				aMessages.forEach((oMessage) => {
					switch(oMessage.type){
						case "Error": 
							sIcon = this.getResourceBundle().getText('iError');
							break;
						case 'Warning': 
							sIcon = sIcon !== this.getResourceBundle().getText('iError') ? this.getResourceBundle().getText('iWarning') : sIcon;
							break;
						case 'Success': 
							sIcon = sIcon = this.getResourceBundle().getText('iError') && sIcon !== this.getResourceBundle().getText('iWarning') ? this.getResourceBundle().getText('iSuccess') : sIcon;
							break;
						default:
							sIcon = !sIcon ? this.getResourceBundle().getText('iInfo') : sIcon;
					}
				});

				return sIcon || this.getResourceBundle().getText('iInfo')
			},

			buttonTypeFormatter: function (aMessages = []) {
				let sHighestSeverityIcon;
				aMessages.forEach(function (sMessage) {
					switch (sMessage.type) {
						case "Error":
							sHighestSeverityIcon = sap.m.ButtonType.Negative;
							break;
						case "Warning":
							sHighestSeverityIcon = sHighestSeverityIcon !== sap.m.ButtonType.Negative ? sap.m.ButtonType.Critical : sHighestSeverityIcon;
							break;
						case "Success":
							sHighestSeverityIcon = sHighestSeverityIcon !== sap.m.ButtonType.Negative && sHighestSeverityIcon !== sap.m.ButtonType.Critical ?  sap.m.ButtonType.Success : sHighestSeverityIcon;
							break;
						default:
							sHighestSeverityIcon = !sHighestSeverityIcon ? sap.m.ButtonType.Neutral : sHighestSeverityIcon;
							break;
					}
				});
	
				return sHighestSeverityIcon;
			},

			buttonTextFormatter: function (aMessages = []) {
				let sHighestSeverityIconType = this.formatter.buttonTypeFormatter(aMessages);
				let sHighestSeverityMessageType;
	
				switch (sHighestSeverityIconType) {
					case sap.m.ButtonType.Negative:
						sHighestSeverityMessageType = sap.ui.core.MessageType.Error;
						break;
					case sap.m.ButtonType.Critical:
						sHighestSeverityMessageType = sap.ui.core.MessageType.Warning;
						break;
					case sap.m.ButtonType.Success:
						sHighestSeverityMessageType = sap.ui.core.MessageType.Success;
						break;
					default:
						sHighestSeverityMessageType = !sHighestSeverityMessageType ? sap.ui.core.MessageType.Information : sHighestSeverityMessageType;
						break;
				}
	
				return aMessages.reduce(function(iNumberOfMessages, oMessageItem) {
					return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
				}, 0);
			},
	
	

		};

	}
);