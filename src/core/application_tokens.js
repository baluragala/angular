'use strict';"use strict";
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
/**
 * A DI Token representing a unique string id assigned to the application by Angular and used
 * primarily for prefixing application attributes and CSS styles when
 * {@link ViewEncapsulation#Emulated} is being used.
 *
 * If you need to avoid randomly generated value to be used as an application id, you can provide
 * a custom value via a DI provider <!-- TODO: provider --> configuring the root {@link Injector}
 * using this token.
 */
exports.APP_ID = new di_1.OpaqueToken('AppId');
function _appIdRandomProviderFactory() {
    return "" + _randomChar() + _randomChar() + _randomChar();
}
/**
 * Providers that will generate a random APP_ID_TOKEN.
 */
exports.APP_ID_RANDOM_PROVIDER = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: exports.APP_ID,
    useFactory: _appIdRandomProviderFactory,
    deps: []
};
function _randomChar() {
    return lang_1.StringWrapper.fromCharCode(97 + lang_1.Math.floor(lang_1.Math.random() * 25));
}
/**
 * A function that will be executed when a platform is initialized.
 */
exports.PLATFORM_INITIALIZER = 
/*@ts2dart_const*/ new di_1.OpaqueToken("Platform Initializer");
/**
 * A function that will be executed when an application is initialized.
 */
exports.APP_INITIALIZER = 
/*@ts2dart_const*/ new di_1.OpaqueToken("Application Initializer");
/**
 * A token which indicates the root directory of the application
 */
exports.PACKAGE_ROOT_URL = 
/*@ts2dart_const*/ new di_1.OpaqueToken("Application Packages Root URL");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fdG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC0xOWhWelJVTi50bXAvYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fdG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQkFBb0Msc0JBQXNCLENBQUMsQ0FBQTtBQUMzRCxxQkFBa0MsMEJBQTBCLENBQUMsQ0FBQTtBQUU3RDs7Ozs7Ozs7R0FRRztBQUNVLGNBQU0sR0FBMkIsSUFBSSxnQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZFO0lBQ0UsTUFBTSxDQUFDLEtBQUcsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFJLENBQUM7QUFDNUQsQ0FBQztBQUVEOztHQUVHO0FBQ1UsOEJBQXNCO0FBQy9CLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDO0lBQ3pDLE9BQU8sRUFBRSxjQUFNO0lBQ2YsVUFBVSxFQUFFLDJCQUEyQjtJQUN2QyxJQUFJLEVBQUUsRUFBRTtDQUNULENBQUM7QUFFTjtJQUNFLE1BQU0sQ0FBQyxvQkFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLEdBQUcsV0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQ7O0dBRUc7QUFDVSw0QkFBb0I7QUFDN0Isa0JBQWtCLENBQUMsSUFBSSxnQkFBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFL0Q7O0dBRUc7QUFDVSx1QkFBZTtBQUN4QixrQkFBa0IsQ0FBQyxJQUFJLGdCQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUVsRTs7R0FFRztBQUNVLHdCQUFnQjtBQUN6QixrQkFBa0IsQ0FBQyxJQUFJLGdCQUFXLENBQUMsK0JBQStCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T3BhcXVlVG9rZW4sIFByb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge01hdGgsIFN0cmluZ1dyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbi8qKlxuICogQSBESSBUb2tlbiByZXByZXNlbnRpbmcgYSB1bmlxdWUgc3RyaW5nIGlkIGFzc2lnbmVkIHRvIHRoZSBhcHBsaWNhdGlvbiBieSBBbmd1bGFyIGFuZCB1c2VkXG4gKiBwcmltYXJpbHkgZm9yIHByZWZpeGluZyBhcHBsaWNhdGlvbiBhdHRyaWJ1dGVzIGFuZCBDU1Mgc3R5bGVzIHdoZW5cbiAqIHtAbGluayBWaWV3RW5jYXBzdWxhdGlvbiNFbXVsYXRlZH0gaXMgYmVpbmcgdXNlZC5cbiAqXG4gKiBJZiB5b3UgbmVlZCB0byBhdm9pZCByYW5kb21seSBnZW5lcmF0ZWQgdmFsdWUgdG8gYmUgdXNlZCBhcyBhbiBhcHBsaWNhdGlvbiBpZCwgeW91IGNhbiBwcm92aWRlXG4gKiBhIGN1c3RvbSB2YWx1ZSB2aWEgYSBESSBwcm92aWRlciA8IS0tIFRPRE86IHByb3ZpZGVyIC0tPiBjb25maWd1cmluZyB0aGUgcm9vdCB7QGxpbmsgSW5qZWN0b3J9XG4gKiB1c2luZyB0aGlzIHRva2VuLlxuICovXG5leHBvcnQgY29uc3QgQVBQX0lEOiBhbnkgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gbmV3IE9wYXF1ZVRva2VuKCdBcHBJZCcpO1xuXG5mdW5jdGlvbiBfYXBwSWRSYW5kb21Qcm92aWRlckZhY3RvcnkoKSB7XG4gIHJldHVybiBgJHtfcmFuZG9tQ2hhcigpfSR7X3JhbmRvbUNoYXIoKX0ke19yYW5kb21DaGFyKCl9YDtcbn1cblxuLyoqXG4gKiBQcm92aWRlcnMgdGhhdCB3aWxsIGdlbmVyYXRlIGEgcmFuZG9tIEFQUF9JRF9UT0tFTi5cbiAqL1xuZXhwb3J0IGNvbnN0IEFQUF9JRF9SQU5ET01fUFJPVklERVIgPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqLyAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7XG4gICAgICBwcm92aWRlOiBBUFBfSUQsXG4gICAgICB1c2VGYWN0b3J5OiBfYXBwSWRSYW5kb21Qcm92aWRlckZhY3RvcnksXG4gICAgICBkZXBzOiBbXVxuICAgIH07XG5cbmZ1bmN0aW9uIF9yYW5kb21DaGFyKCk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLmZyb21DaGFyQ29kZSg5NyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1KSk7XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiBhIHBsYXRmb3JtIGlzIGluaXRpYWxpemVkLlxuICovXG5leHBvcnQgY29uc3QgUExBVEZPUk1fSU5JVElBTElaRVI6IGFueSA9XG4gICAgLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbihcIlBsYXRmb3JtIEluaXRpYWxpemVyXCIpO1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gYW4gYXBwbGljYXRpb24gaXMgaW5pdGlhbGl6ZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBBUFBfSU5JVElBTElaRVI6IGFueSA9XG4gICAgLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbihcIkFwcGxpY2F0aW9uIEluaXRpYWxpemVyXCIpO1xuXG4vKipcbiAqIEEgdG9rZW4gd2hpY2ggaW5kaWNhdGVzIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgYXBwbGljYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFBBQ0tBR0VfUk9PVF9VUkw6IGFueSA9XG4gICAgLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbihcIkFwcGxpY2F0aW9uIFBhY2thZ2VzIFJvb3QgVVJMXCIpO1xuIl19