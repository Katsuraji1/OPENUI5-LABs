//@ui5-bundle terminologies/sample/lib/library-preload.js
/* eslint-disable */
sap.ui.predefine("terminologies/sample/lib/components/reuse1/Component", ["sap/ui/core/UIComponent"], function (e) { "use strict"; return e.extend("terminologies.sample.lib.components.reuse1.Component", { metadata: { interfaces: ["sap.ui.core.IAsyncContentCreation"], manifest: "json" }, init: function () { e.prototype.init.apply(this, arguments) } }) });
sap.ui.predefine("terminologies/sample/lib/components/reuse1/views/Default.controller", ["sap/ui/core/mvc/Controller"], function (e) { "use strict"; return e.extend("terminologies.sample.lib.components.reuse1.views.Default", { pressFromReuseComponent: function () { var e = this.getView().getModel("i18n_reuse_component").getResourceBundle(); var t = this.byId("inputReuseComponent"); t.setValue(e.getText("verticalizedStringNumberOne")) } }) });
sap.ui.predefine("terminologies/sample/lib/library", ["sap/ui/core/Core"], function (e) { "use strict"; return e.initLibrary({ name: "terminologies.sample.lib", version: "1.0.0", dependencies: ["sap.ui.core", "sap.m"], noLibraryCSS: true, controls: [] }) });
sap.ui.predefine("terminologies/sample/lib/views/Common.controller", ["sap/ui/core/mvc/Controller", "sap/ui/model/resource/ResourceModel"], function (e, o) { "use strict"; return e.extend("terminologies.sample.lib.views.Common", { onInit: function () { this._oI18nModel = new o({ bundleUrl: sap.ui.require.toUrl("terminologies/sample/lib") + "/i18n/i18n.properties" }); this.getView().setModel(this._oI18nModel, "i18n_controller_model") }, pressFromCommonView: function () { var e = this._oI18nModel.getResourceBundle(); var o = this.byId("inputCommon"); o.setValue(e.getText("verticalizedStringNumberOne")) } }) });
/* eslint-enable */
sap.ui.require.preload({
	"terminologies/sample/lib/components/reuse1/manifest.json": '{"sap.app":{"id":"terminologies.sample.lib.components.reuse1","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":["en","de"],"fallbackLocale":"en"},"title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"embeddedBy":"../../"},"sap.ui5":{"rootView":{"id":"reuseDefaultView","viewName":"terminologies.sample.lib.components.reuse1.views.Default","type":"XML","async":true},"dependencies":{"minUI5Version":"1.107.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{}}},"models":{"i18n_reuse_component":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties","settings":{"supportedLocales":["en","de"],"fallbackLocale":"en","terminologies":{"transportation":{"bundleUrl":"i18n/tv/transportation/i18n.properties","supportedLocales":["en","de"],"fallbackLocale":"en"},"retail":{"bundleName":"terminologies.sample.lib.components.reuse1.i18n.tv.retail.i18n","supportedLocales":["en","de"],"fallbackLocale":"en"}}}}}}}',
	"terminologies/sample/lib/components/reuse1/views/Default.view.xml": '<mvc:View\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:l="sap.ui.layout"\n    xmlns="sap.m"\n    controllerName="terminologies.sample.lib.components.reuse1.views.Default"><Panel headerText="Basic view content of reuse-component (\'Default.view.xml\')" width="auto" class="sapUiResponsiveMargin"><l:VerticalLayout class="sapUiContentPadding" width="100%"><Label id="reuse_label" text="{i18n_reuse_component>someText}"></Label><Button id="reuse_button" icon="{i18n_reuse_component>buttonIcon}" text="{i18n_reuse_component>buttonText}" press=".pressFromReuseComponent"></Button><Input id="inputReuseComponent" value="..."></Input></l:VerticalLayout></Panel><mvc:View id="reuseCommonView" type="XML" async="true" viewName="terminologies.sample.lib.views.Common" /></mvc:View>',
	"terminologies/sample/lib/fragments/Common.fragment.xml": '<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:l="sap.ui.layout" xmlns="sap.m"><Panel headerText="Content from reuse-fragment (\'Common.fragment.xml\'), bound to a model created by the app Component" width="auto" class="sapUiResponsiveMargin"><l:VerticalLayout class="sapUiContentPadding" width="100%"><Label id="reuse_fragment_label" text="{i18n_reuse_lib_async>someText}"></Label><Button id="reuse_fragment_button" icon="{i18n_reuse_lib_async>buttonIcon}" text="{i18n_reuse_lib_async>buttonText}" press=".pressFromExtension"></Button><Input id="inputReuse" value="..."></Input></l:VerticalLayout></Panel></core:FragmentDefinition>',
	"terminologies/sample/lib/manifest.json": '{"_version":"1.45.0","sap.app":{"id":"terminologies.sample.lib","type":"library"},"sap.ui5":{"dependencies":{"libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{}}},"library":{"i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":["en","de"],"fallbackLocale":"en","terminologies":{"transportation":{"bundleUrl":"i18n/tv/transportation/i18n.properties","supportedLocales":["en","de"],"fallbackLocale":"en"},"retail":{"bundleName":"terminologies.sample.lib.i18n.tv.retail.i18n","supportedLocales":["en","de"],"fallbackLocale":"en"}}}}}}',
	"terminologies/sample/lib/views/Common.view.xml": '<mvc:View\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:l="sap.ui.layout"\n    xmlns="sap.m"\n    controllerName="terminologies.sample.lib.views.Common"><Panel headerText="Content from reuse-view (\'Common.view.xml\')" width="auto" class="sapUiResponsiveMargin"><l:VerticalLayout class="sapUiContentPadding" width="100%"><Label id="reuse_component_common_label" text="{i18n_controller_model>someText}"></Label><Button id="reuse_component_common_button" icon="{i18n_controller_model>buttonIcon}" text="{i18n_controller_model>buttonText}" press=".pressFromCommonView"></Button><Input id="inputCommon" value="..."></Input></l:VerticalLayout></Panel></mvc:View>'
});
