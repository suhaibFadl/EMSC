import { MatPaginatorIntl } from '@angular/material/paginator';

const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 العدد الكلي ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} العدد الكلي ${length}`;
}


export function getDutchPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'عدد الصفحات';
  paginatorIntl.nextPageLabel = 'التالي';
  paginatorIntl.previousPageLabel = 'السابق';
  paginatorIntl.getRangeLabel = dutchRangeLabel;  
  return paginatorIntl;
}
