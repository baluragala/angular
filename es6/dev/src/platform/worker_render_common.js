import { IS_DART } from 'angular2/src/facade/lang';
import { MessageBus } from 'angular2/src/web_workers/shared/message_bus';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
import { ExceptionHandler, APPLICATION_COMMON_PROVIDERS, PLATFORM_COMMON_PROVIDERS, RootRenderer, PLATFORM_INITIALIZER } from 'angular2/core';
import { EVENT_MANAGER_PLUGINS, EventManager } from 'angular2/platform/common_dom';
import { OpaqueToken } from 'angular2/src/core/di';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { DomEventsPlugin } from 'angular2/src/platform/dom/events/dom_events';
import { KeyEventsPlugin } from 'angular2/src/platform/dom/events/key_events';
import { DOCUMENT } from 'angular2/src/platform/dom/dom_tokens';
import { DomRootRenderer, DomRootRenderer_ } from 'angular2/src/platform/dom/dom_renderer';
import { DomSharedStylesHost, SharedStylesHost } from 'angular2/src/platform/dom/shared_styles_host';
import { BrowserDetails } from 'angular2/src/animate/browser_details';
import { AnimationBuilder } from 'angular2/src/animate/animation_builder';
import { XHR } from 'angular2/compiler';
import { XHRImpl } from 'angular2/src/platform/browser/xhr_impl';
import { Testability } from 'angular2/src/core/testability/testability';
import { BrowserGetTestability } from 'angular2/src/platform/browser/testability';
import { BrowserDomAdapter } from './browser/browser_adapter';
import { wtfInit } from 'angular2/src/core/profile/wtf_init';
import { MessageBasedRenderer } from 'angular2/src/web_workers/ui/renderer';
import { MessageBasedXHRImpl } from 'angular2/src/web_workers/ui/xhr_impl';
import { ServiceMessageBrokerFactory, ServiceMessageBrokerFactory_ } from 'angular2/src/web_workers/shared/service_message_broker';
import { ClientMessageBrokerFactory, ClientMessageBrokerFactory_ } from 'angular2/src/web_workers/shared/client_message_broker';
import { BrowserPlatformLocation } from 'angular2/src/platform/browser/location/browser_platform_location';
import { Serializer } from 'angular2/src/web_workers/shared/serializer';
import { ON_WEB_WORKER } from 'angular2/src/web_workers/shared/api';
import { RenderStore } from 'angular2/src/web_workers/shared/render_store';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerGesturesPlugin } from 'angular2/src/platform/dom/events/hammer_gestures';
export const WORKER_SCRIPT = new OpaqueToken("WebWorkerScript");
// Message based Worker classes that listen on the MessageBus
export const WORKER_RENDER_MESSAGING_PROVIDERS = 
/*@ts2dart_const*/ [MessageBasedRenderer, MessageBasedXHRImpl];
export const WORKER_RENDER_PLATFORM_MARKER = 
/*@ts2dart_const*/ new OpaqueToken('WorkerRenderPlatformMarker');
export const WORKER_RENDER_PLATFORM = [
    PLATFORM_COMMON_PROVIDERS,
    /*@ts2dart_const*/ ({ provide: WORKER_RENDER_PLATFORM_MARKER, useValue: true }),
    /* @ts2dart_Provider */ { provide: PLATFORM_INITIALIZER, useValue: initWebWorkerRenderPlatform, multi: true }
];
/**
 * A list of {@link Provider}s. To use the router in a Worker enabled application you must
 * include these providers when setting up the render thread.
 */
