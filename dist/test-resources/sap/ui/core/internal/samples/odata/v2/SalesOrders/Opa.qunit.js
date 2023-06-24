/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";
	var sTestPrefix = "sap/ui/core/internal/samples/odata/v2/SalesOrders/tests/";

	sap.ui.require([
		"sap/ui/core/sample/common/pages/Any",
		sTestPrefix + "pages/Main",
		sTestPrefix + "MessagesForNoteFields",
		sTestPrefix + "MessageStripAndAggregatedTableRowHighlighting",
		sTestPrefix + "MessageLifecycleSideEffects",
		sTestPrefix + "TransitionMessagesOnly",
		sTestPrefix + "FilterSalesOrderItemsByItemsWithMessages",
		sTestPrefix + "CreateAndDeleteSalesOrderItems",
		sTestPrefix + "UnboundMessages",
		sTestPrefix + "MessagesWithMultipleTargets",
		sTestPrefix + "MessagesReturnedFromAFunctionImport",
		sTestPrefix + "IgnoredMessages",
		sTestPrefix + "CloneSalesOrderItem",
		sTestPrefix + "ODataListBinding.create/TC1_SalesOrders",
		sTestPrefix + "ODataListBinding.create/TC2_CreateItems",
		sTestPrefix + "ODataListBinding.create/TC3_SalesOrders_InlineCreationRow",
		sTestPrefix + "ODataListBinding.create/TC4_SalesOrderItems_InlineCreationRow"
	], function () {
		QUnit.start();
	});
});