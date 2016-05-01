import { Map, ListWrapper } from 'angular2/src/facade/collection';
import { isPresent, isBlank, RegExpWrapper, RegExpMatcherWrapper, StringWrapper } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
const _EMPTY_ATTR_VALUE = '';
// TODO: Can't use `const` here as
// in Dart this is not transpiled into `final` yet...
var _SELECTOR_REGEXP = RegExpWrapper.create('(\\:not\\()|' +
    '([-\\w]+)|' +
    '(?:\\.([-\\w]+))|' +
    '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' +
    '(\\))|' +
    '(\\s*,\\s*)'); // ","
/**
 * A css selector contains an element name,
 * css classes and attribute/value pairs with the purpose
 * of selecting subsets out of them.
 */
export class CssSelector {
    constructor() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
    }
    static parse(selector) {
        var results = [];
        var _addResult = (res, cssSel) => {
            if (cssSel.notSelectors.length > 0 && isBlank(cssSel.element) &&
                ListWrapper.isEmpty(cssSel.classNames) && ListWrapper.isEmpty(cssSel.attrs)) {
                cssSel.element = "*";
            }
            res.push(cssSel);
        };
        var cssSelector = new CssSelector();
        var matcher = RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
        var match;
        var current = cssSelector;
        var inNot = false;
        while (isPresent(match = RegExpMatcherWrapper.next(matcher))) {
            if (isPresent(match[1])) {
                if (inNot) {
                    throw new BaseException('Nesting :not is not allowed in a selector');
                }
                inNot = true;
                current = new CssSelector();
                cssSelector.notSelectors.push(current);
            }
            if (isPresent(match[2])) {
                current.setElement(match[2]);
            }
            if (isPresent(match[3])) {
                current.addClassName(match[3]);
            }
            if (isPresent(match[4])) {
                current.addAttribute(match[4], match[5]);
            }
            if (isPresent(match[6])) {
                inNot = false;
                current = cssSelector;
            }
            if (isPresent(match[7])) {
                if (inNot) {
                    throw new BaseException('Multiple selectors in :not are not supported');
                }
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
            }
        }
        _addResult(results, cssSelector);
        return results;
    }
    isElementSelector() {
        return isPresent(this.element) && ListWrapper.isEmpty(this.classNames) &&
            ListWrapper.isEmpty(this.attrs) && this.notSelectors.length === 0;
    }
    setElement(element = null) { this.element = element; }
    /** Gets a template string for an element that matches the selector. */
    getMatchingElementTemplate() {
        let tagName = isPresent(this.element) ? this.element : 'div';
        let classAttr = this.classNames.length > 0 ? ` class="${this.classNames.join(' ')}"` : '';
        let attrs = '';
        for (let i = 0; i < this.attrs.length; i += 2) {
            let attrName = this.attrs[i];
            let attrValue = this.attrs[i + 1] !== '' ? `="${this.attrs[i + 1]}"` : '';
            attrs += ` ${attrName}${attrValue}`;
        }
        return `<${tagName}${classAttr}${attrs}></${tagName}>`;
    }
    addAttribute(name, value = _EMPTY_ATTR_VALUE) {
        this.attrs.push(name);
        if (isPresent(value)) {
            value = value.toLowerCase();
        }
        else {
            value = _EMPTY_ATTR_VALUE;
        }
        this.attrs.push(value);
    }
    addClassName(name) { this.classNames.push(name.toLowerCase()); }
    toString() {
        var res = '';
        if (isPresent(this.element)) {
            res += this.element;
        }
        if (isPresent(this.classNames)) {
            for (var i = 0; i < this.classNames.length; i++) {
                res += '.' + this.classNames[i];
            }
        }
        if (isPresent(this.attrs)) {
            for (var i = 0; i < this.attrs.length;) {
                var attrName = this.attrs[i++];
                var attrValue = this.attrs[i++];
                res += '[' + attrName;
                if (attrValue.length > 0) {
                    res += '=' + attrValue;
                }
                res += ']';
            }
        }
        this.notSelectors.forEach(notSelector => res += `:not(${notSelector})`);
        return res;
    }
}
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
export class SelectorMatcher {
    constructor() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
    }
    static createNotMatcher(notSelectors) {
        var notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    }
    addSelectables(cssSelectors, callbackCtxt) {
        var listContext = null;
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (var i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    }
    /**
     * Add an object that can be found later on by calling `match`.
     * @param cssSelector A css selector
     * @param callbackCtxt An opaque object that will be given to the callback of the `match` function
     */
    _addSelectable(cssSelector, callbackCtxt, listContext) {
        var matcher = this;
        var element = cssSelector.element;
        var classNames = cssSelector.classNames;
        var attrs = cssSelector.attrs;
        var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (isPresent(element)) {
            var isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (isPresent(classNames)) {
            for (var index = 0; index < classNames.length; index++) {
                var isTerminal = attrs.length === 0 && index === classNames.length - 1;
                var className = classNames[index];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (isPresent(attrs)) {
            for (var index = 0; index < attrs.length;) {
                var isTerminal = index === attrs.length - 2;
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                if (isTerminal) {
                    var terminalMap = matcher._attrValueMap;
                    var terminalValuesMap = terminalMap.get(attrName);
                    if (isBlank(terminalValuesMap)) {
                        terminalValuesMap = new Map();
                        terminalMap.set(attrName, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, attrValue, selectable);
                }
                else {
                    var parttialMap = matcher._attrValuePartialMap;
                    var partialValuesMap = parttialMap.get(attrName);
                    if (isBlank(partialValuesMap)) {
                        partialValuesMap = new Map();
                        parttialMap.set(attrName, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, attrValue);
                }
            }
        }
    }
    _addTerminal(map, name, selectable) {
        var terminalList = map.get(name);
        if (isBlank(terminalList)) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    }
    _addPartial(map, name) {
        var matcher = map.get(name);
        if (isBlank(matcher)) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    }
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param cssSelector A css selector
     * @param matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return boolean true if a match was found
    */
    match(cssSelector, matchedCallback) {
        var result = false;
        var element = cssSelector.element;
        var classNames = cssSelector.classNames;
        var attrs = cssSelector.attrs;
        for (var i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (isPresent(classNames)) {
            for (var index = 0; index < classNames.length; index++) {
                var className = classNames[index];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (isPresent(attrs)) {
            for (var index = 0; index < attrs.length;) {
                var attrName = attrs[index++];
                var attrValue = attrs[index++];
                var terminalValuesMap = this._attrValueMap.get(attrName);
                if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                    result = this._matchTerminal(terminalValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) ||
                        result;
                }
                result = this._matchTerminal(terminalValuesMap, attrValue, cssSelector, matchedCallback) ||
                    result;
                var partialValuesMap = this._attrValuePartialMap.get(attrName);
                if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                    result = this._matchPartial(partialValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) ||
                        result;
                }
                result =
                    this._matchPartial(partialValuesMap, attrValue, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    }
    /** @internal */
    _matchTerminal(map, name, cssSelector, matchedCallback) {
        if (isBlank(map) || isBlank(name)) {
            return false;
        }
        var selectables = map.get(name);
        var starSelectables = map.get("*");
        if (isPresent(starSelectables)) {
            selectables = selectables.concat(starSelectables);
        }
        if (isBlank(selectables)) {
            return false;
        }
        var selectable;
        var result = false;
        for (var index = 0; index < selectables.length; index++) {
            selectable = selectables[index];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    }
    /** @internal */
    _matchPartial(map, name, cssSelector, matchedCallback /*: (c: CssSelector, a: any) => void*/) {
        if (isBlank(map) || isBlank(name)) {
            return false;
        }
        var nestedSelector = map.get(name);
        if (isBlank(nestedSelector)) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    }
}
export class SelectorListContext {
    constructor(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
}
// Store context to pass back selector and context when a selector is matched
export class SelectorContext {
    constructor(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    finalize(cssSelector, callback) {
        var result = true;
        if (this.notSelectors.length > 0 &&
            (isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
            var notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && isPresent(callback) &&
            (isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
            if (isPresent(this.listContext)) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVB4eWE5MGdhLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxHQUFHLEVBQUUsV0FBVyxFQUFhLE1BQU0sZ0NBQWdDO09BQ3BFLEVBQ0wsU0FBUyxFQUNULE9BQU8sRUFDUCxhQUFhLEVBQ2Isb0JBQW9CLEVBQ3BCLGFBQWEsRUFDZCxNQUFNLDBCQUEwQjtPQUMxQixFQUFDLGFBQWEsRUFBbUIsTUFBTSxnQ0FBZ0M7QUFFOUUsTUFBTSxpQkFBaUIsR0FBc0IsRUFBRSxDQUFDO0FBRWhELGtDQUFrQztBQUNsQyxxREFBcUQ7QUFDckQsSUFBSSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUN2QyxjQUFjO0lBQ2QsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQixzQ0FBc0M7SUFDdEMsUUFBUTtJQUNSLGFBQWEsQ0FBQyxDQUFDLENBQTJCLE1BQU07QUFFcEQ7Ozs7R0FJRztBQUNIO0lBQUE7UUFDRSxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBQ3ZCLGVBQVUsR0FBYSxFQUFFLENBQUM7UUFDMUIsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUNyQixpQkFBWSxHQUFrQixFQUFFLENBQUM7SUE0R25DLENBQUM7SUExR0MsT0FBTyxLQUFLLENBQUMsUUFBZ0I7UUFDM0IsSUFBSSxPQUFPLEdBQWtCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsTUFBTTtZQUMxQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ3pELFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFdBQVcsQ0FB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LENBQUM7UUFDaEQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQzdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFDekMsQ0FBQztZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0FBQ0gsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNYXAsIExpc3RXcmFwcGVyLCBNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgaXNQcmVzZW50LFxuICBpc0JsYW5rLFxuICBSZWdFeHBXcmFwcGVyLFxuICBSZWdFeHBNYXRjaGVyV3JhcHBlcixcbiAgU3RyaW5nV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG5jb25zdCBfRU1QVFlfQVRUUl9WQUxVRSA9IC8qQHRzMmRhcnRfY29uc3QqLyAnJztcblxuLy8gVE9ETzogQ2FuJ3QgdXNlIGBjb25zdGAgaGVyZSBhc1xuLy8gaW4gRGFydCB0aGlzIGlzIG5vdCB0cmFuc3BpbGVkIGludG8gYGZpbmFsYCB5ZXQuLi5cbnZhciBfU0VMRUNUT1JfUkVHRVhQID0gUmVnRXhwV3JhcHBlci5jcmVhdGUoXG4gICAgJyhcXFxcOm5vdFxcXFwoKXwnICsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXCI6bm90KFwiXG4gICAgJyhbLVxcXFx3XSspfCcgKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcInRhZ1wiXG4gICAgJyg/OlxcXFwuKFstXFxcXHddKykpfCcgKyAgICAgICAgICAgICAgICAgICAgIC8vIFwiLmNsYXNzXCJcbiAgICAnKD86XFxcXFsoWy1cXFxcdypdKykoPzo9KFteXFxcXF1dKikpP1xcXFxdKXwnICsgIC8vIFwiW25hbWVdXCIsIFwiW25hbWU9dmFsdWVdXCIgb3IgXCJbbmFtZSo9dmFsdWVdXCJcbiAgICAnKFxcXFwpKXwnICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiKVwiXG4gICAgJyhcXFxccyosXFxcXHMqKScpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiLFwiXG5cbi8qKlxuICogQSBjc3Mgc2VsZWN0b3IgY29udGFpbnMgYW4gZWxlbWVudCBuYW1lLFxuICogY3NzIGNsYXNzZXMgYW5kIGF0dHJpYnV0ZS92YWx1ZSBwYWlycyB3aXRoIHRoZSBwdXJwb3NlXG4gKiBvZiBzZWxlY3Rpbmcgc3Vic2V0cyBvdXQgb2YgdGhlbS5cbiAqL1xuZXhwb3J0IGNsYXNzIENzc1NlbGVjdG9yIHtcbiAgZWxlbWVudDogc3RyaW5nID0gbnVsbDtcbiAgY2xhc3NOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgYXR0cnM6IHN0cmluZ1tdID0gW107XG4gIG5vdFNlbGVjdG9yczogQ3NzU2VsZWN0b3JbXSA9IFtdO1xuXG4gIHN0YXRpYyBwYXJzZShzZWxlY3Rvcjogc3RyaW5nKTogQ3NzU2VsZWN0b3JbXSB7XG4gICAgdmFyIHJlc3VsdHM6IENzc1NlbGVjdG9yW10gPSBbXTtcbiAgICB2YXIgX2FkZFJlc3VsdCA9IChyZXM6IENzc1NlbGVjdG9yW10sIGNzc1NlbCkgPT4ge1xuICAgICAgaWYgKGNzc1NlbC5ub3RTZWxlY3RvcnMubGVuZ3RoID4gMCAmJiBpc0JsYW5rKGNzc1NlbC5lbGVtZW50KSAmJlxuICAgICAgICAgIExpc3RXcmFwcGVyLmlzRW1wdHkoY3NzU2VsLmNsYXNzTmFtZXMpICYmIExpc3RXcmFwcGVyLmlzRW1wdHkoY3NzU2VsLmF0dHJzKSkge1xuICAgICAgICBjc3NTZWwuZWxlbWVudCA9IFwiKlwiO1xuICAgICAgfVxuICAgICAgcmVzLnB1c2goY3NzU2VsKTtcbiAgICB9O1xuICAgIHZhciBjc3NTZWxlY3RvciA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwV3JhcHBlci5tYXRjaGVyKF9TRUxFQ1RPUl9SRUdFWFAsIHNlbGVjdG9yKTtcbiAgICB2YXIgbWF0Y2g7XG4gICAgdmFyIGN1cnJlbnQgPSBjc3NTZWxlY3RvcjtcbiAgICB2YXIgaW5Ob3QgPSBmYWxzZTtcbiAgICB3aGlsZSAoaXNQcmVzZW50KG1hdGNoID0gUmVnRXhwTWF0Y2hlcldyYXBwZXIubmV4dChtYXRjaGVyKSkpIHtcbiAgICAgIGlmIChpc1ByZXNlbnQobWF0Y2hbMV0pKSB7XG4gICAgICAgIGlmIChpbk5vdCkge1xuICAgICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdOZXN0aW5nIDpub3QgaXMgbm90IGFsbG93ZWQgaW4gYSBzZWxlY3RvcicpO1xuICAgICAgICB9XG4gICAgICAgIGluTm90ID0gdHJ1ZTtcbiAgICAgICAgY3VycmVudCA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgICAgICBjc3NTZWxlY3Rvci5ub3RTZWxlY3RvcnMucHVzaChjdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1ByZXNlbnQobWF0Y2hbMl0pKSB7XG4gICAgICAgIGN1cnJlbnQuc2V0RWxlbWVudChtYXRjaFsyXSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KG1hdGNoWzNdKSkge1xuICAgICAgICBjdXJyZW50LmFkZENsYXNzTmFtZShtYXRjaFszXSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KG1hdGNoWzRdKSkge1xuICAgICAgICBjdXJyZW50LmFkZEF0dHJpYnV0ZShtYXRjaFs0XSwgbWF0Y2hbNV0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudChtYXRjaFs2XSkpIHtcbiAgICAgICAgaW5Ob3QgPSBmYWxzZTtcbiAgICAgICAgY3VycmVudCA9IGNzc1NlbGVjdG9yO1xuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudChtYXRjaFs3XSkpIHtcbiAgICAgICAgaWYgKGluTm90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ011bHRpcGxlIHNlbGVjdG9ycyBpbiA6bm90IGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgX2FkZFJlc3VsdChyZXN1bHRzLCBjc3NTZWxlY3Rvcik7XG4gICAgICAgIGNzc1NlbGVjdG9yID0gY3VycmVudCA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgICAgfVxuICAgIH1cbiAgICBfYWRkUmVzdWx0KHJlc3VsdHMsIGNzc1NlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIGlzRWxlbWVudFNlbGVjdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc1ByZXNlbnQodGhpcy5lbGVtZW50KSAmJiBMaXN0V3JhcHBlci5pc0VtcHR5KHRoaXMuY2xhc3NOYW1lcykgJiZcbiAgICAgICAgICAgTGlzdFdyYXBwZXIuaXNFbXB0eSh0aGlzLmF0dHJzKSAmJiB0aGlzLm5vdFNlbGVjdG9ycy5sZW5ndGggPT09IDA7XG4gIH1cblxuICBzZXRFbGVtZW50KGVsZW1lbnQ6IHN0cmluZyA9IG51bGwpIHsgdGhpcy5lbGVtZW50ID0gZWxlbWVudDsgfVxuXG4gIC8qKiBHZXRzIGEgdGVtcGxhdGUgc3RyaW5nIGZvciBhbiBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IuICovXG4gIGdldE1hdGNoaW5nRWxlbWVudFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgbGV0IHRhZ05hbWUgPSBpc1ByZXNlbnQodGhpcy5lbGVtZW50KSA/IHRoaXMuZWxlbWVudCA6ICdkaXYnO1xuICAgIGxldCBjbGFzc0F0dHIgPSB0aGlzLmNsYXNzTmFtZXMubGVuZ3RoID4gMCA/IGAgY2xhc3M9XCIke3RoaXMuY2xhc3NOYW1lcy5qb2luKCcgJyl9XCJgIDogJyc7XG5cbiAgICBsZXQgYXR0cnMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGxldCBhdHRyTmFtZSA9IHRoaXMuYXR0cnNbaV07XG4gICAgICBsZXQgYXR0clZhbHVlID0gdGhpcy5hdHRyc1tpICsgMV0gIT09ICcnID8gYD1cIiR7dGhpcy5hdHRyc1tpICsgMV19XCJgIDogJyc7XG4gICAgICBhdHRycyArPSBgICR7YXR0ck5hbWV9JHthdHRyVmFsdWV9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYDwke3RhZ05hbWV9JHtjbGFzc0F0dHJ9JHthdHRyc30+PC8ke3RhZ05hbWV9PmA7XG4gIH1cblxuICBhZGRBdHRyaWJ1dGUobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nID0gX0VNUFRZX0FUVFJfVkFMVUUpIHtcbiAgICB0aGlzLmF0dHJzLnB1c2gobmFtZSk7XG4gICAgaWYgKGlzUHJlc2VudCh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBfRU1QVFlfQVRUUl9WQUxVRTtcbiAgICB9XG4gICAgdGhpcy5hdHRycy5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIGFkZENsYXNzTmFtZShuYW1lOiBzdHJpbmcpIHsgdGhpcy5jbGFzc05hbWVzLnB1c2gobmFtZS50b0xvd2VyQ2FzZSgpKTsgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgdmFyIHJlcyA9ICcnO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5lbGVtZW50KSkge1xuICAgICAgcmVzICs9IHRoaXMuZWxlbWVudDtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLmNsYXNzTmFtZXMpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXMgKz0gJy4nICsgdGhpcy5jbGFzc05hbWVzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuYXR0cnMpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXR0cnMubGVuZ3RoOykge1xuICAgICAgICB2YXIgYXR0ck5hbWUgPSB0aGlzLmF0dHJzW2krK107XG4gICAgICAgIHZhciBhdHRyVmFsdWUgPSB0aGlzLmF0dHJzW2krK107XG4gICAgICAgIHJlcyArPSAnWycgKyBhdHRyTmFtZTtcbiAgICAgICAgaWYgKGF0dHJWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzICs9ICc9JyArIGF0dHJWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXMgKz0gJ10nO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm5vdFNlbGVjdG9ycy5mb3JFYWNoKG5vdFNlbGVjdG9yID0+IHJlcyArPSBgOm5vdCgke25vdFNlbGVjdG9yfSlgKTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbi8qKlxuICogUmVhZHMgYSBsaXN0IG9mIENzc1NlbGVjdG9ycyBhbmQgYWxsb3dzIHRvIGNhbGN1bGF0ZSB3aGljaCBvbmVzXG4gKiBhcmUgY29udGFpbmVkIGluIGEgZ2l2ZW4gQ3NzU2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvck1hdGNoZXIge1xuICBzdGF0aWMgY3JlYXRlTm90TWF0Y2hlcihub3RTZWxlY3RvcnM6IENzc1NlbGVjdG9yW10pOiBTZWxlY3Rvck1hdGNoZXIge1xuICAgIHZhciBub3RNYXRjaGVyID0gbmV3IFNlbGVjdG9yTWF0Y2hlcigpO1xuICAgIG5vdE1hdGNoZXIuYWRkU2VsZWN0YWJsZXMobm90U2VsZWN0b3JzLCBudWxsKTtcbiAgICByZXR1cm4gbm90TWF0Y2hlcjtcbiAgfVxuXG4gIHByaXZhdGUgX2VsZW1lbnRNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JDb250ZXh0W10+KCk7XG4gIHByaXZhdGUgX2VsZW1lbnRQYXJ0aWFsTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcj4oKTtcbiAgcHJpdmF0ZSBfY2xhc3NNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JDb250ZXh0W10+KCk7XG4gIHByaXZhdGUgX2NsYXNzUGFydGlhbE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI+KCk7XG4gIHByaXZhdGUgX2F0dHJWYWx1ZU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHRbXT4+KCk7XG4gIHByaXZhdGUgX2F0dHJWYWx1ZVBhcnRpYWxNYXAgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPj4oKTtcbiAgcHJpdmF0ZSBfbGlzdENvbnRleHRzOiBTZWxlY3Rvckxpc3RDb250ZXh0W10gPSBbXTtcblxuICBhZGRTZWxlY3RhYmxlcyhjc3NTZWxlY3RvcnM6IENzc1NlbGVjdG9yW10sIGNhbGxiYWNrQ3R4dD86IGFueSkge1xuICAgIHZhciBsaXN0Q29udGV4dCA9IG51bGw7XG4gICAgaWYgKGNzc1NlbGVjdG9ycy5sZW5ndGggPiAxKSB7XG4gICAgICBsaXN0Q29udGV4dCA9IG5ldyBTZWxlY3Rvckxpc3RDb250ZXh0KGNzc1NlbGVjdG9ycyk7XG4gICAgICB0aGlzLl9saXN0Q29udGV4dHMucHVzaChsaXN0Q29udGV4dCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3NzU2VsZWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9hZGRTZWxlY3RhYmxlKGNzc1NlbGVjdG9yc1tpXSwgY2FsbGJhY2tDdHh0LCBsaXN0Q29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBvYmplY3QgdGhhdCBjYW4gYmUgZm91bmQgbGF0ZXIgb24gYnkgY2FsbGluZyBgbWF0Y2hgLlxuICAgKiBAcGFyYW0gY3NzU2VsZWN0b3IgQSBjc3Mgc2VsZWN0b3JcbiAgICogQHBhcmFtIGNhbGxiYWNrQ3R4dCBBbiBvcGFxdWUgb2JqZWN0IHRoYXQgd2lsbCBiZSBnaXZlbiB0byB0aGUgY2FsbGJhY2sgb2YgdGhlIGBtYXRjaGAgZnVuY3Rpb25cbiAgICovXG4gIHByaXZhdGUgX2FkZFNlbGVjdGFibGUoY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBjYWxsYmFja0N0eHQ6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0Q29udGV4dDogU2VsZWN0b3JMaXN0Q29udGV4dCkge1xuICAgIHZhciBtYXRjaGVyOiBTZWxlY3Rvck1hdGNoZXIgPSB0aGlzO1xuICAgIHZhciBlbGVtZW50ID0gY3NzU2VsZWN0b3IuZWxlbWVudDtcbiAgICB2YXIgY2xhc3NOYW1lcyA9IGNzc1NlbGVjdG9yLmNsYXNzTmFtZXM7XG4gICAgdmFyIGF0dHJzID0gY3NzU2VsZWN0b3IuYXR0cnM7XG4gICAgdmFyIHNlbGVjdGFibGUgPSBuZXcgU2VsZWN0b3JDb250ZXh0KGNzc1NlbGVjdG9yLCBjYWxsYmFja0N0eHQsIGxpc3RDb250ZXh0KTtcblxuICAgIGlmIChpc1ByZXNlbnQoZWxlbWVudCkpIHtcbiAgICAgIHZhciBpc1Rlcm1pbmFsID0gYXR0cnMubGVuZ3RoID09PSAwICYmIGNsYXNzTmFtZXMubGVuZ3RoID09PSAwO1xuICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgdGhpcy5fYWRkVGVybWluYWwobWF0Y2hlci5fZWxlbWVudE1hcCwgZWxlbWVudCwgc2VsZWN0YWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaGVyID0gdGhpcy5fYWRkUGFydGlhbChtYXRjaGVyLl9lbGVtZW50UGFydGlhbE1hcCwgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzUHJlc2VudChjbGFzc05hbWVzKSkge1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBpc1Rlcm1pbmFsID0gYXR0cnMubGVuZ3RoID09PSAwICYmIGluZGV4ID09PSBjbGFzc05hbWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzW2luZGV4XTtcbiAgICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgICB0aGlzLl9hZGRUZXJtaW5hbChtYXRjaGVyLl9jbGFzc01hcCwgY2xhc3NOYW1lLCBzZWxlY3RhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGVyID0gdGhpcy5fYWRkUGFydGlhbChtYXRjaGVyLl9jbGFzc1BhcnRpYWxNYXAsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNQcmVzZW50KGF0dHJzKSkge1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJzLmxlbmd0aDspIHtcbiAgICAgICAgdmFyIGlzVGVybWluYWwgPSBpbmRleCA9PT0gYXR0cnMubGVuZ3RoIC0gMjtcbiAgICAgICAgdmFyIGF0dHJOYW1lID0gYXR0cnNbaW5kZXgrK107XG4gICAgICAgIHZhciBhdHRyVmFsdWUgPSBhdHRyc1tpbmRleCsrXTtcbiAgICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgICB2YXIgdGVybWluYWxNYXAgPSBtYXRjaGVyLl9hdHRyVmFsdWVNYXA7XG4gICAgICAgICAgdmFyIHRlcm1pbmFsVmFsdWVzTWFwID0gdGVybWluYWxNYXAuZ2V0KGF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNCbGFuayh0ZXJtaW5hbFZhbHVlc01hcCkpIHtcbiAgICAgICAgICAgIHRlcm1pbmFsVmFsdWVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dFtdPigpO1xuICAgICAgICAgICAgdGVybWluYWxNYXAuc2V0KGF0dHJOYW1lLCB0ZXJtaW5hbFZhbHVlc01hcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2FkZFRlcm1pbmFsKHRlcm1pbmFsVmFsdWVzTWFwLCBhdHRyVmFsdWUsIHNlbGVjdGFibGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBwYXJ0dGlhbE1hcCA9IG1hdGNoZXIuX2F0dHJWYWx1ZVBhcnRpYWxNYXA7XG4gICAgICAgICAgdmFyIHBhcnRpYWxWYWx1ZXNNYXAgPSBwYXJ0dGlhbE1hcC5nZXQoYXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc0JsYW5rKHBhcnRpYWxWYWx1ZXNNYXApKSB7XG4gICAgICAgICAgICBwYXJ0aWFsVmFsdWVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcj4oKTtcbiAgICAgICAgICAgIHBhcnR0aWFsTWFwLnNldChhdHRyTmFtZSwgcGFydGlhbFZhbHVlc01hcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hdGNoZXIgPSB0aGlzLl9hZGRQYXJ0aWFsKHBhcnRpYWxWYWx1ZXNNYXAsIGF0dHJWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZGRUZXJtaW5hbChtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dFtdPiwgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RhYmxlOiBTZWxlY3RvckNvbnRleHQpIHtcbiAgICB2YXIgdGVybWluYWxMaXN0ID0gbWFwLmdldChuYW1lKTtcbiAgICBpZiAoaXNCbGFuayh0ZXJtaW5hbExpc3QpKSB7XG4gICAgICB0ZXJtaW5hbExpc3QgPSBbXTtcbiAgICAgIG1hcC5zZXQobmFtZSwgdGVybWluYWxMaXN0KTtcbiAgICB9XG4gICAgdGVybWluYWxMaXN0LnB1c2goc2VsZWN0YWJsZSk7XG4gIH1cblxuICBwcml2YXRlIF9hZGRQYXJ0aWFsKG1hcDogTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPiwgbmFtZTogc3RyaW5nKTogU2VsZWN0b3JNYXRjaGVyIHtcbiAgICB2YXIgbWF0Y2hlciA9IG1hcC5nZXQobmFtZSk7XG4gICAgaWYgKGlzQmxhbmsobWF0Y2hlcikpIHtcbiAgICAgIG1hdGNoZXIgPSBuZXcgU2VsZWN0b3JNYXRjaGVyKCk7XG4gICAgICBtYXAuc2V0KG5hbWUsIG1hdGNoZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBvYmplY3RzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHZpYSBgYWRkU2VsZWN0YWJsZWBcbiAgICogd2hvc2UgY3NzIHNlbGVjdG9yIGlzIGNvbnRhaW5lZCBpbiB0aGUgZ2l2ZW4gY3NzIHNlbGVjdG9yLlxuICAgKiBAcGFyYW0gY3NzU2VsZWN0b3IgQSBjc3Mgc2VsZWN0b3JcbiAgICogQHBhcmFtIG1hdGNoZWRDYWxsYmFjayBUaGlzIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIG9iamVjdCBoYW5kZWQgaW50byBgYWRkU2VsZWN0YWJsZWBcbiAgICogQHJldHVybiBib29sZWFuIHRydWUgaWYgYSBtYXRjaCB3YXMgZm91bmRcbiAgKi9cbiAgbWF0Y2goY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2s6IChjOiBDc3NTZWxlY3RvciwgYTogYW55KSA9PiB2b2lkKTogYm9vbGVhbiB7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIHZhciBlbGVtZW50ID0gY3NzU2VsZWN0b3IuZWxlbWVudDtcbiAgICB2YXIgY2xhc3NOYW1lcyA9IGNzc1NlbGVjdG9yLmNsYXNzTmFtZXM7XG4gICAgdmFyIGF0dHJzID0gY3NzU2VsZWN0b3IuYXR0cnM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2xpc3RDb250ZXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fbGlzdENvbnRleHRzW2ldLmFscmVhZHlNYXRjaGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hUZXJtaW5hbCh0aGlzLl9lbGVtZW50TWFwLCBlbGVtZW50LCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hQYXJ0aWFsKHRoaXMuX2VsZW1lbnRQYXJ0aWFsTWFwLCBlbGVtZW50LCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fFxuICAgICAgICAgICAgIHJlc3VsdDtcblxuICAgIGlmIChpc1ByZXNlbnQoY2xhc3NOYW1lcykpIHtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBjbGFzc05hbWVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lc1tpbmRleF07XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICB0aGlzLl9tYXRjaFRlcm1pbmFsKHRoaXMuX2NsYXNzTWFwLCBjbGFzc05hbWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIHRoaXMuX21hdGNoUGFydGlhbCh0aGlzLl9jbGFzc1BhcnRpYWxNYXAsIGNsYXNzTmFtZSwgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHxcbiAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNQcmVzZW50KGF0dHJzKSkge1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJzLmxlbmd0aDspIHtcbiAgICAgICAgdmFyIGF0dHJOYW1lID0gYXR0cnNbaW5kZXgrK107XG4gICAgICAgIHZhciBhdHRyVmFsdWUgPSBhdHRyc1tpbmRleCsrXTtcblxuICAgICAgICB2YXIgdGVybWluYWxWYWx1ZXNNYXAgPSB0aGlzLl9hdHRyVmFsdWVNYXAuZ2V0KGF0dHJOYW1lKTtcbiAgICAgICAgaWYgKCFTdHJpbmdXcmFwcGVyLmVxdWFscyhhdHRyVmFsdWUsIF9FTVBUWV9BVFRSX1ZBTFVFKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRoaXMuX21hdGNoVGVybWluYWwodGVybWluYWxWYWx1ZXNNYXAsIF9FTVBUWV9BVFRSX1ZBTFVFLCBjc3NTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRDYWxsYmFjaykgfHxcbiAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hUZXJtaW5hbCh0ZXJtaW5hbFZhbHVlc01hcCwgYXR0clZhbHVlLCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fFxuICAgICAgICAgICAgICAgICByZXN1bHQ7XG5cbiAgICAgICAgdmFyIHBhcnRpYWxWYWx1ZXNNYXAgPSB0aGlzLl9hdHRyVmFsdWVQYXJ0aWFsTWFwLmdldChhdHRyTmFtZSk7XG4gICAgICAgIGlmICghU3RyaW5nV3JhcHBlci5lcXVhbHMoYXR0clZhbHVlLCBfRU1QVFlfQVRUUl9WQUxVRSkpIHtcbiAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXRjaFBhcnRpYWwocGFydGlhbFZhbHVlc01hcCwgX0VNUFRZX0FUVFJfVkFMVUUsIGNzc1NlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkQ2FsbGJhY2spIHx8XG4gICAgICAgICAgICAgICAgICAgcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICB0aGlzLl9tYXRjaFBhcnRpYWwocGFydGlhbFZhbHVlc01hcCwgYXR0clZhbHVlLCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9tYXRjaFRlcm1pbmFsKG1hcDogTWFwPHN0cmluZywgU2VsZWN0b3JDb250ZXh0W10+LCBuYW1lLCBjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgIG1hdGNoZWRDYWxsYmFjazogKGM6IENzc1NlbGVjdG9yLCBhOiBhbnkpID0+IHZvaWQpOiBib29sZWFuIHtcbiAgICBpZiAoaXNCbGFuayhtYXApIHx8IGlzQmxhbmsobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0YWJsZXMgPSBtYXAuZ2V0KG5hbWUpO1xuICAgIHZhciBzdGFyU2VsZWN0YWJsZXMgPSBtYXAuZ2V0KFwiKlwiKTtcbiAgICBpZiAoaXNQcmVzZW50KHN0YXJTZWxlY3RhYmxlcykpIHtcbiAgICAgIHNlbGVjdGFibGVzID0gc2VsZWN0YWJsZXMuY29uY2F0KHN0YXJTZWxlY3RhYmxlcyk7XG4gICAgfVxuICAgIGlmIChpc0JsYW5rKHNlbGVjdGFibGVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0YWJsZTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHNlbGVjdGFibGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgc2VsZWN0YWJsZSA9IHNlbGVjdGFibGVzW2luZGV4XTtcbiAgICAgIHJlc3VsdCA9IHNlbGVjdGFibGUuZmluYWxpemUoY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHwgcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbWF0Y2hQYXJ0aWFsKG1hcDogTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPiwgbmFtZSwgY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLFxuICAgICAgICAgICAgICAgIG1hdGNoZWRDYWxsYmFjayAvKjogKGM6IENzc1NlbGVjdG9yLCBhOiBhbnkpID0+IHZvaWQqLyk6IGJvb2xlYW4ge1xuICAgIGlmIChpc0JsYW5rKG1hcCkgfHwgaXNCbGFuayhuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbmVzdGVkU2VsZWN0b3IgPSBtYXAuZ2V0KG5hbWUpO1xuICAgIGlmIChpc0JsYW5rKG5lc3RlZFNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBUT0RPKHBlcmYpOiBnZXQgcmlkIG9mIHJlY3Vyc2lvbiBhbmQgbWVhc3VyZSBhZ2FpblxuICAgIC8vIFRPRE8ocGVyZik6IGRvbid0IHBhc3MgdGhlIHdob2xlIHNlbGVjdG9yIGludG8gdGhlIHJlY3Vyc2lvbixcbiAgICAvLyBidXQgb25seSB0aGUgbm90IHByb2Nlc3NlZCBwYXJ0c1xuICAgIHJldHVybiBuZXN0ZWRTZWxlY3Rvci5tYXRjaChjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvckxpc3RDb250ZXh0IHtcbiAgYWxyZWFkeU1hdGNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZWN0b3JzOiBDc3NTZWxlY3RvcltdKSB7fVxufVxuXG4vLyBTdG9yZSBjb250ZXh0IHRvIHBhc3MgYmFjayBzZWxlY3RvciBhbmQgY29udGV4dCB3aGVuIGEgc2VsZWN0b3IgaXMgbWF0Y2hlZFxuZXhwb3J0IGNsYXNzIFNlbGVjdG9yQ29udGV4dCB7XG4gIG5vdFNlbGVjdG9yczogQ3NzU2VsZWN0b3JbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZWN0b3I6IENzc1NlbGVjdG9yLCBwdWJsaWMgY2JDb250ZXh0OiBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyBsaXN0Q29udGV4dDogU2VsZWN0b3JMaXN0Q29udGV4dCkge1xuICAgIHRoaXMubm90U2VsZWN0b3JzID0gc2VsZWN0b3Iubm90U2VsZWN0b3JzO1xuICB9XG5cbiAgZmluYWxpemUoY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBjYWxsYmFjazogKGM6IENzc1NlbGVjdG9yLCBhOiBhbnkpID0+IHZvaWQpOiBib29sZWFuIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5ub3RTZWxlY3RvcnMubGVuZ3RoID4gMCAmJlxuICAgICAgICAoaXNCbGFuayh0aGlzLmxpc3RDb250ZXh0KSB8fCAhdGhpcy5saXN0Q29udGV4dC5hbHJlYWR5TWF0Y2hlZCkpIHtcbiAgICAgIHZhciBub3RNYXRjaGVyID0gU2VsZWN0b3JNYXRjaGVyLmNyZWF0ZU5vdE1hdGNoZXIodGhpcy5ub3RTZWxlY3RvcnMpO1xuICAgICAgcmVzdWx0ID0gIW5vdE1hdGNoZXIubWF0Y2goY3NzU2VsZWN0b3IsIG51bGwpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ICYmIGlzUHJlc2VudChjYWxsYmFjaykgJiZcbiAgICAgICAgKGlzQmxhbmsodGhpcy5saXN0Q29udGV4dCkgfHwgIXRoaXMubGlzdENvbnRleHQuYWxyZWFkeU1hdGNoZWQpKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KHRoaXMubGlzdENvbnRleHQpKSB7XG4gICAgICAgIHRoaXMubGlzdENvbnRleHQuYWxyZWFkeU1hdGNoZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2sodGhpcy5zZWxlY3RvciwgdGhpcy5jYkNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=