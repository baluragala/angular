'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var o = require('../output/output_ast');
var identifiers_1 = require('../identifiers');
var util_1 = require('./util');
var ViewQueryValues = (function () {
    function ViewQueryValues(view, values) {
        this.view = view;
        this.values = values;
    }
    return ViewQueryValues;
}());
var CompileQuery = (function () {
    function CompileQuery(meta, queryList, ownerDirectiveExpression, view) {
        this.meta = meta;
        this.queryList = queryList;
        this.ownerDirectiveExpression = ownerDirectiveExpression;
        this.view = view;
        this._values = new ViewQueryValues(view, []);
    }
    CompileQuery.prototype.addValue = function (value, view) {
        var currentView = view;
        var elPath = [];
        while (lang_1.isPresent(currentView) && currentView !== this.view) {
            var parentEl = currentView.declarationElement;
            elPath.unshift(parentEl);
            currentView = parentEl.view;
        }
        var queryListForDirtyExpr = util_1.getPropertyInView(this.queryList, view, this.view);
        var viewValues = this._values;
        elPath.forEach(function (el) {
            var last = viewValues.values.length > 0 ? viewValues.values[viewValues.values.length - 1] : null;
            if (last instanceof ViewQueryValues && last.view === el.embeddedView) {
                viewValues = last;
            }
            else {
                var newViewValues = new ViewQueryValues(el.embeddedView, []);
                viewValues.values.push(newViewValues);
                viewValues = newViewValues;
            }
        });
        viewValues.values.push(value);
        if (elPath.length > 0) {
            view.dirtyParentQueriesMethod.addStmt(queryListForDirtyExpr.callMethod('setDirty', []).toStmt());
        }
    };
    CompileQuery.prototype.afterChildren = function (targetMethod) {
        var values = createQueryValues(this._values);
        var updateStmts = [this.queryList.callMethod('reset', [o.literalArr(values)]).toStmt()];
        if (lang_1.isPresent(this.ownerDirectiveExpression)) {
            var valueExpr = this.meta.first ? this.queryList.prop('first') : this.queryList;
            updateStmts.push(this.ownerDirectiveExpression.prop(this.meta.propertyName).set(valueExpr).toStmt());
        }
        if (!this.meta.first) {
            updateStmts.push(this.queryList.callMethod('notifyOnChanges', []).toStmt());
        }
        targetMethod.addStmt(new o.IfStmt(this.queryList.prop('dirty'), updateStmts));
    };
    return CompileQuery;
}());
exports.CompileQuery = CompileQuery;
function createQueryValues(viewValues) {
    return collection_1.ListWrapper.flatten(viewValues.values.map(function (entry) {
        if (entry instanceof ViewQueryValues) {
            return mapNestedViews(entry.view.declarationElement.appElement, entry.view, createQueryValues(entry));
        }
        else {
            return entry;
        }
    }));
}
function mapNestedViews(declarationAppElement, view, expressions) {
    var adjustedExpressions = expressions.map(function (expr) {
        return o.replaceVarInExpression(o.THIS_EXPR.name, o.variable('nestedView'), expr);
    });
    return declarationAppElement.callMethod('mapNestedViews', [
        o.variable(view.className),
        o.fn([new o.FnParam('nestedView', view.classType)], [new o.ReturnStatement(o.literalArr(adjustedExpressions))])
    ]);
}
function createQueryList(query, directiveInstance, propertyName, compileView) {
    compileView.fields.push(new o.ClassField(propertyName, o.importType(identifiers_1.Identifiers.QueryList)));
    var expr = o.THIS_EXPR.prop(propertyName);
    compileView.createMethod.addStmt(o.THIS_EXPR.prop(propertyName)
        .set(o.importExpr(identifiers_1.Identifiers.QueryList).instantiate([]))
        .toStmt());
    return expr;
}
exports.createQueryList = createQueryList;
function addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach(function (selector) {
        var entry = map.get(selector);
        if (lang_1.isBlank(entry)) {
            entry = [];
            map.add(selector, entry);
        }
        entry.push(query);
    });
}
exports.addQueryToTokenMap = addQueryToTokenMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtMTloVnpSVU4udG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2NvbXBpbGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzVELDJCQUEwQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTNELElBQVksQ0FBQyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDMUMsNEJBQTBCLGdCQUFnQixDQUFDLENBQUE7QUFXM0MscUJBQWdDLFFBQVEsQ0FBQyxDQUFBO0FBRXpDO0lBQ0UseUJBQW1CLElBQWlCLEVBQVMsTUFBNkM7UUFBdkUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXVDO0lBQUcsQ0FBQztJQUNoRyxzQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRUQ7SUFHRSxzQkFBbUIsSUFBMEIsRUFBUyxTQUF1QixFQUMxRCx3QkFBc0MsRUFBUyxJQUFpQjtRQURoRSxTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFDMUQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUFjO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUNqRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsK0JBQVEsR0FBUixVQUFTLEtBQW1CLEVBQUUsSUFBaUI7UUFDN0MsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksTUFBTSxHQUFxQixFQUFFLENBQUM7UUFDbEMsT0FBTyxnQkFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0Qs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QUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFUZSwwQkFBa0IscUJBU2pDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtJZGVudGlmaWVyc30gZnJvbSAnLi4vaWRlbnRpZmllcnMnO1xuXG5pbXBvcnQge1xuICBDb21waWxlUXVlcnlNZXRhZGF0YSxcbiAgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSxcbiAgQ29tcGlsZVRva2VuTWFwXG59IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuXG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge0NvbXBpbGVFbGVtZW50fSBmcm9tICcuL2NvbXBpbGVfZWxlbWVudCc7XG5pbXBvcnQge0NvbXBpbGVNZXRob2R9IGZyb20gJy4vY29tcGlsZV9tZXRob2QnO1xuaW1wb3J0IHtnZXRQcm9wZXJ0eUluVmlld30gZnJvbSAnLi91dGlsJztcblxuY2xhc3MgVmlld1F1ZXJ5VmFsdWVzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHZpZXc6IENvbXBpbGVWaWV3LCBwdWJsaWMgdmFsdWVzOiBBcnJheTxvLkV4cHJlc3Npb24gfCBWaWV3UXVlcnlWYWx1ZXM+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZVF1ZXJ5IHtcbiAgcHJpdmF0ZSBfdmFsdWVzOiBWaWV3UXVlcnlWYWx1ZXM7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG1ldGE6IENvbXBpbGVRdWVyeU1ldGFkYXRhLCBwdWJsaWMgcXVlcnlMaXN0OiBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgIHB1YmxpYyBvd25lckRpcmVjdGl2ZUV4cHJlc3Npb246IG8uRXhwcmVzc2lvbiwgcHVibGljIHZpZXc6IENvbXBpbGVWaWV3KSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3IFZpZXdRdWVyeVZhbHVlcyh2aWV3LCBbXSk7XG4gIH1cblxuICBhZGRWYWx1ZSh2YWx1ZTogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldykge1xuICAgIHZhciBjdXJyZW50VmlldyA9IHZpZXc7XG4gICAgdmFyIGVsUGF0aDogQ29tcGlsZUVsZW1lbnRbXSA9IFtdO1xuICAgIHdoaWxlIChpc1ByZXNlbnQoY3VycmVudFZpZXcpICYmIGN1cnJlbnRWaWV3ICE9PSB0aGlzLnZpZXcpIHtcbiAgICAgIHZhciBwYXJlbnRFbCA9IGN1cnJlbnRWaWV3LmRlY2xhcmF0aW9uRWxlbWVudDtcbiAgICAgIGVsUGF0aC51bnNoaWZ0KHBhcmVudEVsKTtcbiAgICAgIGN1cnJlbnRWaWV3ID0gcGFyZW50RWwudmlldztcbiAgICB9XG4gICAgdmFyIHF1ZXJ5TGlzdEZvckRpcnR5RXhwciA9IGdldFByb3BlcnR5SW5WaWV3KHRoaXMucXVlcnlMaXN0LCB2aWV3LCB0aGlzLnZpZXcpO1xuXG4gICAgdmFyIHZpZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXM7XG4gICAgZWxQYXRoLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICB2YXIgbGFzdCA9XG4gICAgICAgICAgdmlld1ZhbHVlcy52YWx1ZXMubGVuZ3RoID4gMCA/IHZpZXdWYWx1ZXMudmFsdWVzW3ZpZXdWYWx1ZXMudmFsdWVzLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgICAgIGlmIChsYXN0IGluc3RhbmNlb2YgVmlld1F1ZXJ5VmFsdWVzICYmIGxhc3QudmlldyA9PT0gZWwuZW1iZWRkZWRWaWV3KSB7XG4gICAgICAgIHZpZXdWYWx1ZXMgPSBsYXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1ZpZXdWYWx1ZXMgPSBuZXcgVmlld1F1ZXJ5VmFsdWVzKGVsLmVtYmVkZGVkVmlldywgW10pO1xuICAgICAgICB2aWV3VmFsdWVzLnZhbHVlcy5wdXNoKG5ld1ZpZXdWYWx1ZXMpO1xuICAgICAgICB2aWV3VmFsdWVzID0gbmV3Vmlld1ZhbHVlcztcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2aWV3VmFsdWVzLnZhbHVlcy5wdXNoKHZhbHVlKTtcblxuICAgIGlmIChlbFBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgdmlldy5kaXJ0eVBhcmVudFF1ZXJpZXNNZXRob2QuYWRkU3RtdChcbiAgICAgICAgICBxdWVyeUxpc3RGb3JEaXJ0eUV4cHIuY2FsbE1ldGhvZCgnc2V0RGlydHknLCBbXSkudG9TdG10KCkpO1xuICAgIH1cbiAgfVxuXG4gIGFmdGVyQ2hpbGRyZW4odGFyZ2V0TWV0aG9kOiBDb21waWxlTWV0aG9kKSB7XG4gICAgdmFyIHZhbHVlcyA9IGNyZWF0ZVF1ZXJ5VmFsdWVzKHRoaXMuX3ZhbHVlcyk7XG4gICAgdmFyIHVwZGF0ZVN0bXRzID0gW3RoaXMucXVlcnlMaXN0LmNhbGxNZXRob2QoJ3Jlc2V0JywgW28ubGl0ZXJhbEFycih2YWx1ZXMpXSkudG9TdG10KCldO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5vd25lckRpcmVjdGl2ZUV4cHJlc3Npb24pKSB7XG4gICAgICB2YXIgdmFsdWVFeHByID0gdGhpcy5tZXRhLmZpcnN0ID8gdGhpcy5xdWVyeUxpc3QucHJvcCgnZmlyc3QnKSA6IHRoaXMucXVlcnlMaXN0O1xuICAgICAgdXBkYXRlU3RtdHMucHVzaChcbiAgICAgICAgICB0aGlzLm93bmVyRGlyZWN0aXZlRXhwcmVzc2lvbi5wcm9wKHRoaXMubWV0YS5wcm9wZXJ0eU5hbWUpLnNldCh2YWx1ZUV4cHIpLnRvU3RtdCgpKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1ldGEuZmlyc3QpIHtcbiAgICAgIHVwZGF0ZVN0bXRzLnB1c2godGhpcy5xdWVyeUxpc3QuY2FsbE1ldGhvZCgnbm90aWZ5T25DaGFuZ2VzJywgW10pLnRvU3RtdCgpKTtcbiAgICB9XG4gICAgdGFyZ2V0TWV0aG9kLmFkZFN0bXQobmV3IG8uSWZTdG10KHRoaXMucXVlcnlMaXN0LnByb3AoJ2RpcnR5JyksIHVwZGF0ZVN0bXRzKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlUXVlcnlWYWx1ZXModmlld1ZhbHVlczogVmlld1F1ZXJ5VmFsdWVzKTogby5FeHByZXNzaW9uW10ge1xuICByZXR1cm4gTGlzdFdyYXBwZXIuZmxhdHRlbih2aWV3VmFsdWVzLnZhbHVlcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKGVudHJ5IGluc3RhbmNlb2YgVmlld1F1ZXJ5VmFsdWVzKSB7XG4gICAgICByZXR1cm4gbWFwTmVzdGVkVmlld3MoZW50cnkudmlldy5kZWNsYXJhdGlvbkVsZW1lbnQuYXBwRWxlbWVudCwgZW50cnkudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVRdWVyeVZhbHVlcyhlbnRyeSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPG8uRXhwcmVzc2lvbj5lbnRyeTtcbiAgICB9XG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gbWFwTmVzdGVkVmlld3MoZGVjbGFyYXRpb25BcHBFbGVtZW50OiBvLkV4cHJlc3Npb24sIHZpZXc6IENvbXBpbGVWaWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbnM6IG8uRXhwcmVzc2lvbltdKTogby5FeHByZXNzaW9uIHtcbiAgdmFyIGFkanVzdGVkRXhwcmVzc2lvbnM6IG8uRXhwcmVzc2lvbltdID0gZXhwcmVzc2lvbnMubWFwKChleHByKSA9PiB7XG4gICAgcmV0dXJuIG8ucmVwbGFjZVZhckluRXhwcmVzc2lvbihvLlRISVNfRVhQUi5uYW1lLCBvLnZhcmlhYmxlKCduZXN0ZWRWaWV3JyksIGV4cHIpO1xuICB9KTtcbiAgcmV0dXJuIGRlY2xhcmF0aW9uQXBwRWxlbWVudC5jYWxsTWV0aG9kKCdtYXBOZXN0ZWRWaWV3cycsIFtcbiAgICBvLnZhcmlhYmxlKHZpZXcuY2xhc3NOYW1lKSxcbiAgICBvLmZuKFtuZXcgby5GblBhcmFtKCduZXN0ZWRWaWV3Jywgdmlldy5jbGFzc1R5cGUpXSxcbiAgICAgICAgIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQoby5saXRlcmFsQXJyKGFkanVzdGVkRXhwcmVzc2lvbnMpKV0pXG4gIF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUXVlcnlMaXN0KHF1ZXJ5OiBDb21waWxlUXVlcnlNZXRhZGF0YSwgZGlyZWN0aXZlSW5zdGFuY2U6IG8uRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBzdHJpbmcsIGNvbXBpbGVWaWV3OiBDb21waWxlVmlldyk6IG8uRXhwcmVzc2lvbiB7XG4gIGNvbXBpbGVWaWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQocHJvcGVydHlOYW1lLCBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuUXVlcnlMaXN0KSkpO1xuICB2YXIgZXhwciA9IG8uVEhJU19FWFBSLnByb3AocHJvcGVydHlOYW1lKTtcbiAgY29tcGlsZVZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoby5USElTX0VYUFIucHJvcChwcm9wZXJ0eU5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5RdWVyeUxpc3QpLmluc3RhbnRpYXRlKFtdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0bXQoKSk7XG4gIHJldHVybiBleHByO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkUXVlcnlUb1Rva2VuTWFwKG1hcDogQ29tcGlsZVRva2VuTWFwPENvbXBpbGVRdWVyeVtdPiwgcXVlcnk6IENvbXBpbGVRdWVyeSkge1xuICBxdWVyeS5tZXRhLnNlbGVjdG9ycy5mb3JFYWNoKChzZWxlY3RvcikgPT4ge1xuICAgIHZhciBlbnRyeSA9IG1hcC5nZXQoc2VsZWN0b3IpO1xuICAgIGlmIChpc0JsYW5rKGVudHJ5KSkge1xuICAgICAgZW50cnkgPSBbXTtcbiAgICAgIG1hcC5hZGQoc2VsZWN0b3IsIGVudHJ5KTtcbiAgICB9XG4gICAgZW50cnkucHVzaChxdWVyeSk7XG4gIH0pO1xufVxuIl19