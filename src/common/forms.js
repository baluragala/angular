'use strict';"use strict";
/**
 * @module
 * @description
 * This module is used for handling user input, by defining and building a {@link ControlGroup} that
 * consists of
 * {@link Control} objects, and mapping them onto the DOM. {@link Control} objects can then be used
 * to read information
 * from the form DOM elements.
 *
 * This module is not included in the `angular2` module; you must import the forms module
 * explicitly.
 *
 */
var model_1 = require('./forms/model');
exports.AbstractControl = model_1.AbstractControl;
exports.Control = model_1.Control;
exports.ControlGroup = model_1.ControlGroup;
exports.ControlArray = model_1.ControlArray;
var abstract_control_directive_1 = require('./forms/directives/abstract_control_directive');
exports.AbstractControlDirective = abstract_control_directive_1.AbstractControlDirective;
var control_container_1 = require('./forms/directives/control_container');
exports.ControlContainer = control_container_1.ControlContainer;
var ng_control_name_1 = require('./forms/directives/ng_control_name');
exports.NgControlName = ng_control_name_1.NgControlName;
var ng_form_control_1 = require('./forms/directives/ng_form_control');
exports.NgFormControl = ng_form_control_1.NgFormControl;
var ng_model_1 = require('./forms/directives/ng_model');
exports.NgModel = ng_model_1.NgModel;
var ng_control_1 = require('./forms/directives/ng_control');
exports.NgControl = ng_control_1.NgControl;
var ng_control_group_1 = require('./forms/directives/ng_control_group');
exports.NgControlGroup = ng_control_group_1.NgControlGroup;
var ng_form_model_1 = require('./forms/directives/ng_form_model');
exports.NgFormModel = ng_form_model_1.NgFormModel;
var ng_form_1 = require('./forms/directives/ng_form');
exports.NgForm = ng_form_1.NgForm;
var control_value_accessor_1 = require('./forms/directives/control_value_accessor');
exports.NG_VALUE_ACCESSOR = control_value_accessor_1.NG_VALUE_ACCESSOR;
var default_value_accessor_1 = require('./forms/directives/default_value_accessor');
exports.DefaultValueAccessor = default_value_accessor_1.DefaultValueAccessor;
var ng_control_status_1 = require('./forms/directives/ng_control_status');
exports.NgControlStatus = ng_control_status_1.NgControlStatus;
var checkbox_value_accessor_1 = require('./forms/directives/checkbox_value_accessor');
exports.CheckboxControlValueAccessor = checkbox_value_accessor_1.CheckboxControlValueAccessor;
var select_control_value_accessor_1 = require('./forms/directives/select_control_value_accessor');
exports.NgSelectOption = select_control_value_accessor_1.NgSelectOption;
exports.SelectControlValueAccessor = select_control_value_accessor_1.SelectControlValueAccessor;
var directives_1 = require('./forms/directives');
exports.FORM_DIRECTIVES = directives_1.FORM_DIRECTIVES;
exports.RadioButtonState = directives_1.RadioButtonState;
var validators_1 = require('./forms/validators');
exports.NG_VALIDATORS = validators_1.NG_VALIDATORS;
exports.NG_ASYNC_VALIDATORS = validators_1.NG_ASYNC_VALIDATORS;
exports.Validators = validators_1.Validators;
var validators_2 = require('./forms/directives/validators');
exports.RequiredValidator = validators_2.RequiredValidator;
exports.MinLengthValidator = validators_2.MinLengthValidator;
exports.MaxLengthValidator = validators_2.MaxLengthValidator;
exports.PatternValidator = validators_2.PatternValidator;
var form_builder_1 = require('./forms/form_builder');
exports.FormBuilder = form_builder_1.FormBuilder;
var form_builder_2 = require('./forms/form_builder');
var radio_control_value_accessor_1 = require('./forms/directives/radio_control_value_accessor');
/**
 * Shorthand set of providers used for building Angular forms.
 *
 * ### Example
 *
 * ```typescript
 * bootstrap(MyApp, [FORM_PROVIDERS]);
 * ```
 */
exports.FORM_PROVIDERS = [form_builder_2.FormBuilder, radio_control_value_accessor_1.RadioControlRegistry];
/**
 * See {@link FORM_PROVIDERS} instead.
 *
 * @deprecated
 */
