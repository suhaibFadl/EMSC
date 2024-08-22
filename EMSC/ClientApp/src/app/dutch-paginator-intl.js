"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDutchPaginatorIntl = void 0;
var paginator_1 = require("@angular/material/paginator");
var dutchRangeLabel = function (page, pageSize, length) {
    if (length == 0 || pageSize == 0) {
        return "0 \u0627\u0644\u0639\u062F\u062F \u0627\u0644\u0643\u0644\u064A " + length;
    }
    length = Math.max(length, 0);
    var startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    var endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return startIndex + 1 + " - " + endIndex + " \u0627\u0644\u0639\u062F\u062F \u0627\u0644\u0643\u0644\u064A " + length;
};
function getDutchPaginatorIntl() {
    var paginatorIntl = new paginator_1.MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = 'عدد الصفحات';
    paginatorIntl.nextPageLabel = 'التالي';
    paginatorIntl.previousPageLabel = 'السابق';
    paginatorIntl.getRangeLabel = dutchRangeLabel;
    return paginatorIntl;
}
exports.getDutchPaginatorIntl = getDutchPaginatorIntl;
//# sourceMappingURL=dutch-paginator-intl.js.map