export const WORKER_RENDER_ROUTER = 
/*@ts2dart_const*/ [BrowserPlatformLocation];
export const WORKER_RENDER_APPLICATION_COMMON = 
/*@ts2dart_const*/ [
    APPLICATION_COMMON_PROVIDERS,
    WORKER_RENDER_MESSAGING_PROVIDERS,
    /* @ts2dart_Provider */ { provide: ExceptionHandler, useFactory: _exceptionHandler, deps: [] },
    /* @ts2dart_Provider */ { provide: DOCUMENT, useFactory: _document, deps: [] },
    // TODO(jteplitz602): Investigate if we definitely need EVENT_MANAGER on the render thread
    // #5298
    /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: DomEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: HammerGesturesPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig },
    /* @ts2dart_Provider */ { provide: DomRootRenderer, useClass: DomRootRenderer_ },
    /* @ts2dart_Provider */ { provide: RootRenderer, useExisting: DomRootRenderer },
    /* @ts2dart_Provider */ { provide: SharedStylesHost, useExisting: DomSharedStylesHost },
    /* @ts2dart_Provider */ { provide: XHR, useClass: XHRImpl },
    MessageBasedXHRImpl,
    /* @ts2dart_Provider */ { provide: ServiceMessageBrokerFactory, useClass: ServiceMessageBrokerFactory_ },
    /* @ts2dart_Provider */ { provide: ClientMessageBrokerFactory, useClass: ClientMessageBrokerFactory_ },
    Serializer,
    /* @ts2dart_Provider */ { provide: ON_WEB_WORKER, useValue: false },
    RenderStore,
    DomSharedStylesHost,
    Testability,
    BrowserDetails,
    AnimationBuilder,
    EventManager
];
export function initializeGenericWorkerRenderer(injector) {
    var bus = injector.get(MessageBus);
    let zone = injector.get(NgZone);
    bus.attachToZone(zone);
    zone.runGuarded(() => {
        WORKER_RENDER_MESSAGING_PROVIDERS.forEach((token) => { injector.get(token).start(); });
    });
}
export function initWebWorkerRenderPlatform() {
    BrowserDomAdapter.makeCurrent();
    wtfInit();
    BrowserGetTestability.init();
}
function _exceptionHandler() {
    return new ExceptionHandler(DOM, !IS_DART);
}
function _document() {
    return DOM.defaultDoc();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlcl9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVB4eWE5MGdhLnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcl9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FDekMsRUFBQyxVQUFVLEVBQUMsTUFBTSw2Q0FBNkM7T0FDL0QsRUFBQyxNQUFNLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDOUMsRUFJTCxnQkFBZ0IsRUFHaEIsNEJBQTRCLEVBQzVCLHlCQUF5QixFQUN6QixZQUFZLEVBQ1osb0JBQW9CLEVBRXJCLE1BQU0sZUFBZTtPQUNmLEVBQUMscUJBQXFCLEVBQUUsWUFBWSxFQUFDLE1BQU0sOEJBQThCO09BQ3pFLEVBQThCLFdBQVcsRUFBQyxNQUFNLHNCQUFzQjtPQUV0RSxFQUFDLEdBQUcsRUFBQyxNQUFNLHVDQUF1QztPQUNsRCxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QztPQUNwRSxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QztPQUNwRSxFQUFDLFFBQVEsRUFBQyxNQUFNLHNDQUFzQztPQUN0RCxFQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHdDQUF3QztPQUNqRixFQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sOENBQThDO09BQzNGLEVBQUMsY0FBYyxFQUFDLE1BQU0sc0NBQXNDO09BQzVELEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3Q0FBd0M7T0FDaEUsRUFBQyxHQUFHLEVBQUMsTUFBTSxtQkFBbUI7T0FDOUIsRUFBQyxPQUFPLEVBQUMsTUFBTSx3Q0FBd0M7T0FDdkQsRUFBQyxXQUFXLEVBQUMsTUFBTSwyQ0FBMkM7T0FDOUQsRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJDQUEyQztPQUN4RSxFQUFDLGlCQUFpQixFQUFD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bmcnO1xuaW1wb3J0IHtNZXNzYWdlQnVzfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2VfYnVzJztcbmltcG9ydCB7Tmdab25lfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS96b25lL25nX3pvbmUnO1xuaW1wb3J0IHtcbiAgUExBVEZPUk1fRElSRUNUSVZFUyxcbiAgUExBVEZPUk1fUElQRVMsXG4gIENvbXBvbmVudFJlZixcbiAgRXhjZXB0aW9uSGFuZGxlcixcbiAgUmVmbGVjdG9yLFxuICByZWZsZWN0b3IsXG4gIEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlMsXG4gIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gIFJvb3RSZW5kZXJlcixcbiAgUExBVEZPUk1fSU5JVElBTElaRVIsXG4gIEFQUF9JTklUSUFMSVpFUlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7RVZFTlRfTUFOQUdFUl9QTFVHSU5TLCBFdmVudE1hbmFnZXJ9IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbl9kb20nO1xuaW1wb3J0IHtwcm92aWRlLCBQcm92aWRlciwgSW5qZWN0b3IsIE9wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG4vLyBUT0RPIGNoYW5nZSB0aGVzZSBpbXBvcnRzIG9uY2UgZG9tX2FkYXB0ZXIgaXMgbW92ZWQgb3V0IG9mIGNvcmVcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7RG9tRXZlbnRzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9kb21fZXZlbnRzJztcbmltcG9ydCB7S2V5RXZlbnRzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9rZXlfZXZlbnRzJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3Rva2Vucyc7XG5pbXBvcnQge0RvbVJvb3RSZW5kZXJlciwgRG9tUm9vdFJlbmRlcmVyX30gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fcmVuZGVyZXInO1xuaW1wb3J0IHtEb21TaGFyZWRTdHlsZXNIb3N0LCBTaGFyZWRTdHlsZXNIb3N0fSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL3NoYXJlZF9zdHlsZXNfaG9zdCc7XG5pbXBvcnQge0Jyb3dzZXJEZXRhaWxzfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9icm93c2VyX2RldGFpbHMnO1xuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlcic7XG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvY29tcGlsZXInO1xuaW1wb3J0IHtYSFJJbXBsfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci94aHJfaW1wbCc7XG5pbXBvcnQge1Rlc3RhYmlsaXR5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5pbXBvcnQge0Jyb3dzZXJHZXRUZXN0YWJpbGl0eX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHtCcm93c2VyRG9tQWRhcHRlcn0gZnJvbSAnLi9icm93c2VyL2Jyb3dzZXJfYWRhcHRlcic7XG5pbXBvcnQge3d0ZkluaXR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3Byb2ZpbGUvd3RmX2luaXQnO1xuaW1wb3J0IHtNZXNzYWdlQmFzZWRSZW5kZXJlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL3JlbmRlcmVyJztcbmltcG9ydCB7TWVzc2FnZUJhc2VkWEhSSW1wbH0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL3hocl9pbXBsJztcbmltcG9ydCB7XG4gIFNlcnZpY2VNZXNzYWdlQnJva2VyRmFjdG9yeSxcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5X1xufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXInO1xuaW1wb3J0IHtcbiAgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksXG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5X1xufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL2NsaWVudF9tZXNzYWdlX2Jyb2tlcic7XG5pbXBvcnQge1xuICBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvblxufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci9sb2NhdGlvbi9icm93c2VyX3BsYXRmb3JtX2xvY2F0aW9uJztcbmltcG9ydCB7U2VyaWFsaXplcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVyJztcbmltcG9ydCB7T05fV0VCX1dPUktFUn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9hcGknO1xuaW1wb3J0IHtSZW5kZXJTdG9yZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9yZW5kZXJfc3RvcmUnO1xuaW1wb3J0IHtcbiAgSEFNTUVSX0dFU1RVUkVfQ09ORklHLFxuICBIYW1tZXJHZXN0dXJlQ29uZmlnLFxuICBIYW1tZXJHZXN0dXJlc1BsdWdpblxufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMnO1xuXG5leHBvcnQgY29uc3QgV09SS0VSX1NDUklQVDogT3BhcXVlVG9rZW4gPSAvKkB0czJkYXJ0X2NvbnN0Ki8gbmV3IE9wYXF1ZVRva2VuKFwiV2ViV29ya2VyU2NyaXB0XCIpO1xuXG4vLyBNZXNzYWdlIGJhc2VkIFdvcmtlciBjbGFzc2VzIHRoYXQgbGlzdGVuIG9uIHRoZSBNZXNzYWdlQnVzXG5leHBvcnQgY29uc3QgV09SS0VSX1JFTkRFUl9NRVNTQUdJTkdfUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW01lc3NhZ2VCYXNlZFJlbmRlcmVyLCBNZXNzYWdlQmFzZWRYSFJJbXBsXTtcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfUExBVEZPUk1fTUFSS0VSID1cbiAgICAvKkB0czJkYXJ0X2NvbnN0Ki8gbmV3IE9wYXF1ZVRva2VuKCdXb3JrZXJSZW5kZXJQbGF0Zm9ybU1hcmtlcicpO1xuXG5leHBvcnQgY29uc3QgV09SS0VSX1JFTkRFUl9QTEFURk9STTogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPSAvKkB0czJkYXJ0X2NvbnN0Ki9bXG4gIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gIC8qQHRzMmRhcnRfY29uc3QqLyAoLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFdPUktFUl9SRU5ERVJfUExBVEZPUk1fTUFSS0VSLCB1c2VWYWx1ZTogdHJ1ZX0pLFxuICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogUExBVEZPUk1fSU5JVElBTElaRVIsIHVzZVZhbHVlOiBpbml0V2ViV29ya2VyUmVuZGVyUGxhdGZvcm0sIG11bHRpOiB0cnVlfVxuXTtcblxuLyoqXG4gKiBBIGxpc3Qgb2Yge0BsaW5rIFByb3ZpZGVyfXMuIFRvIHVzZSB0aGUgcm91dGVyIGluIGEgV29ya2VyIGVuYWJsZWQgYXBwbGljYXRpb24geW91IG11c3RcbiAqIGluY2x1ZGUgdGhlc2UgcHJvdmlkZXJzIHdoZW4gc2V0dGluZyB1cCB0aGUgcmVuZGVyIHRocmVhZC5cbiAqL1xuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfUk9VVEVSOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW0Jyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uXTtcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfQVBQTElDQVRJT05fQ09NTU9OOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW1xuICAgICAgQVBQTElDQVRJT05fQ09NTU9OX1BST1ZJREVSUyxcbiAgICAgIFdPUktFUl9SRU5ERVJfTUVTU0FHSU5HX1BST1ZJREVSUyxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBFeGNlcHRpb25IYW5kbGVyLCB1c2VGYWN0b3J5OiBfZXhjZXB0aW9uSGFuZGxlciwgZGVwczogW119LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IERPQ1VNRU5ULCB1c2VGYWN0b3J5OiBfZG9jdW1lbnQsIGRlcHM6IFtdfSxcbiAgICAgIC8vIFRPRE8oanRlcGxpdHo2MDIpOiBJbnZlc3RpZ2F0ZSBpZiB3ZSBkZWZpbml0ZWx5IG5lZWQgRVZFTlRfTUFOQUdFUiBvbiB0aGUgcmVuZGVyIHRocmVhZFxuICAgICAgLy8gIzUyOThcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHVzZUNsYXNzOiBEb21FdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHVzZUNsYXNzOiBLZXlFdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHVzZUNsYXNzOiBIYW1tZXJHZXN0dXJlc1BsdWdpbiwgbXVsdGk6IHRydWV9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IEhBTU1FUl9HRVNUVVJFX0NPTkZJRywgdXNlQ2xhc3M6IEhhbW1lckdlc3R1cmVDb25maWd9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IERvbVJvb3RSZW5kZXJlciwgdXNlQ2xhc3M6IERvbVJvb3RSZW5kZXJlcl99LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFJvb3RSZW5kZXJlciwgdXNlRXhpc3Rpbmc6IERvbVJvb3RSZW5kZXJlcn0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogU2hhcmVkU3R5bGVzSG9zdCwgdXNlRXhpc3Rpbmc6IERvbVNoYXJlZFN0eWxlc0hvc3R9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFhIUiwgdXNlQ2xhc3M6IFhIUkltcGx9LFxuICAgICAgTWVzc2FnZUJhc2VkWEhSSW1wbCxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnksIHVzZUNsYXNzOiBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnlffSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeSwgdXNlQ2xhc3M6IENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5X30sXG4gICAgICBTZXJpYWxpemVyLFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IE9OX1dFQl9XT1JLRVIsIHVzZVZhbHVlOiBmYWxzZX0sXG4gICAgICBSZW5kZXJTdG9yZSxcbiAgICAgIERvbVNoYXJlZFN0eWxlc0hvc3QsXG4gICAgICBUZXN0YWJpbGl0eSxcbiAgICAgIEJyb3dzZXJEZXRhaWxzLFxuICAgICAgQW5pbWF0aW9uQnVpbGRlcixcbiAgICAgIEV2ZW50TWFuYWdlclxuICAgIF07XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplR2VuZXJpY1dvcmtlclJlbmRlcmVyKGluamVjdG9yOiBJbmplY3Rvcikge1xuICB2YXIgYnVzID0gaW5qZWN0b3IuZ2V0KE1lc3NhZ2VCdXMpO1xuICBsZXQgem9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICBidXMuYXR0YWNoVG9ab25lKHpvbmUpO1xuXG4gIHpvbmUucnVuR3VhcmRlZCgoKSA9PiB7XG4gICAgV09SS0VSX1JFTkRFUl9NRVNTQUdJTkdfUFJPVklERVJTLmZvckVhY2goKHRva2VuKSA9PiB7IGluamVjdG9yLmdldCh0b2tlbikuc3RhcnQoKTsgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFdlYldvcmtlclJlbmRlclBsYXRmb3JtKCk6IHZvaWQge1xuICBCcm93c2VyRG9tQWRhcHRlci5tYWtlQ3VycmVudCgpO1xuICB3dGZJbml0KCk7XG4gIEJyb3dzZXJHZXRUZXN0YWJpbGl0eS5pbml0KCk7XG59XG5cbmZ1bmN0aW9uIF9leGNlcHRpb25IYW5kbGVyKCk6IEV4Y2VwdGlvbkhhbmRsZXIge1xuICByZXR1cm4gbmV3IEV4Y2VwdGlvbkhhbmRsZXIoRE9NLCAhSVNfREFSVCk7XG59XG5cbmZ1bmN0aW9uIF9kb2N1bWVudCgpOiBhbnkge1xuICByZXR1cm4gRE9NLmRlZmF1bHREb2MoKTtcbn1cbiJdfQ==