exports.FORM_BINDINGS = exports.FORM_PROVIDERS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTE5aFZ6UlVOLnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL2Zvcm1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxzQkFBbUUsZUFBZSxDQUFDO0FBQTNFLGtEQUFlO0FBQUUsa0NBQU87QUFBRSw0Q0FBWTtBQUFFLDRDQUFtQztBQUVuRiwyQ0FBdUMsK0NBQStDLENBQUM7QUFBL0UseUZBQStFO0FBRXZGLGtDQUErQixzQ0FBc0MsQ0FBQztBQUE5RCxnRUFBOEQ7QUFDdEUsZ0NBQTRCLG9DQUFvQyxDQUFDO0FBQXpELHdEQUF5RDtBQUNqRSxnQ0FBNEIsb0NBQW9DLENBQUM7QUFBekQsd0RBQXlEO0FBQ2pFLHlCQUFzQiw2QkFBNkIsQ0FBQztBQUE1QyxxQ0FBNEM7QUFDcEQsMkJBQXdCLCtCQUErQixDQUFDO0FBQWhELDJDQUFnRDtBQUN4RCxpQ0FBNkIscUNBQXFDLENBQUM7QUFBM0QsMkRBQTJEO0FBQ25FLDhCQUEwQixrQ0FBa0MsQ0FBQztBQUFyRCxrREFBcUQ7QUFDN0Qsd0JBQXFCLDRCQUE0QixDQUFDO0FBQTFDLGtDQUEwQztBQUNsRCx1Q0FBc0QsMkNBQTJDLENBQUM7QUFBcEUsdUVBQW9FO0FBQ2xHLHVDQUFtQywyQ0FBMkMsQ0FBQztBQUF2RSw2RUFBdUU7QUFDL0Usa0NBQThCLHNDQUFzQyxDQUFDO0FBQTdELDhEQUE2RDtBQUNyRSx3Q0FBMkMsNENBQTRDLENBQUM7QUFBaEYsOEZBQWdGO0FBQ3hGLDhDQUdPLGtEQUFrRCxDQUFDO0FBRnhELHdFQUFjO0FBQ2QsZ0dBQ3dEO0FBQzFELDJCQUFnRCxvQkFBb0IsQ0FBQztBQUE3RCx1REFBZTtBQUFFLHlEQUE0QztBQUNyRSwyQkFBNkQsb0JBQW9CLENBQUM7QUFBMUUsbURBQWE7QUFBRSwrREFBbUI7QUFBRSw2Q0FBc0M7QUFDbEYsMkJBTU8sK0JBQStCLENBQUM7QUFMckMsMkRBQWlCO0FBQ2pCLDZEQUFrQjtBQUNsQiw2REFBa0I7QUFDbEIseURBRXFDO0FBQ3ZDLDZCQUEwQixzQkFBc0IsQ0FBQztBQUF6QyxpREFBeUM7QUFDakQsNkJBQTBCLHNCQUFzQixDQUFDLENBQUE7QUFDakQsNkNBQW1DLGlEQUFpRCxDQUFDLENBQUE7QUFHckY7Ozs7Ozs7O0dBUUc7QUFDVSxzQkFBYyxHQUE2QixDQUFDLDBCQUFXLEVBQUUsbURBQW9CLENBQUMsQ0FBQztBQUU1Rjs7OztHQUlHO0FBQ1UscUJBQWEsR0FBc0Isc0JBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQG1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIG1vZHVsZSBpcyB1c2VkIGZvciBoYW5kbGluZyB1c2VyIGlucHV0LCBieSBkZWZpbmluZyBhbmQgYnVpbGRpbmcgYSB7QGxpbmsgQ29udHJvbEdyb3VwfSB0aGF0XG4gKiBjb25zaXN0cyBvZlxuICoge0BsaW5rIENvbnRyb2x9IG9iamVjdHMsIGFuZCBtYXBwaW5nIHRoZW0gb250byB0aGUgRE9NLiB7QGxpbmsgQ29udHJvbH0gb2JqZWN0cyBjYW4gdGhlbiBiZSB1c2VkXG4gKiB0byByZWFkIGluZm9ybWF0aW9uXG4gKiBmcm9tIHRoZSBmb3JtIERPTSBlbGVtZW50cy5cbiAqXG4gKiBUaGlzIG1vZHVsZSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGBhbmd1bGFyMmAgbW9kdWxlOyB5b3UgbXVzdCBpbXBvcnQgdGhlIGZvcm1zIG1vZHVsZVxuICogZXhwbGljaXRseS5cbiAqXG4gKi9cbmV4cG9ydCB7QWJzdHJhY3RDb250cm9sLCBDb250cm9sLCBDb250cm9sR3JvdXAsIENvbnRyb2xBcnJheX0gZnJvbSAnLi9mb3Jtcy9tb2RlbCc7XG5cbmV4cG9ydCB7QWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuZXhwb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvZm9ybV9pbnRlcmZhY2UnO1xuZXhwb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvY29udHJvbF9jb250YWluZXInO1xuZXhwb3J0IHtOZ0NvbnRyb2xOYW1lfSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvbmdfY29udHJvbF9uYW1lJztcbmV4cG9ydCB7TmdGb3JtQ29udHJvbH0gZnJvbSAnLi9mb3Jtcy9kaXJlY3RpdmVzL25nX2Zvcm1fY29udHJvbCc7XG5leHBvcnQge05nTW9kZWx9IGZyb20gJy4vZm9ybXMvZGlyZWN0aXZlcy9uZ19tb2RlbCc7XG5leHBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9mb3Jtcy9kaXJlY3RpdmVzL25nX2NvbnRyb2wnO1xuZXhwb3J0IHtOZ0NvbnRyb2xHcm91cH0gZnJvbSAnLi9mb3Jtcy9kaXJlY3RpdmVzL25nX2NvbnRyb2xfZ3JvdXAnO1xuZXhwb3J0IHtOZ0Zvcm1Nb2RlbH0gZnJvbSAnLi9mb3Jtcy9kaXJlY3RpdmVzL25nX2Zvcm1fbW9kZWwnO1xuZXhwb3J0IHtOZ0Zvcm19IGZyb20gJy4vZm9ybXMvZGlyZWN0aXZlcy9uZ19mb3JtJztcbmV4cG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0RlZmF1bHRWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge05nQ29udHJvbFN0YXR1c30gZnJvbSAnLi9mb3Jtcy9kaXJlY3RpdmVzL25nX2NvbnRyb2xfc3RhdHVzJztcbmV4cG9ydCB7Q2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9mb3Jtcy9kaXJlY3RpdmVzL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7XG4gIE5nU2VsZWN0T3B0aW9uLFxuICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvclxufSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtGT1JNX0RJUkVDVElWRVMsIFJhZGlvQnV0dG9uU3RhdGV9IGZyb20gJy4vZm9ybXMvZGlyZWN0aXZlcyc7XG5leHBvcnQge05HX1ZBTElEQVRPUlMsIE5HX0FTWU5DX1ZBTElEQVRPUlMsIFZhbGlkYXRvcnN9IGZyb20gJy4vZm9ybXMvdmFsaWRhdG9ycyc7XG5leHBvcnQge1xuICBSZXF1aXJlZFZhbGlkYXRvcixcbiAgTWluTGVuZ3RoVmFsaWRhdG9yLFxuICBNYXhMZW5ndGhWYWxpZGF0b3IsXG4gIFBhdHRlcm5WYWxpZGF0b3IsXG4gIFZhbGlkYXRvclxufSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5leHBvcnQge0Zvcm1CdWlsZGVyfSBmcm9tICcuL2Zvcm1zL2Zvcm1fYnVpbGRlcic7XG5pbXBvcnQge0Zvcm1CdWlsZGVyfSBmcm9tICcuL2Zvcm1zL2Zvcm1fYnVpbGRlcic7XG5pbXBvcnQge1JhZGlvQ29udHJvbFJlZ2lzdHJ5fSBmcm9tICcuL2Zvcm1zL2RpcmVjdGl2ZXMvcmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1R5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbi8qKlxuICogU2hvcnRoYW5kIHNldCBvZiBwcm92aWRlcnMgdXNlZCBmb3IgYnVpbGRpbmcgQW5ndWxhciBmb3Jtcy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGJvb3RzdHJhcChNeUFwcCwgW0ZPUk1fUFJPVklERVJTXSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNvbnN0IEZPUk1fUFJPVklERVJTOiBUeXBlW10gPSAvKkB0czJkYXJ0X2NvbnN0Ki9bRm9ybUJ1aWxkZXIsIFJhZGlvQ29udHJvbFJlZ2lzdHJ5XTtcblxuLyoqXG4gKiBTZWUge0BsaW5rIEZPUk1fUFJPVklERVJTfSBpbnN0ZWFkLlxuICpcbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBjb25zdCBGT1JNX0JJTkRJTkdTID0gLypAdHMyZGFydF9jb25zdCovIEZPUk1fUFJPVklERVJTO1xuIl19