import { isBlank } from 'angular2/src/facade/lang';
import { unimplemented } from 'angular2/src/facade/exceptions';
import { ViewUtils } from './view_utils';
/**
 * Represents an instance of a Component created via a {@link ComponentFactory}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
 * method.
 */
export class ComponentRef {
    /**
     * Location of the Host Element of this Component Instance.
     */
    get location() { return unimplemented(); }
    /**
     * The injector on which the component instance exists.
     */
    get injector() { return unimplemented(); }
    /**
     * The instance of the Component.
     */
    get instance() { return unimplemented(); }
    ;
    /**
     * The {@link ViewRef} of the Host View of this Component instance.
     */
    get hostView() { return unimplemented(); }
    ;
    /**
     * The {@link ChangeDetectorRef} of the Component instance.
     */
    get changeDetectorRef() { return unimplemented(); }
    /**
     * The component type.
     */
    get componentType() { return unimplemented(); }
}
export class ComponentRef_ extends ComponentRef {
    constructor(_hostElement, _componentType) {
        super();
        this._hostElement = _hostElement;
        this._componentType = _componentType;
    }
    get location() { return this._hostElement.elementRef; }
    get injector() { return this._hostElement.injector; }
    get instance() { return this._hostElement.component; }
    ;
    get hostView() { return this._hostElement.parentView.ref; }
    ;
    get changeDetectorRef() { return this._hostElement.parentView.ref; }
    ;
    get componentType() { return this._componentType; }
    destroy() { this._hostElement.parentView.destroy(); }
    onDestroy(callback) { this.hostView.onDestroy(callback); }
}
const EMPTY_CONTEXT = new Object();
/*@ts2dart_const*/
export class ComponentFactory {
    constructor(selector, _viewFactory, _componentType) {
        this.selector = selector;
        this._viewFactory = _viewFactory;
        this._componentType = _componentType;
    }
    get componentType() { return this._componentType; }
    /**
     * Creates a new component.
     */
    create(injector, projectableNodes = null, rootSelectorOrNode = null) {
        var vu = injector.get(ViewUtils);
        if (isBlank(projectableNodes)) {
            projectableNodes = [];
        }
        // Note: Host views don't need a declarationAppElement!
        var hostView = this._viewFactory(vu, injector, null);
        var hostElement = hostView.create(EMPTY_CONTEXT, projectableNodes, rootSelectorOrNode);
        return new ComponentRef_(hostElement, this._componentType);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVB4eWE5MGdhLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQ08sRUFBa0IsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQzFELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BSXJELEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYztBQUd0Qzs7Ozs7O0dBTUc7QUFDSDtJQUNFOztPQUVHO0lBQ0gsSUFBSSxRQUFRLEtBQWlCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdEQ7O09BRUc7SUFDSCxJQUFJLFFBQVEsS0FBZSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXBEOztPQUVHO0lBQ0gsSUFBSSxRQUFRLEtBQVEsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7SUFFN0M7O09BRUc7SUFDSCxJQUFJLFFBQVEsS0FBYyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUVuRDs7T0FFRztJQUNILElBQUksaUJBQWlCLEtBQXdCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdEU7O09BRUc7SUFDSCxJQUFJLGFBQWEsS0FBVyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBV3ZELENBQUM7QUFFRCxtQ0FBc0MsWUFBWTtJQUNoRCxZQUFvQixZQUF3QixFQUFVLGNBQW9CO1FBQUksT0FBTyxDQUFDO1FBQWxFLGlCQUFZLEdBQVosWUFBWSxDQUFZO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQU07SUFBYSxDQUFDO0lBQ3hGLElBQUksUUFBUSxLQUFpQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25FLElBQUksUUFBUSxLQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0QsSUFBSSxRQUFRLEtBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7SUFDekQsSUFBSSxRQUFRLEtBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0lBQ3BFLElBQUksaUJBQWlCLEtBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztJQUN2RixJQUFJLGFBQWEsS0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFFekQsT0FBTyxLQUFXLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRCxTQUFTLENBQUMsUUFBa0IsSUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQztBQUVELE1BQU0sYUFBYSxHQUFzQixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBRXRELGtCQUFrQjtBQUNsQjtJQUNFLFlBQW1CLFFBQWdCLEVBQVUsWUFBc0IsRUFDL0MsY0FBb0I7UUFEckIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQy9DLG1CQUFjLEdBQWQsY0FBYyxDQUFNO0lBQUcsQ0FBQztJQUU1QyxJQUFJLGFBQWEsS0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFFekQ7O09BRUc7SUFDSCxNQUFNLENBQUMsUUFBa0IsRUFBRSxnQkFBZ0IsR0FBWSxJQUFJLEVBQ3BELGtCQUFrQixHQUFpQixJQUFJO1FBQzVDLElBQUksRUFBRSxHQUFjLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ0QsdURBQXVEO1FBQ3ZELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBSSxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnLi9lbGVtZW50X3JlZic7XG5pbXBvcnQge1ZpZXdSZWYsIFZpZXdSZWZffSBmcm9tICcuL3ZpZXdfcmVmJztcbmltcG9ydCB7QXBwRWxlbWVudH0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7Vmlld1V0aWxzfSBmcm9tICcuL3ZpZXdfdXRpbHMnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnLi4vY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGluc3RhbmNlIG9mIGEgQ29tcG9uZW50IGNyZWF0ZWQgdmlhIGEge0BsaW5rIENvbXBvbmVudEZhY3Rvcnl9LlxuICpcbiAqIGBDb21wb25lbnRSZWZgIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgQ29tcG9uZW50IEluc3RhbmNlIGFzIHdlbGwgb3RoZXIgb2JqZWN0cyByZWxhdGVkIHRvIHRoaXNcbiAqIENvbXBvbmVudCBJbnN0YW5jZSBhbmQgYWxsb3dzIHlvdSB0byBkZXN0cm95IHRoZSBDb21wb25lbnQgSW5zdGFuY2UgdmlhIHRoZSB7QGxpbmsgI2Rlc3Ryb3l9XG4gKiBtZXRob2QuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRSZWY8Qz4ge1xuICAvKipcbiAgICogTG9jYXRpb24gb2YgdGhlIEhvc3QgRWxlbWVudCBvZiB0aGlzIENvbXBvbmVudCBJbnN0YW5jZS5cbiAgICovXG4gIGdldCBsb2NhdGlvbigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW5qZWN0b3Igb24gd2hpY2ggdGhlIGNvbXBvbmVudCBpbnN0YW5jZSBleGlzdHMuXG4gICAqL1xuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gdW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgQ29tcG9uZW50LlxuICAgKi9cbiAgZ2V0IGluc3RhbmNlKCk6IEMgeyByZXR1cm4gdW5pbXBsZW1lbnRlZCgpOyB9O1xuXG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIFZpZXdSZWZ9IG9mIHRoZSBIb3N0IFZpZXcgb2YgdGhpcyBDb21wb25lbnQgaW5zdGFuY2UuXG4gICAqL1xuICBnZXQgaG9zdFZpZXcoKTogVmlld1JlZiB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIFRoZSB7QGxpbmsgQ2hhbmdlRGV0ZWN0b3JSZWZ9IG9mIHRoZSBDb21wb25lbnQgaW5zdGFuY2UuXG4gICAqL1xuICBnZXQgY2hhbmdlRGV0ZWN0b3JSZWYoKTogQ2hhbmdlRGV0ZWN0b3JSZWYgeyByZXR1cm4gdW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBjb21wb25lbnQgdHlwZS5cbiAgICovXG4gIGdldCBjb21wb25lbnRUeXBlKCk6IFR5cGUgeyByZXR1cm4gdW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgYW5kIGFsbCBvZiB0aGUgZGF0YSBzdHJ1Y3R1cmVzIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICovXG4gIGFic3RyYWN0IGRlc3Ryb3koKTogdm9pZDtcblxuICAvKipcbiAgICogQWxsb3dzIHRvIHJlZ2lzdGVyIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgKi9cbiAgYWJzdHJhY3Qgb25EZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRSZWZfPEM+IGV4dGVuZHMgQ29tcG9uZW50UmVmPEM+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaG9zdEVsZW1lbnQ6IEFwcEVsZW1lbnQsIHByaXZhdGUgX2NvbXBvbmVudFR5cGU6IFR5cGUpIHsgc3VwZXIoKTsgfVxuICBnZXQgbG9jYXRpb24oKTogRWxlbWVudFJlZiB7IHJldHVybiB0aGlzLl9ob3N0RWxlbWVudC5lbGVtZW50UmVmOyB9XG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl9ob3N0RWxlbWVudC5pbmplY3RvcjsgfVxuICBnZXQgaW5zdGFuY2UoKTogQyB7IHJldHVybiB0aGlzLl9ob3N0RWxlbWVudC5jb21wb25lbnQ7IH07XG4gIGdldCBob3N0VmlldygpOiBWaWV3UmVmIHsgcmV0dXJuIHRoaXMuX2hvc3RFbGVtZW50LnBhcmVudFZpZXcucmVmOyB9O1xuICBnZXQgY2hhbmdlRGV0ZWN0b3JSZWYoKTogQ2hhbmdlRGV0ZWN0b3JSZWYgeyByZXR1cm4gdGhpcy5faG9zdEVsZW1lbnQucGFyZW50Vmlldy5yZWY7IH07XG4gIGdldCBjb21wb25lbnRUeXBlKCk6IFR5cGUgeyByZXR1cm4gdGhpcy5fY29tcG9uZW50VHlwZTsgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7IHRoaXMuX2hvc3RFbGVtZW50LnBhcmVudFZpZXcuZGVzdHJveSgpOyB9XG4gIG9uRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHsgdGhpcy5ob3N0Vmlldy5vbkRlc3Ryb3koY2FsbGJhY2spOyB9XG59XG5cbmNvbnN0IEVNUFRZX0NPTlRFWFQgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gbmV3IE9iamVjdCgpO1xuXG4vKkB0czJkYXJ0X2NvbnN0Ki9cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRGYWN0b3J5PEM+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHNlbGVjdG9yOiBzdHJpbmcsIHByaXZhdGUgX3ZpZXdGYWN0b3J5OiBGdW5jdGlvbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tcG9uZW50VHlwZTogVHlwZSkge31cblxuICBnZXQgY29tcG9uZW50VHlwZSgpOiBUeXBlIHsgcmV0dXJuIHRoaXMuX2NvbXBvbmVudFR5cGU7IH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjb21wb25lbnQuXG4gICAqL1xuICBjcmVhdGUoaW5qZWN0b3I6IEluamVjdG9yLCBwcm9qZWN0YWJsZU5vZGVzOiBhbnlbXVtdID0gbnVsbCxcbiAgICAgICAgIHJvb3RTZWxlY3Rvck9yTm9kZTogc3RyaW5nIHwgYW55ID0gbnVsbCk6IENvbXBvbmVudFJlZjxDPiB7XG4gICAgdmFyIHZ1OiBWaWV3VXRpbHMgPSBpbmplY3Rvci5nZXQoVmlld1V0aWxzKTtcbiAgICBpZiAoaXNCbGFuayhwcm9qZWN0YWJsZU5vZGVzKSkge1xuICAgICAgcHJvamVjdGFibGVOb2RlcyA9IFtdO1xuICAgIH1cbiAgICAvLyBOb3RlOiBIb3N0IHZpZXdzIGRvbid0IG5lZWQgYSBkZWNsYXJhdGlvbkFwcEVsZW1lbnQhXG4gICAgdmFyIGhvc3RWaWV3ID0gdGhpcy5fdmlld0ZhY3RvcnkodnUsIGluamVjdG9yLCBudWxsKTtcbiAgICB2YXIgaG9zdEVsZW1lbnQgPSBob3N0Vmlldy5jcmVhdGUoRU1QVFlfQ09OVEVYVCwgcHJvamVjdGFibGVOb2Rlcywgcm9vdFNlbGVjdG9yT3JOb2RlKTtcbiAgICByZXR1cm4gbmV3IENvbXBvbmVudFJlZl88Qz4oaG9zdEVsZW1lbnQsIHRoaXMuX2NvbXBvbmVudFR5cGUpO1xuICB9XG59XG4iXX0=