# DataTable API

API defines helper props, events and others for the PrimeReact DataTable module.

## DataTable

DataTable displays data in tabular format.

### Props

Defines valid properties in DataTable component. In addition to these, all properties of HTMLDivElement can be used in this component.

| name                      | type                                                         | default                                                      | description                                                  |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| alwaysShowPaginator       | boolean                                                      | true                                                         | Whether to show it even there is only one page.              |
| breakpoint                | string                                                       | 960px                                                        | The breakpoint to define the maximum width boundary when using stack responsive layout. |
| cellMemo                  | boolean                                                      | true                                                         | Whether to enable cell memoization. When the memoization is enabled, be sure to: 1- Update the value prop (i.e., row data) to trigger a re-render of the cells of a given row. 2- Where necessary, use the spread operator (...) when updating the value prop objs which creates new fresh objects and avoids mutating the same objects. When the memoization is disabled, a re-render of the datatable will trigger a re-render of all cells, which can lead to performance issues with large datasets and is therefore not recommended. |
| cellMemoProps             | string[]                                                     | ['rowData', 'field', 'allowCellSelection', 'isCellSelected', 'editMode', 'index', 'tabIndex', 'editing', 'expanded', 'editingMeta', 'frozenCol', 'alignFrozenCol'] | The cell props to be checked at memoization. Possible cell props are: 'hostName', 'allowCellSelection', 'cellMemo', 'cellMemoProps', 'cellMemoPropsDepth', 'cellClassName', 'checkIcon', 'collapsedRowIcon', 'field', 'resolveFieldData', 'column', 'cProps', 'dataKey', 'editMode', 'editing', 'editingMeta', 'onEditingMetaChange', 'editingKey', 'getEditingRowData', 'expanded', 'expandedRowIcon', 'frozenRow', 'frozenCol', 'alignFrozenCol', 'index', 'isSelectable', 'onCheckboxChange', 'onClick', 'onMouseDown', 'onMouseUp', 'onRadioChange', 'onRowEditCancel', 'onRowEditInit', 'onRowEditSave', 'onRowToggle', 'responsiveLayout', 'rowData', 'rowEditorCancelIcon', 'rowEditorInitIcon', 'rowEditorSaveIcon', 'rowIndex', 'rowSpan', 'selectOnEdit', 'isRowSelected', 'isCellSelected', 'selectionAriaLabel', 'showRowReorderElement', 'showSelectionElement', 'tabIndex', 'getTabIndex', 'tableProps', 'tableSelector', 'value', 'getVirtualScrollerOption', 'ptCallbacks', 'metaData', 'unstyled', 'findNextSelectableCell', 'findPrevSelectableCell', 'findDownSelectableCell', 'findUpSelectableCell', 'focusOnElement', 'focusOnInit', 'updateStickyPosition' IMPORTANT: Including a function to be checked will in general disable the memoization in practice, since functions are compared by reference. |
| cellMemoPropsDepth        | number                                                       | 1                                                            | The comparison depth when checking cell props (e.g., rowData) at memoization. |
| cellSelection             | true                                                         | false                                                        | Whether to cell selection is enabled or not.                 |
| checkIcon                 | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Icon to display in the checkbox.                             |
| children                  | ReactNode                                                    | null                                                         | Used to get the child elements of the component.             |
| className                 | string                                                       | null                                                         | Style class of the component.                                |
| collapsedRowIcon          | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Icon of the row toggler to display the row as collapsed.     |
| columnResizeMode          | "expand" \| "fit"                                            | fit                                                          | Used to define the resize mode of the columns, valid values are "fit" and "expand". |
| compareSelectionBy        | "equals" \| "deepEquals"                                     | deepEquals                                                   | Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields. |
| contextMenuSelection      | object                                                       | null                                                         | Selected row in single mode or an array of values in multiple mode. |
| csvSeparator              | string                                                       | ,                                                            | Character to use as the csv separator.                       |
| currentPageReportTemplate | string                                                       | ({currentPage} of {totalPages})                              | Template of the current page report element. Available placeholders are {currentPage}, {totalPages}, {rows}, {first}, {last} and {totalRecords} |
| dataKey                   | string \| Function                                           | ({currentPage} of {totalPages})                              | Name of the field that uniquely identifies a record in the data. Should be a unique business key to prevent re-rendering. |
| defaultSortOrder          | null \| 0 \| 1 \| -1                                         | ({currentPage} of {totalPages})                              | Default sort order of an unsorted column.                    |
| dragSelection             | boolean                                                      | false                                                        | When enabled, a rectangle that can be dragged can be used to make a range selection. |
| editingRows               | [DataTableValueArray ](https://primereact.org/datatable/#api.DataTable.DataTableValueArray)\|[ DataTableEditingRows](https://primereact.org/datatable/#api.DataTable.DataTableEditingRows) | null                                                         | A collection of rows to represent the current editing data in row edit mode. |
| editMode                  | string                                                       | null                                                         | Defines editing mode, options are "cell" and "row".          |
| emptyMessage              | ReactNode \| Function                                        | No results found                                             | Text to display when there is no data.                       |
| expandableRowGroups       | boolean                                                      | false                                                        | Makes row groups toggleable, default is false.               |
| expandedRowIcon           | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Icon of the row toggler to display the row as expanded.      |
| expandedRows              | [DataTableValueArray ](https://primereact.org/datatable/#api.DataTable.DataTableValueArray)\|[ DataTableExpandedRows](https://primereact.org/datatable/#api.DataTable.DataTableExpandedRows) | null                                                         | A collection of rows or a map object row data keys that are expanded. |
| exportFilename            | string                                                       | download                                                     | Name of the exported file.                                   |
| filterClearIcon           | [IconType>](https://primereact.org/datatable/#api.DataTable) | null                                                         | Icon to display when the filter can be cleared.              |
| filterDelay               | number                                                       | 300                                                          | Delay in milliseconds before filtering the data.             |
| filterDisplay             | "menu" \| "row"                                              | menu                                                         | Layout of the filter elements, valid values are "row" and "menu". |
| filterIcon                | [IconType>](https://primereact.org/datatable/#api.DataTable) | null                                                         | Icon to display the current filtering status.                |
| filterLocale              | string                                                       | undefined                                                    | Locale to use in filtering. The default locale is the host environment's current locale. |
| filters                   | [DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | null                                                         | An array of FilterMetadata objects to provide external filters. |
| first                     | number                                                       | 0                                                            | Index of the first row to be displayed.                      |
| footer                    | [DataTableFooterTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableFooterTemplateType) | null                                                         | Custom footer content of the table.                          |
| footerColumnGroup         | ReactNode                                                    | null                                                         | ColumnGroup component for footer.                            |
| frozenRow                 | boolean                                                      | false                                                        | Whether the row is frozen or not. Read-Only necessary for unstyled TypeScript definition. |
| frozenValue               | [DataTableRowDataArray](https://primereact.org/datatable/#api.DataTable.DataTableRowDataArray) | null                                                         | Items of the frozen part in scrollable DataTable.            |
| frozenWidth               | string                                                       | null                                                         | Width of the frozen part in scrollable DataTable.            |
| globalFilter              | null \| string                                               | null                                                         | Value of the global filter to use in filtering.              |
| globalFilterFields        | string[]                                                     | null                                                         | Define fields to be filtered globally.                       |
| globalFilterMatchMode     | "endsWith" \| "startsWith" \| "custom" \| "contains" \| "in" \| "equals" \| "notEquals" \| "notIn" \| "lt" \| "lte" \| "gt" \| "gte" | contains                                                     | Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notIn", "lt", "lte", "gt", "gte" and "custom". |
| groupRowsBy               | string                                                       | null                                                         | Used for either be grouped by a separate grouping row or using rowspan. |
| header                    | [DataTableHeaderTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableHeaderTemplateType) | null                                                         | Custom header content of the table.                          |
| headerColumnGroup         | ReactNode                                                    | null                                                         | ColumnGroup component for header.                            |
| id                        | string                                                       | null                                                         | Unique identifier of the element.                            |
| lazy                      | boolean                                                      | false                                                        | Defines if data is loaded and interacted with in lazy manner. |
| loading                   | boolean                                                      | false                                                        | Displays a loader to indicate data load is in progress.      |
| loadingIcon               | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | The icon to show while indicating data load is in progress.  |
| metaKeySelection          | boolean                                                      | true                                                         | Defines whether metaKey is requred or not for the selection. When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| multiSortMeta             | null \|[ DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | null                                                         | An array of SortMeta objects to sort the data by default in multiple sort mode. |
| pageLinkSize              | number                                                       | 5                                                            | Number of page links to display.                             |
| paginator                 | boolean                                                      | false                                                        | When specified as true, enables the pagination.              |
| paginatorClassName        | string                                                       | null                                                         | Style class of the paginator element.                        |
| paginatorDropdownAppendTo | null \| HTMLElement \| "self" \| Function                    | document.body                                                | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element and 'self'. The self value is used to render a component where it is located. |
| paginatorLeft             | ReactNode                                                    | null                                                         | Content for the left side of the paginator.                  |
| paginatorPosition         | "both" \| "top" \| "bottom"                                  | bottom                                                       | Position of the paginator, options are "top","bottom" or "both". |
| paginatorRight            | ReactNode                                                    | null                                                         | Content for the right side of the paginator.                 |
| paginatorTemplate         | PaginatorTemplate                                            | FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown | Template of the paginator. For details, refer to the template section of the paginator documentation for further options. |
| pt                        | [DataTablePassThroughOptions](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughOptions) | null                                                         | Uses to pass attributes to DOM elements inside the component. |
| ptOptions                 | PassThroughOptions                                           | null                                                         | Used to configure passthrough(pt) options of the component.  |
| removableSort             | boolean                                                      | false                                                        | When enabled, columns can have an un-sorted state.           |
| reorderableColumns        | boolean                                                      | false                                                        | When enabled, columns can be reordered using drag and drop.  |
| reorderableRows           | boolean                                                      | false                                                        | When enabled, rows can be reordered using drag and drop.     |
| reorderIndicatorDownIcon  | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Defines the reorder indicator down icon.                     |
| reorderIndicatorUpIcon    | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Defines the reorder indicator up icon.                       |
| resizableColumns          | boolean                                                      | false                                                        | When enabled, columns can be resized using drag and drop.    |
| responsiveLayout          | "scroll" \| "stack"                                          | scroll                                                       | Defines the responsive mode, valid options are "stack" and "scroll". |
| rowEditorCancelIcon       | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Icon to display in the row editor cancel button.             |
| rowEditorInitIcon         | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Icon to display in the row editor init button.               |
| rowEditorSaveIcon         | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | null                                                         | Icon to display in the row editor save button.               |
| rowGroupFooterTemplate    | [DataTableRowGroupFooterTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableRowGroupFooterTemplateType) | null                                                         | Function to provide the content of row group footer.         |
| rowGroupHeaderTemplate    | [DataTableRowGroupHeaderTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableRowGroupHeaderTemplateType) | null                                                         | Function to provide the content of row group header.         |
| rowGroupMode              | string                                                       | null                                                         | Defines the row grouping mode, valid values are "subheader" and "rowgroup". |
| rowHover                  | boolean                                                      | null                                                         | When enabled, background of the rows change on hover.        |
| rows                      | number                                                       | null                                                         | Number of rows to display per page.                          |
| rowsPerPageOptions        | number[]                                                     | null                                                         | Array of integer values to display inside rows per page dropdown. |
| scrollable                | boolean                                                      | false                                                        | When specified, enables horizontal and/or vertical scrolling. |
| scrollHeight              | string                                                       | null                                                         | Height of the scroll viewport.                               |
| selectAll                 | boolean                                                      | false                                                        | When specified, selects all rows on page.                    |
| selection                 | null \|[ DataTableCellSelection[\]](https://primereact.org/datatable/#api.DataTable.DataTableCellSelection) | null                                                         | Selected cells.                                              |
| selectionAriaLabel        | string                                                       | null                                                         | A field property from the row to add Select {field} and Unselect {field} ARIA labels to checkbox/radio buttons. |
| selectionAutoFocus        | boolean                                                      | true                                                         | When a selectable row is clicked on RadioButton and Checkbox selection, it automatically decides whether to focus on elements such as checkbox or radio. |
| selectionMode             | "multiple"                                                   | null                                                         | Specifies the selection mode, valid values are "single", "multiple", "radiobutton" and "checkbox". |
| selectionPageOnly         | boolean                                                      | false                                                        | When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page. |
| selectOnEdit              | boolean                                                      | true                                                         | Determines whether the cell editor will be opened when clicking to select any row on Selection and Cell Edit modes. |
| showGridlines             | boolean                                                      | false                                                        | Whether to show grid lines between cells.                    |
| showHeaders               | boolean                                                      | true                                                         | Whether to show headers.                                     |
| showSelectAll             | boolean                                                      | null                                                         | Whether to show the select all checkbox inside the datatable's header. |
| size                      | "small" \| "normal" \| "large"                               | normal                                                       | Define to set alternative sizes. Valid values: "small", "normal" and "large". |
| sortField                 | string                                                       | null                                                         | Property of a row data used for sorting, defaults to field.  |
| sortIcon                  | [IconType, Object>](https://primereact.org/datatable/#api.DataTable) | null                                                         | Icon to display the current sorting status.                  |
| sortMode                  | "multiple" \| "single"                                       | single                                                       | Defines whether sorting works on single column or on multiple columns. |
| sortOrder                 | SortOrder                                                    | null                                                         | Order to sort the data by default.                           |
| stateKey                  | string                                                       | null                                                         | Unique identifier of a stateful table to use in state storage. |
| stateStorage              | "custom" \| "local" \| "session"                             | session                                                      | Defines where a stateful table keeps its state, valid values are "session" for sessionStorage, "local" for localStorage and "custom". |
| stripedRows               | boolean                                                      | false                                                        | Whether to displays rows with alternating colors.            |
| style                     | CSSProperties                                                | null                                                         | Inline style of the component.                               |
| tabIndex                  | number                                                       | null                                                         | Index of the element in tabbing order.                       |
| tableClassName            | string                                                       | null                                                         | Style class of the table element.                            |
| tableStyle                | CSSProperties                                                | null                                                         | Inline style of the table element.                           |
| totalRecords              | number                                                       | null                                                         | Number of total records, defaults to length of value when not defined. |
| unstyled                  | boolean                                                      | false                                                        | When enabled, it removes component related styles in the core. |
| value                     | TValue                                                       | null                                                         | An array of objects to display.                              |
| virtualScrollerOptions    | VirtualScrollerProps                                         | null                                                         | Whether to use the virtualScroller feature. The properties of VirtualScroller component can be used like an object in it. Note: Currently only vertical orientation mode is supported. |

### Callbacks

Defines callbacks that determine the behavior of the component based on a given condition or report the actions that the component takes.

| name                         | parameters                                                   | returnType                    | description                                                  |
| :--------------------------- | :----------------------------------------------------------- | :---------------------------- | :----------------------------------------------------------- |
| cellClassName                | value: any options: [DataTableCellClassNameOptions](https://primereact.org/datatable/#api.DataTable.DataTableCellClassNameOptions) | undefined \| string \| object | Function that takes the cell data and returns an object in {'styleclass' : condition} format to define a classname for a particular now. |
| customRestoreState           |                                                              | undefined \| object           | A function to implement custom restoreState with stateStorage="custom". Need to return state object. |
| customSaveState              | state: object                                                | void                          | A function to implement custom saveState with stateStorage="custom". |
| exportFunction               | event: [DataTableExportFunctionEvent](https://primereact.org/datatable/#api.DataTable.DataTableExportFunctionEvent) | any                           | A function to implement custom export. Need to return string value. |
| isDataSelectable             | event: [DataTableDataSelectableEvent](https://primereact.org/datatable/#api.DataTable.DataTableDataSelectableEvent) | null \| boolean               | Function that returns a boolean to decide whether the data should be selectable. |
| onAllRowsSelect              | event: [DataTableSelectEvent](https://primereact.org/datatable/#api.DataTable.DataTableSelectEvent) | void                          | Callback to invoke when all rows are selected using the header checkbox. |
| onAllRowsUnselect            | event: [DataTableUnselectEvent](https://primereact.org/datatable/#api.DataTable.DataTableUnselectEvent) | void                          | Callback to invoke when all rows are unselected using the header checkbox. |
| onCellClick                  | event: [DataTableCellClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableCellClickEvent) | void                          | Callback to invoke on cell click.                            |
| onCellSelect                 | event: [DataTableCellClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableCellClickEvent) | void                          | Callback to invoke on cell select.                           |
| onCellUnselect               | event: [DataTableCellClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableCellClickEvent) | void                          | Callback to invoke on cell unselect.                         |
| onColReorder                 | event: [DataTableColReorderEvent](https://primereact.org/datatable/#api.DataTable.DataTableColReorderEvent) | void                          | Callback to invoke when a column is reordered.               |
| onColumnResizeEnd            | event: [DataTableColumnResizeEndEvent](https://primereact.org/datatable/#api.DataTable.DataTableColumnResizeEndEvent) | void                          | Callback to invoke when a column is resized.                 |
| onColumnResizerClick         | event: [DataTableColumnResizerClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableColumnResizerClickEvent) | void                          | Callback to invoke when a resizer element is clicked.        |
| onColumnResizerDoubleClick   | event: [DataTableColumnResizerClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableColumnResizerClickEvent) | void                          | Callback to invoke when a resizer element is double clicked. |
| onContextMenu                | event: [DataTableRowEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEvent) | void                          | Callback to invoke when a context menu is clicked.           |
| onContextMenuSelectionChange | event: [DataTableContextMenuMultipleSelectionChangeEvent](https://primereact.org/datatable/#api.DataTable.DataTableContextMenuMultipleSelectionChangeEvent) | void                          | Callback to invoke when a row selected with right click.     |
| onFilter                     | event: [DataTableStateEvent](https://primereact.org/datatable/#api.DataTable.DataTableStateEvent) | void                          | Callback to invoke on filtering.                             |
| onPage                       | event: [DataTableStateEvent](https://primereact.org/datatable/#api.DataTable.DataTableStateEvent) | void                          | Callback to invoke on pagination.                            |
| onRowClick                   | event: [DataTableRowClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowClickEvent) | void                          | Callback to invoke when a row is clicked.                    |
| onRowCollapse                | event: [DataTableRowEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEvent) | void                          | Callback to invoke when a row is collapsed.                  |
| onRowDoubleClick             | event: [DataTableRowClickEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowClickEvent) | void                          | Callback to invoke when a row is double clicked.             |
| onRowEditCancel              | event: [DataTableRowEditEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEditEvent) | void                          | Callback to invoke when the cancel icon is clicked on row editing mode. |
| onRowEditChange              | event: [DataTableRowEditEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEditEvent) | void                          | Callback to invoke when the editing icon is clicked on row editing mode. Use in conjuction with editingRows value from the Datatable to programmatically control editing rows. |
| onRowEditComplete            | event: [DataTableRowEditCompleteEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEditCompleteEvent) | void                          | Callback to invoke when row edit is completed.               |
| onRowEditInit                | event: [DataTableRowEditEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEditEvent) | void                          | Callback to invoke when the editing icon is clicked on row editing mode. |
| onRowEditSave                | event: [DataTableRowEditSaveEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEditSaveEvent) | void                          | Callback to invoke when the save icon is clicked on row editing mode. |
| onRowExpand                  | event: [DataTableRowEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowEvent) | void                          | Callback to invoke when a row is expanded.                   |
| onRowMouseEnter              | event: [DataTableRowMouseEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowMouseEvent) | void                          | Callback to invoke when a row is hovered with mouse.         |
| onRowMouseLeave              | event: [DataTableRowMouseEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowMouseEvent) | void                          | Callback to invoke when a row is navigated away from with mouse. |
| onRowPointerDown             | event: [DataTableRowPointerEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowPointerEvent) | void                          | Callback to invoke when a row pointerDown event occurs.      |
| onRowPointerUp               | event: [DataTableRowPointerEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowPointerEvent) | void                          | Callback to invoke when a row pointerUp event occurs.        |
| onRowReorder                 | event: [DataTableRowReorderEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowReorderEvent) | void                          | Callback to update the new order.                            |
| onRowSelect                  | event: [DataTableSelectEvent](https://primereact.org/datatable/#api.DataTable.DataTableSelectEvent) | void                          | Callback to invoke when a row is selected.                   |
| onRowToggle                  | event: [DataTableRowToggleEvent](https://primereact.org/datatable/#api.DataTable.DataTableRowToggleEvent) | void                          | Callback to invoke when a row is toggled or collapsed.       |
| onRowUnselect                | event: [DataTableUnselectEvent](https://primereact.org/datatable/#api.DataTable.DataTableUnselectEvent) | void                          | Callback to invoke when a row is unselected.                 |
| onSelectAllChange            | event: [DataTableSelectAllChangeEvent](https://primereact.org/datatable/#api.DataTable.DataTableSelectAllChangeEvent) | void                          | Callback to invoke when select all value changes.            |
| onSelectionChange            | event: [DataTableSelectionCellMultipleChangeEvent](https://primereact.org/datatable/#api.DataTable.DataTableSelectionCellMultipleChangeEvent) | void                          | Callback to invoke when selection changes.                   |
| onSort                       | event: [DataTableStateEvent](https://primereact.org/datatable/#api.DataTable.DataTableStateEvent) | void                          | Callback to invoke on sort.                                  |
| onStateRestore               | state: object                                                | void                          | Callback to invoke table state is restored.                  |
| onStateSave                  | state: object                                                | void                          | Callback to invoke table state is saved.                     |
| onValueChange                | value: [DataTableRowDataArray](https://primereact.org/datatable/#api.DataTable.DataTableRowDataArray) | void                          | Callback to invoke after filtering and sorting to pass the rendered value. |
| rowClassName                 | data: [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) options: [DataTableRowClassNameOptions](https://primereact.org/datatable/#api.DataTable.DataTableRowClassNameOptions) | undefined \| string \| object | Function that takes the row data and returns an object in {'styleclass' : condition} format to define a classname for a particular now. |
| rowEditValidator             | data: [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) options: [DataTableRowEditValidatorOptions](https://primereact.org/datatable/#api.DataTable.DataTableRowEditValidatorOptions) | boolean                       | Callback to invoke to validate the editing row when the save icon is clicked on row editing mode. |
| rowExpansionTemplate         | data: [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) options: [DataTableRowExpansionTemplate](https://primereact.org/datatable/#api.DataTable.DataTableRowExpansionTemplate) | ReactNode                     | Function that receives the row data as the parameter and returns the expanded row content. You can override the rendering of the content by setting options.customRendering = true. |
| showRowReorderElement        | data: [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) options: [DataTableShowRowReorderElementOptions](https://primereact.org/datatable/#api.DataTable.DataTableShowRowReorderElementOptions) | null \| boolean               | Function that returns a boolean by passing the row data to decide if the row reorder element should be displayed per row. |
| showSelectionElement         | data: [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) options: [DataTableShowSelectionElementOptions](https://primereact.org/datatable/#api.DataTable.DataTableShowSelectionElementOptions) | null \| boolean               | Function that returns a boolean by passing the row data to decide if the radio or checkbox should be displayed per row. |

### Methods

Defines methods that can be accessed by the component's reference.

| name                    | parameters                                                   | returnType                                                   | description                                                  |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| clearState              |                                                              | void                                                         | Clears the table state.                                      |
| closeEditingCell        |                                                              | void                                                         | Closes the current editing cell when incell editing is enabled. |
| closeEditingRows        |                                                              | void                                                         | Closes the current editing rows when row editing is enabled. |
| exportCSV               | options: Object                                              | void                                                         | Exports the data to CSV format.                              |
| filter                  | value: T field: string mode: "endsWith" \| "startsWith" \| "custom" \| "contains" \| "in" \| "equals" \| "notEquals" \| "notContains" \| "notIn" \| "lt" \| "lte" \| "gt" \| "gte" \| "between" \| "dateIs" \| "dateIsNot" \| "dateBefore" \| "dateAfter" index: number | void                                                         | Filters the data.                                            |
| getElement              |                                                              | null \| HTMLDivElement                                       | Used to get container element.                               |
| getFilterMeta           |                                                              | undefined \|[DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | Retrieves the currently applied filters for the data table.  |
| getProcessedData        |                                                              | TValue                                                       | Used to get the processed data.                              |
| getSortMeta             |                                                              | undefined \|[DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | Retrieves the currently applied multiple sort metadata for the data table. |
| getTable                |                                                              | null \| HTMLTableElement                                     | Used to get container element.                               |
| getVirtualScroller      |                                                              | null \| VirtualScroller                                      | Used to get the virtual scroller.                            |
| reset                   |                                                              | void                                                         | Resets sort, filter, paginator and columnorder state.        |
| resetColumnOrder        |                                                              | void                                                         | Resets column order when reorderableColumns is enabled.      |
| resetResizeColumnsWidth |                                                              | void                                                         | Resets resize columns width.                                 |
| resetScroll             |                                                              | void                                                         | Resets scroll position.                                      |
| restoreColumnWidths     |                                                              | void                                                         | Restores the column widths.                                  |
| restoreState            |                                                              | void                                                         | Restores the table state.                                    |
| restoreTableState       | state: any                                                   | void                                                         | Stored states can be loaded at any time using this method if there is a stateStorage property. |
| saveState               |                                                              | void                                                         | Saves the state.                                             |
| setFilterMeta           | filters: [DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | void                                                         | Sets the filters for the data table.                         |
| setSortMeta             | sorts: [DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | void                                                         | Sets the multiple sort metadata for the data table.          |

### Events

Defines the custom events used by the component's callbacks.

#### DataTableRowToggleEvent

Custom row toggle event. See *onRowToggle*.

| name | type                                                         | description    |
| :--- | :----------------------------------------------------------- | :------------- |
| data | any[] \|[ DataTableExpandedRows](https://primereact.org/datatable/#api.DataTable.DataTableExpandedRows) | Expanded rows. |

#### DataTableColumnResizeEndEvent

Custom resize end event. See *onColumnResizeEnd*.

| name    | type        | description                        |
| :------ | :---------- | :--------------------------------- |
| element | HTMLElement | DOM element of the resized column. |
| column  | Column      | Properties of the resized column.  |
| delta   | number      | Change in column width.            |

#### DataTableColumnResizerClickEvent

Custom column resizer click event. See *onColumnResizerClick*.

| name          | type                                | description                |
| :------------ | :---------------------------------- | :------------------------- |
| originalEvent | MouseEvent<HTMLElement, MouseEvent> | Browser event.             |
| element       | HTMLElement                         | DOM element of the column. |
| column        | Column                              | Properties of the column.  |

#### DataTablePageEvent

Custom pagination event See *onPage*.

| name      | type   | description                       |
| :-------- | :----- | :-------------------------------- |
| first     | number | Index of the first row.           |
| rows      | number | Rows per page.                    |
| page      | number | The page number of the datatable. |
| pageCount | number | Total number of pages.            |

#### DataTableSortEvent

Custom sort event. See *onSort*.

| name          | type                                                         | description            |
| :------------ | :----------------------------------------------------------- | :--------------------- |
| sortField     | string                                                       | Field to sort against. |
| sortOrder     | undefined \| null \| 0 \| 1 \| -1                            | Sort order as integer. |
| multiSortMeta | undefined \| null \|[ DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | MultiSort metadata.    |

#### DataTableFilterEvent

Custom filter event. See *onFilter*.

| name    | type                                                         | description                   |
| :------ | :----------------------------------------------------------- | :---------------------------- |
| filters | [DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | Collection of active filters. |

#### DataTableStateEvent

Custom state event containing page, filter and sort states. See *-* .

| name          | type                                                         | description                       |
| :------------ | :----------------------------------------------------------- | :-------------------------------- |
| first         | number                                                       | Index of the first row.           |
| rows          | number                                                       | Rows per page.                    |
| page          | number                                                       | The page number of the datatable. |
| pageCount     | number                                                       | Total number of pages.            |
| sortField     | string                                                       | Field to sort against.            |
| sortOrder     | undefined \| null \| 0 \| 1 \| -1                            | Sort order as integer.            |
| multiSortMeta | undefined \| null \|[ DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | MultiSort metadata.               |
| filters       | [DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | Collection of active filters.     |

#### DataTableDataSelectableEvent

Custom data selectable event. See *isDataSelectable*.

| name  | type                                                         | description               |
| :---- | :----------------------------------------------------------- | :------------------------ |
| data  | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original data of the row. |
| index | number                                                       | Index of the row.         |

#### DataTableContextMenuSingleSelectionChangeEvent

Custom selection change event for context menu in single select mode. See *DataTableProps.onContextMenuSelectionChange*.

| name          | type                           | description       |
| :------------ | :----------------------------- | :---------------- |
| originalEvent | SyntheticEvent<Element, Event> | Browser event.    |
| value         | TValue[number]                 | Selection object. |

#### DataTableContextMenuMultipleSelectionChangeEvent

Custom selection change event for context menu in multiple select mode. See *DataTableProps.onContextMenuSelectionChange*.

| name          | type                           | description       |
| :------------ | :----------------------------- | :---------------- |
| originalEvent | SyntheticEvent<Element, Event> | Browser event.    |
| value         | TValue                         | Selection object. |

#### DataTableSelectionMultipleChangeEvent

Custom multiple selection change event. See *DataTableProps.onSelectionChange*.

| name          | type                                       | description            |
| :------------ | :----------------------------------------- | :--------------------- |
| originalEvent | SyntheticEvent<Element, Event>             | Browser event.         |
| value         | TValue                                     | Selection objects.     |
| type          | "all" \| "multiple" \| "checkbox" \| "row" | Type of the selection. |

#### DataTableSelectionSingleChangeEvent

Custom single selection change event. See *DataTableProps.onSelectionChange*.

| name          | type                           | description            |
| :------------ | :----------------------------- | :--------------------- |
| originalEvent | SyntheticEvent<Element, Event> | Browser event.         |
| value         | TValue[number]                 | Selection object.      |
| type          | "radio" \| "row" \| "single"   | Type of the selection. |

#### DataTableSelectionCellSingleChangeEvent

Custom cell single selection change event. See *DataTableProps.onSelectionChange*.

| name          | type                                                         | description            |
| :------------ | :----------------------------------------------------------- | :--------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Browser event.         |
| value         | [DataTableCellSelection](https://primereact.org/datatable/#api.DataTable.DataTableCellSelection) | Selection objects.     |
| type          | "cell"                                                       | Type of the selection. |

#### DataTableSelectionCellMultipleChangeEvent

Custom cell multiple selection change event. See *DataTableProps.onSelectionChange*.

| name          | type                                                         | description            |
| :------------ | :----------------------------------------------------------- | :--------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Browser event.         |
| value         | [DataTableCellSelection[\]](https://primereact.org/datatable/#api.DataTable.DataTableCellSelection) | Selection objects.     |
| type          | "cell"                                                       | Type of the selection. |

#### DataTableRowEvent

Custom context menu event. See *onContextMenu*.

| name          | type                                                         | description              |
| :------------ | :----------------------------------------------------------- | :----------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Original event instance. |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.      |

#### DataTableRowPointerEvent

Custom row pointer event. See *onRowPointerDown*.

| name          | type                                                         | description            |
| :------------ | :----------------------------------------------------------- | :--------------------- |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.    |
| originalEvent | PointerEvent<HTMLElement>                                    | Browser event.         |
| index         | number                                                       | Clicked row data index |

#### DataTableRowClickEvent

Custom row click event. See *onRowClick*.

| name          | type                                                         | description            |
| :------------ | :----------------------------------------------------------- | :--------------------- |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.    |
| originalEvent | MouseEvent<HTMLElement, MouseEvent>                          | Browser event.         |
| index         | number                                                       | Clicked row data index |

#### DataTableRowEditEvent

Custom row edit event. See *onRowEditInit*.

| name          | type                                                         | description              |
| :------------ | :----------------------------------------------------------- | :----------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Original event instance. |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.      |
| index         | number                                                       | Index of the row.        |

#### DataTableRowEditCompleteEvent

Custom row edit complete event. See *onRowEditComplete*.

| name          | type                                                         | description                     |
| :------------ | :----------------------------------------------------------- | :------------------------------ |
| originalEvent | SyntheticEvent<Element, Event>                               | Original event instance.        |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.             |
| newData       | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Editing rows data.              |
| field         | string                                                       | Column field.                   |
| index         | number                                                       | Current editing row data index. |

#### DataTableSelectEvent

Custom select event. See *onAllRowsSelect*.

| name          | type                                                         | description                                  |
| :------------ | :----------------------------------------------------------- | :------------------------------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Browser event.                               |
| data          | any                                                          | Selected rows data.                          |
| type          | undefined \| "all" \| "checkbox" \| "radio" \| "cell" \| "row" | Type of the selection, valid value is "all". |

#### DataTableUnselectEvent

Custom unselect event. See *onAllRowsUnselect*.

| name          | type                                                         | description                                  |
| :------------ | :----------------------------------------------------------- | :------------------------------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Browser event.                               |
| data          | any                                                          | Selected rows data.                          |
| type          | undefined \| "all" \| "checkbox" \| "radio" \| "cell" \| "row" | Type of the selection, valid value is "all". |

#### DataTableExportFunctionEvent

Custom export function event. See *exportFunction*.

| name    | type                                                         | description      |
| :------ | :----------------------------------------------------------- | :--------------- |
| data    | [DataTableRowDataArray](https://primereact.org/datatable/#api.DataTable.DataTableRowDataArray) | Field data.      |
| field   | string                                                       | Column field.    |
| rowData | [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) | Data of the row. |
| column  | Column                                                       | Column.          |

#### DataTableColReorderEvent

Custom column reorder event. See *onColReorder*.

| name          | type                   | description                  |
| :------------ | :--------------------- | :--------------------------- |
| originalEvent | DragEvent<HTMLElement> | Browser event.               |
| dragIndex     | number                 | Index of the dragged column. |
| dropIndex     | number                 | Index of the dropped column. |
| columns       | Column[]               | Columns array after reorder. |

#### DataTableRowReorderEvent

Custom column reorder event. See *onRowReorder*.

| name          | type                                                         | description                 |
| :------------ | :----------------------------------------------------------- | :-------------------------- |
| originalEvent | DragEvent<HTMLElement>                                       | Browser event.              |
| value         | [DataTableRowDataArray](https://primereact.org/datatable/#api.DataTable.DataTableRowDataArray) | New value after reorder.    |
| dragIndex     | number                                                       | Index of the dragged row.   |
| dropIndex     | number                                                       | Index of the drop location. |

### Interfaces

Defines the custom interfaces used by the module.

#### DataTableHeaderTemplateOptions

Custom datatable header template options.

| name  | type                                                         | description                 |
| :---- | :----------------------------------------------------------- | :-------------------------- |
| props | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable. |

#### DataTableFooterTemplateOptions

Custom datatable header template options. Extends *DataTableHeaderTemplateOptions<TValue>*.

| name  | type                                                         | description                 |
| :---- | :----------------------------------------------------------- | :-------------------------- |
| props | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable. |

#### DataTableRowGroupHeaderTemplateOptions

Custom datatable row group header template options.

| name            | type                                                         | description                                    |
| :-------------- | :----------------------------------------------------------- | :--------------------------------------------- |
| index           | number                                                       | index of the row group header template.        |
| props           | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable.                    |
| customRendering | boolean                                                      | Used to override the rendering of the content. |

#### DataTableRowGroupFooterTemplateOptions

Custom datatable row group footer template options. Extends *DataTableRowGroupHeaderTemplateOptions<T>*.

| name            | type                                                         | description                                    |
| :-------------- | :----------------------------------------------------------- | :--------------------------------------------- |
| index           | number                                                       | index of the row group header template.        |
| props           | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable.                    |
| customRendering | boolean                                                      | Used to override the rendering of the content. |
| colSpan         | number                                                       | Number of columns to span for grouping.        |

#### DataTableSortMeta

Custom datatable sort meta

| name  | type                              | description                   |
| :---- | :-------------------------------- | :---------------------------- |
| field | string                            | Column field to sort against. |
| order | undefined \| null \| 0 \| 1 \| -1 | Sort order as integer.        |

#### DataTableFilterMetaData

Custom datatable filter metadata.

| name      | type                                                         | description              |
| :-------- | :----------------------------------------------------------- | :----------------------- |
| value     | any                                                          | Value to filter against. |
| matchMode | undefined \| "endsWith" \| "startsWith" \| "custom" \| "contains" \| "in" \| "equals" \| "notEquals" \| "notContains" \| "notIn" \| "lt" \| "lte" \| "gt" \| "gte" \| "between" \| "dateIs" \| "dateIsNot" \| "dateBefore" \| "dateAfter" | Type of filter match.    |

#### DataTableOperatorFilterMetaData

Custom datatable operator filter metadata.

| name        | type                                                         | description                    |
| :---------- | :----------------------------------------------------------- | :----------------------------- |
| operator    | string                                                       | Operator to use for filtering. |
| constraints | [DataTableFilterMetaData[\]](https://primereact.org/datatable/#api.DataTable.DataTableFilterMetaData) | Operator to use for filtering. |

#### DataTableFilterMeta

Custom datatable filter meta.

| name          | type                                                         |
| :------------ | :----------------------------------------------------------- |
| [key: string] | [DataTableFilterMetaData ](https://primereact.org/datatable/#api.DataTable.DataTableFilterMetaData)\|[ DataTableOperatorFilterMetaData](https://primereact.org/datatable/#api.DataTable.DataTableOperatorFilterMetaData) |

#### DataTableExpandedRows

Custom datatable expanded rows.

| name          | type    |
| :------------ | :------ |
| [key: string] | boolean |

#### DataTableEditingRows

Custom datatable editing rows.

| name          | type    |
| :------------ | :------ |
| [key: string] | boolean |

#### DataTableSelectAllChangeEvent

Custom select all change event.

| name          | type                           | description                   |
| :------------ | :----------------------------- | :---------------------------- |
| originalEvent | SyntheticEvent<Element, Event> | Browser event.                |
| checked       | boolean                        | Whether all data is selected. |

#### DataTableRowMouseEvent

Custom row mouse event. Extends *Omit<DataTableRowEvent, "originalEvent">*.

| name          | type                                                         | description            |
| :------------ | :----------------------------------------------------------- | :--------------------- |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.    |
| originalEvent | MouseEvent<HTMLElement, MouseEvent>                          | Browser event.         |
| index         | number                                                       | Clicked row data index |

#### DataTableCellClickEvent

Custom cell click event.

| name          | type                                                         | description                          |
| :------------ | :----------------------------------------------------------- | :----------------------------------- |
| originalEvent | MouseEvent<HTMLElement, MouseEvent>                          | Browser event.                       |
| value         | any                                                          | Value of the cell.                   |
| field         | string                                                       | Column field.                        |
| rowData       | [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) | Data of the row.                     |
| rowIndex      | number                                                       | Index of the row.                    |
| cellIndex     | number                                                       | Index of the cell.                   |
| selected      | boolean                                                      | Whether the cell is selected or not. |

#### DataTableRowEditSaveEvent

Custom row edit save event. Extends *DataTableRowEditEvent*.

| name          | type                                                         | description                      |
| :------------ | :----------------------------------------------------------- | :------------------------------- |
| originalEvent | SyntheticEvent<Element, Event>                               | Original event instance.         |
| data          | [DataTableValue](https://primereact.org/datatable/#api.DataTable.DataTableValue) | Original rows data.              |
| index         | number                                                       | Index of the row.                |
| valid         | boolean                                                      | Whether the row is valid or not. |
| newData       | [DataTableRowData](https://primereact.org/datatable/#api.DataTable.DataTableRowData) | Editing row data.                |

#### DataTableRowExpansionTemplate

Options for the row expansion template

| name            | type    | description                                    |
| :-------------- | :------ | :--------------------------------------------- |
| index           | number  | Index of the row.                              |
| customRendering | boolean | Used to override the rendering of the content. |

#### DataTableRowClassNameOptions

Custom row className options.

| name  | type                                                         | description                 |
| :---- | :----------------------------------------------------------- | :-------------------------- |
| props | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable. |

#### DataTableCellClassNameOptions

Custom cell className options.

| name      | type                                                         | description                       |
| :-------- | :----------------------------------------------------------- | :-------------------------------- |
| props     | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable.       |
| column    | Column                                                       | Column element of the datatable.  |
| field     | string                                                       | Column field.                     |
| frozenRow | boolean                                                      | Whether the row is frozen or not. |
| rowIndex  | number                                                       | Index of the row.                 |

#### DataTableShowSelectionElementOptions

Custom show selection element options.

| name     | type                                                         | description                 |
| :------- | :----------------------------------------------------------- | :-------------------------- |
| rowIndex | number                                                       | Index of the row.           |
| props    | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable. |

#### DataTableShowRowReorderElementOptions

Custom show row reorder element options.

| name     | type                                                         | description                 |
| :------- | :----------------------------------------------------------- | :-------------------------- |
| rowIndex | number                                                       | Index of the row element.   |
| props    | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable. |

#### DataTableRowEditValidatorOptions

Custom row edit validator options.

| name     | type                                                         | description                 |
| :------- | :----------------------------------------------------------- | :-------------------------- |
| props    | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) | The props of the datatable. |
| rowIndex | number                                                       | Index of validated row      |

#### DataTablePassThroughMethodOptions

Custom passthrough(pt) option method.

| name    | type                                                         |
| :------ | :----------------------------------------------------------- |
| props   | [DataTableProps](https://primereact.org/datatable/#api.DataTable.props) |
| state   | [DataTableState](https://primereact.org/datatable/#api.DataTable.DataTableState) |
| context | [DataTableContext](https://primereact.org/datatable/#api.DataTable.DataTableContext) |

#### DataTableState

Defines current inline state in DataTable component.

| name              | type                                                         | description                                                |
| :---------------- | :----------------------------------------------------------- | :--------------------------------------------------------- |
| first             | number                                                       | Current index of first record as a number.                 |
| rows              | number                                                       | Current number of rows to display in new page as a number. |
| sortField         | undefined \| string \| Function                              | Current sort field.                                        |
| sortOrder         | number                                                       | Current order to sort the data by default.                 |
| multiSortMeta     | [DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | Current sortmeta objects to sort the data.                 |
| filters           | [DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | Current filters object.                                    |
| columnOrder       | string[]                                                     | Current order of the columns.                              |
| groupRowsSortMeta | [DataTableSortMeta](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | Current group sortmeta objects to sort the data.           |
| editingMeta       | object                                                       | Current editing meta data.                                 |
| d_rows            | number                                                       | Current number of rows to display in new page as a number. |
| d_filters         | object                                                       | Current filters object.                                    |

#### DataTableContext

Defines current options in DataTable component.

| name       | type    | description                            |
| :--------- | :------ | :------------------------------------- |
| scrollable | boolean | Current scrollable state as a boolean. |

#### DataTablePassThroughOptions

Custom passthrough(pt) options.

| name                     | type                                                         | description                                                  |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| root                     | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the root's DOM element.           |
| loadingOverlay           | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the loading overlay's DOM element. |
| loadingIcon              | [DataTablePassThroughType ](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the loading icon's DOM element.   |
| header                   | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the header's DOM element.         |
| paginator                | PaginatorPassThroughOptions                                  | Uses to pass attributes to the Paginator component.          |
| wrapper                  | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the wrapper's DOM element.        |
| virtualScroller          | VirtualScrollerPassThroughOptions                            | Uses to pass attributes to the VirtualScroller component.    |
| table                    | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the table's DOM element.          |
| virtualScrollerSpacer    | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the virtual scroller spacer's DOM element. |
| footer                   | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the footer's DOM element.         |
| thead                    | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the thead's DOM element.          |
| headerRow                | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the header row's DOM element.     |
| tbody                    | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the tbody's DOM element.          |
| rowGroupHeader           | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the rowgroup header's DOM element. |
| rowGroupHeaderName       | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the rowgroup header name's DOM element. |
| bodyRow                  | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the row's DOM element.            |
| rowExpansion             | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the row expansion's DOM element.  |
| rowGroupFooter           | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the rowgroup footer's DOM element. |
| rowGroupToggler          | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the rowgroup toggler's DOM element. |
| rowGroupTogglerIcon      | [DataTablePassThroughType ](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the rowgroup toggler icon's DOM element. |
| emptyMessage             | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the empty message's DOM element.  |
| tfoot                    | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the tfoot's DOM element.          |
| footerRow                | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the footerr ow's DOM element.     |
| footerCell               | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the footer cell's DOM element.    |
| resizeHelper             | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the resize helper's DOM element.  |
| reorderIndicatorUp       | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the reorder indicator up's DOM element. |
| reorderIndicatorUpIcon   | [DataTablePassThroughType ](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the reorder indicator up icon's DOM element. |
| reorderIndicatorDown     | [DataTablePassThroughType>](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType) | Uses to pass attributes to the reorder indicator down's DOM element. |
| reorderIndicatorDownIcon | [DataTablePassThroughType ](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the reorder indicator down icon's DOM element. |
| columnGroup              | ColumnGroupPassThroughOptions                                | Used to pass attributes to the ColumnGroup helper components. |
| row                      | RowPassThroughOptions                                        | Used to pass attributes to the Row helper components.        |
| column                   | ColumnPassThroughOptions                                     | Used to pass attributes to the Column helper components.     |
| tooltip                  | TooltipPassThroughOptions                                    | Uses to pass attributes tooltip's DOM element.               |
| hooks                    | ComponentHooks                                               | Used to manage all lifecycle hooks                           |

#### DataTableBodyRowContext

Defines current options in DataTable BodyRow which is the table <TR> element.

| name        | type    | description                                                  |
| :---------- | :------ | :----------------------------------------------------------- |
| selected    | boolean | Whether the row is selected.                                 |
| selectable  | boolean | Whether the row is selectable.                               |
| stripedRows | boolean | Whether the rows have striped styling.                       |
| index       | number  | Index of the row. Note: this is not the index of the value array its the index of the row <TR in the table. |

#### DataTableBodyRowState

Defines current inline state in DataTable BodyRow which is the table <TR> element.

| name    | type    | description                         |
| :------ | :------ | :---------------------------------- |
| editing | boolean | Whether the row is in editing mode. |

#### DataTableBodyRowPassThroughMethodOptions

Custom passthrough(pt) option method for BodyRow which is the table <TR> element.

| name     | type                                                         | description                     |
| :------- | :----------------------------------------------------------- | :------------------------------ |
| hostName | string                                                       | Name of the component.          |
| context  | [DataTableBodyRowContext](https://primereact.org/datatable/#api.DataTable.DataTableBodyRowContext) | Current context of the bodyRow. |
| parent   | [DataTablePassThroughMethodOptions](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughMethodOptions) | Parent options.                 |
| props    | [DataTableBaseProps](https://primereact.org/datatable/#api.DataTable.DataTableBaseProps) | Component props.                |
| state    | [DataTableBodyRowState](https://primereact.org/datatable/#api.DataTable.DataTableBodyRowState) | Current state of the bodyRow.   |

#### DataTableBaseProps

Defines valid properties in DataTable component. In addition to these, all properties of HTMLDivElement can be used in this component. Extends *Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, "size" | "onContextMenu" | "ref" | "value">*.

| name                      | type                                                         | description                                                  |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| id                        | string                                                       | Unique identifier of the element.                            |
| value                     | TValue                                                       | An array of objects to display.                              |
| alwaysShowPaginator       | boolean                                                      | Whether to show it even there is only one page.              |
| breakpoint                | string                                                       | The breakpoint to define the maximum width boundary when using stack responsive layout. |
| cellMemo                  | boolean                                                      | Whether to enable cell memoization. When the memoization is enabled, be sure to: 1- Update the value prop (i.e., row data) to trigger a re-render of the cells of a given row. 2- Where necessary, use the spread operator (...) when updating the value prop objs which creates new fresh objects and avoids mutating the same objects. When the memoization is disabled, a re-render of the datatable will trigger a re-render of all cells, which can lead to performance issues with large datasets and is therefore not recommended. |
| cellMemoProps             | string[]                                                     | The cell props to be checked at memoization. Possible cell props are: 'hostName', 'allowCellSelection', 'cellMemo', 'cellMemoProps', 'cellMemoPropsDepth', 'cellClassName', 'checkIcon', 'collapsedRowIcon', 'field', 'resolveFieldData', 'column', 'cProps', 'dataKey', 'editMode', 'editing', 'editingMeta', 'onEditingMetaChange', 'editingKey', 'getEditingRowData', 'expanded', 'expandedRowIcon', 'frozenRow', 'frozenCol', 'alignFrozenCol', 'index', 'isSelectable', 'onCheckboxChange', 'onClick', 'onMouseDown', 'onMouseUp', 'onRadioChange', 'onRowEditCancel', 'onRowEditInit', 'onRowEditSave', 'onRowToggle', 'responsiveLayout', 'rowData', 'rowEditorCancelIcon', 'rowEditorInitIcon', 'rowEditorSaveIcon', 'rowIndex', 'rowSpan', 'selectOnEdit', 'isRowSelected', 'isCellSelected', 'selectionAriaLabel', 'showRowReorderElement', 'showSelectionElement', 'tabIndex', 'getTabIndex', 'tableProps', 'tableSelector', 'value', 'getVirtualScrollerOption', 'ptCallbacks', 'metaData', 'unstyled', 'findNextSelectableCell', 'findPrevSelectableCell', 'findDownSelectableCell', 'findUpSelectableCell', 'focusOnElement', 'focusOnInit', 'updateStickyPosition' IMPORTANT: Including a function to be checked will in general disable the memoization in practice, since functions are compared by reference. |
| cellMemoPropsDepth        | number                                                       | The comparison depth when checking cell props (e.g., rowData) at memoization. |
| checkIcon                 | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Icon to display in the checkbox.                             |
| className                 | string                                                       | Style class of the component.                                |
| collapsedRowIcon          | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Icon of the row toggler to display the row as collapsed.     |
| columnResizeMode          | "expand" \| "fit"                                            | Used to define the resize mode of the columns, valid values are "fit" and "expand". |
| compareSelectionBy        | "equals" \| "deepEquals"                                     | Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields. |
| contextMenuSelection      | object                                                       | Selected row in single mode or an array of values in multiple mode. |
| csvSeparator              | string                                                       | Character to use as the csv separator.                       |
| currentPageReportTemplate | string                                                       | Template of the current page report element. Available placeholders are &#123;currentPage&#125;, &#123;totalPages&#125;, &#123;rows&#125;, &#123;first&#125;, &#123;last&#125; and &#123;totalRecords&#125; |
| dataKey                   | string \| Function                                           | Name of the field that uniquely identifies a record in the data. Should be a unique business key to prevent re-rendering. |
| defaultSortOrder          | null \| 0 \| 1 \| -1                                         | Default sort order of an unsorted column.                    |
| dragSelection             | boolean                                                      | When enabled, a rectangle that can be dragged can be used to make a range selection. |
| editMode                  | string                                                       | Defines editing mode, options are "cell" and "row".          |
| editingRows               | [DataTableValueArray ](https://primereact.org/datatable/#api.DataTable.DataTableValueArray)\|[ DataTableEditingRows](https://primereact.org/datatable/#api.DataTable.DataTableEditingRows) | A collection of rows to represent the current editing data in row edit mode. |
| emptyMessage              | ReactNode \| Function                                        | Text to display when there is no data.                       |
| expandableRowGroups       | boolean                                                      | Makes row groups toggleable, default is false.               |
| expandedRowIcon           | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Icon of the row toggler to display the row as expanded.      |
| expandedRows              | [DataTableValueArray ](https://primereact.org/datatable/#api.DataTable.DataTableValueArray)\|[ DataTableExpandedRows](https://primereact.org/datatable/#api.DataTable.DataTableExpandedRows) | A collection of rows or a map object row data keys that are expanded. |
| exportFilename            | string                                                       | Name of the exported file.                                   |
| filterDelay               | number                                                       | Delay in milliseconds before filtering the data.             |
| filterDisplay             | "menu" \| "row"                                              | Layout of the filter elements, valid values are "row" and "menu". |
| filterLocale              | string                                                       | Locale to use in filtering. The default locale is the host environment's current locale. |
| filterIcon                | [IconType>](https://primereact.org/datatable/#api.DataTable) | Icon to display the current filtering status.                |
| filterClearIcon           | [IconType>](https://primereact.org/datatable/#api.DataTable) | Icon to display when the filter can be cleared.              |
| filters                   | [DataTableFilterMeta](https://primereact.org/datatable/#api.DataTable.DataTableFilterMeta) | An array of FilterMetadata objects to provide external filters. |
| first                     | number                                                       | Index of the first row to be displayed.                      |
| footer                    | [DataTableFooterTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableFooterTemplateType) | Custom footer content of the table.                          |
| footerColumnGroup         | ReactNode                                                    | ColumnGroup component for footer.                            |
| frozenValue               | [DataTableRowDataArray](https://primereact.org/datatable/#api.DataTable.DataTableRowDataArray) | Items of the frozen part in scrollable DataTable.            |
| frozenWidth               | string                                                       | Width of the frozen part in scrollable DataTable.            |
| frozenRow                 | boolean                                                      | Whether the row is frozen or not. Read-Only necessary for unstyled TypeScript definition. |
| globalFilter              | null \| string                                               | Value of the global filter to use in filtering.              |
| globalFilterFields        | string[]                                                     | Define fields to be filtered globally.                       |
| globalFilterMatchMode     | "endsWith" \| "startsWith" \| "custom" \| "contains" \| "in" \| "equals" \| "notEquals" \| "notIn" \| "lt" \| "lte" \| "gt" \| "gte" | Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notIn", "lt", "lte", "gt", "gte" and "custom". |
| groupRowsBy               | string                                                       | Used for either be grouped by a separate grouping row or using rowspan. |
| header                    | [DataTableHeaderTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableHeaderTemplateType) | Custom header content of the table.                          |
| headerColumnGroup         | ReactNode                                                    | ColumnGroup component for header.                            |
| lazy                      | boolean                                                      | Defines if data is loaded and interacted with in lazy manner. |
| loading                   | boolean                                                      | Displays a loader to indicate data load is in progress.      |
| loadingIcon               | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | The icon to show while indicating data load is in progress.  |
| metaKeySelection          | boolean                                                      | Defines whether metaKey is requred or not for the selection. When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| multiSortMeta             | null \|[ DataTableSortMeta[\]](https://primereact.org/datatable/#api.DataTable.DataTableSortMeta) | An array of SortMeta objects to sort the data by default in multiple sort mode. |
| pageLinkSize              | number                                                       | Number of page links to display.                             |
| paginator                 | boolean                                                      | When specified as true, enables the pagination.              |
| paginatorClassName        | string                                                       | Style class of the paginator element.                        |
| paginatorDropdownAppendTo | null \| HTMLElement \| "self" \| Function                    | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element and 'self'. The self value is used to render a component where it is located. |
| paginatorLeft             | ReactNode                                                    | Content for the left side of the paginator.                  |
| paginatorPosition         | "both" \| "top" \| "bottom"                                  | Position of the paginator, options are "top","bottom" or "both". |
| paginatorRight            | ReactNode                                                    | Content for the right side of the paginator.                 |
| paginatorTemplate         | PaginatorTemplate                                            | Template of the paginator. For details, refer to the template section of the paginator documentation for further options. |
| removableSort             | boolean                                                      | When enabled, columns can have an un-sorted state.           |
| reorderableColumns        | boolean                                                      | When enabled, columns can be reordered using drag and drop.  |
| reorderableRows           | boolean                                                      | When enabled, rows can be reordered using drag and drop.     |
| reorderIndicatorDownIcon  | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Defines the reorder indicator down icon.                     |
| reorderIndicatorUpIcon    | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Defines the reorder indicator up icon.                       |
| resizableColumns          | boolean                                                      | When enabled, columns can be resized using drag and drop.    |
| responsiveLayout          | "scroll" \| "stack"                                          | Defines the responsive mode, valid options are "stack" and "scroll". |
| rowEditorCancelIcon       | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Icon to display in the row editor cancel button.             |
| rowEditorInitIcon         | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Icon to display in the row editor init button.               |
| rowEditorSaveIcon         | [IconType>](https://primereact.org/datatable/#api.DataTable.props) | Icon to display in the row editor save button.               |
| rowGroupFooterTemplate    | [DataTableRowGroupFooterTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableRowGroupFooterTemplateType) | Function to provide the content of row group footer.         |
| rowGroupHeaderTemplate    | [DataTableRowGroupHeaderTemplateType](https://primereact.org/datatable/#api.DataTable.DataTableRowGroupHeaderTemplateType) | Function to provide the content of row group header.         |
| rowGroupMode              | string                                                       | Defines the row grouping mode, valid values are "subheader" and "rowgroup". |
| rowHover                  | boolean                                                      | When enabled, background of the rows change on hover.        |
| rows                      | number                                                       | Number of rows to display per page.                          |
| rowsPerPageOptions        | number[]                                                     | Array of integer values to display inside rows per page dropdown. |
| scrollHeight              | string                                                       | Height of the scroll viewport.                               |
| scrollable                | boolean                                                      | When specified, enables horizontal and/or vertical scrolling. |
| selectAll                 | boolean                                                      | When specified, selects all rows on page.                    |
| selectOnEdit              | boolean                                                      | Determines whether the cell editor will be opened when clicking to select any row on Selection and Cell Edit modes. |
| selectionAutoFocus        | boolean                                                      | When a selectable row is clicked on RadioButton and Checkbox selection, it automatically decides whether to focus on elements such as checkbox or radio. |
| selectionAriaLabel        | string                                                       | A field property from the row to add Select &#123;field&#125; and Unselect &#123;field&#125; ARIA labels to checkbox/radio buttons. |
| selectionPageOnly         | boolean                                                      | When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page. |
| showGridlines             | boolean                                                      | Whether to show grid lines between cells.                    |
| showHeaders               | boolean                                                      | Whether to show headers.                                     |
| showSelectAll             | boolean                                                      | Whether to show the select all checkbox inside the datatable's header. |
| size                      | "small" \| "normal" \| "large"                               | Define to set alternative sizes. Valid values: "small", "normal" and "large". |
| sortField                 | string                                                       | Property of a row data used for sorting, defaults to field.  |
| sortMode                  | "multiple" \| "single"                                       | Defines whether sorting works on single column or on multiple columns. |
| sortIcon                  | [IconType, Object>](https://primereact.org/datatable/#api.DataTable) | Icon to display the current sorting status.                  |
| sortOrder                 | SortOrder                                                    | Order to sort the data by default.                           |
| stateKey                  | string                                                       | Unique identifier of a stateful table to use in state storage. |
| stateStorage              | "custom" \| "local" \| "session"                             | Defines where a stateful table keeps its state, valid values are "session" for sessionStorage, "local" for localStorage and "custom". |
| stripedRows               | boolean                                                      | Whether to displays rows with alternating colors.            |
| style                     | CSSProperties                                                | Inline style of the component.                               |
| tabIndex                  | number                                                       | Index of the element in tabbing order.                       |
| tableClassName            | string                                                       | Style class of the table element.                            |
| tableStyle                | CSSProperties                                                | Inline style of the table element.                           |
| totalRecords              | number                                                       | Number of total records, defaults to length of value when not defined. |
| virtualScrollerOptions    | VirtualScrollerProps                                         | Whether to use the virtualScroller feature. The properties of VirtualScroller component can be used like an object in it. Note: Currently only vertical orientation mode is supported. |
| children                  | ReactNode                                                    | Used to get the child elements of the component.             |
| pt                        | [DataTablePassThroughOptions](https://primereact.org/datatable/#api.DataTable.DataTablePassThroughOptions) | Uses to pass attributes to DOM elements inside the component. |
| ptOptions                 | PassThroughOptions                                           | Used to configure passthrough(pt) options of the component.  |
| unstyled                  | boolean                                                      | When enabled, it removes component related styles in the core. |
| data-pr-tooltip           | string                                                       | Content to be displayed in tooltip.                          |
| data-pr-disabled          | boolean                                                      | When present, it specifies that the tooltip should be hidden. |
| data-pr-classname         | string                                                       | Style class of the tooltip.                                  |
| data-pr-position          | "left" \| "top" \| "bottom" \| "right" \| "mouse"            | Position of the tooltip.                                     |
| data-pr-my                | string                                                       | Defines which position on the tooltip being positioned to align with the target element. |
| data-pr-at                | string                                                       | Defines which position on the target element to align the positioned tooltip. |
| data-pr-event             | "both" \| "focus" \| "hover"                                 | Event to show the tooltip.                                   |
| data-pr-showevent         | string                                                       | Event to show the tooltip if the event property is empty.    |
| data-pr-hideevent         | string                                                       | Event to hide the tooltip if the event property is empty.    |
| data-pr-mousetrack        | boolean                                                      | Whether the tooltip will follow the mouse.                   |
| data-pr-mousetracktop     | number                                                       | Defines top position of the tooltip in relation to the mouse when the mouseTrack is enabled. |
| data-pr-mousetrackleft    | number                                                       | Defines left position of the tooltip in relation to the mouse when the mouseTrack is enabled. |
| data-pr-showdelay         | number                                                       | Delay to show the tooltip in milliseconds.                   |
| data-pr-updatedelay       | number                                                       | Delay to update the tooltip in milliseconds.                 |
| data-pr-hidedelay         | number                                                       | Delay to hide the tooltip in milliseconds.                   |
| data-pr-autohide          | boolean                                                      | Whether to hide tooltip when hovering over tooltip content.  |
| data-pr-showondisabled    | boolean                                                      | Whether to show tooltip for disabled elements.               |

### Types

Defines the custom types used by the module.

#### DataTableHeaderTemplateType

| values                      |
| :-------------------------- |
| React.ReactNode \| Function |

#### DataTableFooterTemplateType

| values                      |
| :-------------------------- |
| React.ReactNode \| Function |

#### DataTableRowGroupHeaderTemplateType

| values                      |
| :-------------------------- |
| React.ReactNode \| Function |

#### DataTableRowGroupFooterTemplateType

| values                      |
| :-------------------------- |
| React.ReactNode \| Function |

#### DataTableRowData

| values                                                |
| :---------------------------------------------------- |
| TValueArray extends (infer TValue)[] ? TValue : never |

#### DataTableRowDataArray

| values                     |
| :------------------------- |
| DataTableRowData<TValue>[] |

#### DataTableCellSelection

| values                                                       |
| :----------------------------------------------------------- |
| { "cellIndex": "number, // Index of the cell.", "column": "Column, // Column element of the datatable.", "field": "string, // Column field.", "props": "ColumnProps, // Properties of the column.", "rowData": "DataTableRowData<TValue>, // Data of the row.", "rowIndex": "number, // Index of the row.", "selected": "boolean, // Whether the row is selected or not.", "value": "TValue[number][keyof TValue[number]], // Value of the cell." } |

#### DataTablePassThroughType

| values                                                       |
| :----------------------------------------------------------- |
| PassThroughType<T, DataTablePassThroughMethodOptions<DataTableValueArray>> |

#### SortOrder

| values                            | description                                                  |
| :-------------------------------- | :----------------------------------------------------------- |
| 1 \| 0 \| -1 \| null \| undefined | Type for sort order values. - 1: Ascending order - 0: No sorting - -1: Descending order - null or undefined: No sorting |

## Column

Column is a helper component for DataTable and TreeTable.

### Props

Defines valid properties in ColumnProps component.

| name                    | type                                                         | default | description                                                  |
| :---------------------- | :----------------------------------------------------------- | :------ | :----------------------------------------------------------- |
| align                   | null \| "center" \| "left" \| "right"                        | null    | Aligns the content of the column, valid values are left, right and center. |
| alignFrozen             | "left" \| "right"                                            | null    | Position of a frozen column, valid values are left and right. |
| alignHeader             | null \| "center" \| "left" \| "right"                        | null    | Aligns the header of the column, valid values are left, right and center. |
| body                    | ReactNode \| Function                                        | null    | Body content of the column.                                  |
| bodyClassName           | string \| Function                                           | null    | Style class of the body. If using a function must return a string. |
| bodyStyle               | CSSProperties                                                | null    | Inline style of the body.                                    |
| cellEditValidateOnClose | boolean                                                      | false   | When enabled and cellEditorValidator is set, force to call cellEditorValidator before cell editor is closed. If cellEditorValidator returns false, editor stays open. |
| cellEditValidatorEvent  | string                                                       | click   | Event to trigger the validation, possible values are "click" and "blur". |
| children                | ReactNode                                                    | null    | Used to get the child elements of the component.             |
| className               | string                                                       | null    | Style class of the component.                                |
| colSpan                 | number                                                       | null    | Number of columns to span for grouping.                      |
| columnKey               | string                                                       | null    | Identifier of a column if field property is not defined. Only utilized by reorderableColumns feature at the moment. |
| dataType                | string                                                       | null    | Depending on the dataType of the column, suitable match modes are displayed. |
| editor                  | ReactNode \| Function                                        | null    | Function to provide the cell editor input.                   |
| excludeGlobalFilter     | boolean                                                      | false   | Whether to exclude from global filtering or not.             |
| expander                | boolean \| Function                                          | false   | Displays an icon to toggle row expansion.                    |
| exportable              | boolean                                                      | true    | Defines whether the column is exported or not.               |
| exportField             | string                                                       | null    | Property of a row data used for exporting, defaults to field. |
| exportHeader            | string                                                       | null    | Custom export header of the column to be exported.           |
| field                   | string                                                       | null    | Property of a row data.                                      |
| filter                  | boolean                                                      | false   | Defines if a column can be filtered.                         |
| filterApply             | ReactNode \| Function                                        | null    | Template of apply element in menu.                           |
| filterClear             | ReactNode \| Function                                        | null    | Template of clear element in menu.                           |
| filterElement           | ReactNode \| Function                                        | null    | Element for custom filtering.                                |
| filterField             | string                                                       | null    | Property of a row data used for filtering, defaults to field. |
| filterFooter            | ReactNode \| Function                                        | null    | Template of footer element in menu.                          |
| filterHeader            | ReactNode \| Function                                        | null    | Template of header element in menu.                          |
| filterHeaderClassName   | string                                                       | null    | Style class of the filter header.                            |
| filterHeaderStyle       | CSSProperties                                                | null    | Inline style of the filter header.                           |
| filterMatchMode         | string                                                       | null    | Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notIn", "lt", "lte", "gt", "gte" and "custom". |
| filterMatchModeOptions  | [ColumnFilterMatchModeOptions[\]](https://primereact.org/datatable/#api.Column.ColumnFilterMatchModeOptions) | null    | An array of label-value pairs to override the global match mode options. |
| filterMaxLength         | number                                                       | null    | Specifies the maximum number of characters allowed in the filter element. |
| filterMenuClassName     | string                                                       | null    | Style class of the column filter overlay.                    |
| filterMenuStyle         | CSSProperties                                                | null    | Inline style of the column filter overlay.                   |
| filterPlaceholder       | string                                                       | null    | Defines placeholder of the input fields.                     |
| filterType              | string                                                       | text    | Type of the filter input field.                              |
| footer                  | ReactNode \| Function                                        | null    | Footer content of the table.                                 |
| footerClassName         | string                                                       | null    | Style class of the footer.                                   |
| footerStyle             | CSSProperties                                                | null    | Inline style of the footer.                                  |
| frozen                  | boolean                                                      | false   | Whether the column is fixed in horizontal scrolling or not.  |
| header                  | ReactNode \| Function                                        | null    | Header content of the table.                                 |
| headerClassName         | string                                                       | null    | Style class of the header.                                   |
| headerStyle             | CSSProperties                                                | null    | Inline style of the header.                                  |
| headerTooltip           | string                                                       | null    | Content of the header tooltip.                               |
| headerTooltipOptions    | TooltipOptions                                               | null    | Configuration of the header tooltip, refer to the tooltip documentation for more information. |
| hidden                  | boolean                                                      | false   | Whether the column is rendered.                              |
| maxConstraints          | number                                                       | 2       | Maximum number of constraints for a column filter.           |
| pt                      | [ColumnPassThroughOptions](https://primereact.org/datatable/#api.Column.ColumnPassThroughOptions) | null    | Uses to pass attributes to DOM elements inside the component. |
| ptOptions               | PassThroughOptions                                           | null    | Used to configure passthrough(pt) options of the component.  |
| reorderable             | boolean                                                      | null    | Used to defined reorderableColumns per column when reorderableColumns of table is enabled, defaults to value of reorderableColumns. |
| resizeable              | boolean                                                      | null    | Used to defined resizeableColumns per column when resizeableColumns of table is enabled, defaults to value of resizeableColumns. |
| rowEditor               | boolean \| Function                                          | false   | Displays icons to edit row.                                  |
| rowReorder              | boolean                                                      | false   | Whether this column displays an icon to reorder the rows.    |
| rowReorderIcon          | [IconType](https://primereact.org/datatable/#api.Column.props) | null    | Icon of the drag handle to reorder rows.                     |
| rowSpan                 | number                                                       | null    | Number of rows to span for grouping.                         |
| selectionMode           | "multiple" \| "single"                                       | null    | Specifies the selection mode, valid values are "single", "multiple", "radiobutton" and "checkbox". |
| showAddButton           | boolean                                                      | true    | When enabled, a button is displayed to add more rules.       |
| showApplyButton         | boolean                                                      | true    | Displays a button to apply the column filtering.             |
| showClearButton         | boolean                                                      | true    | Displays a button to clear the column filtering.             |
| showFilterMatchModes    | boolean                                                      | true    | Whether to show the match modes selector.                    |
| showFilterMenu          | boolean                                                      | true    | Whether to display the filter overlay.                       |
| showFilterMenuOptions   | boolean                                                      | true    | Whether to show the match modes selector and match operator selector. |
| showFilterOperator      | boolean                                                      | true    | When enabled, match all and match any operator selector is displayed. |
| sortable                | boolean                                                      | false   | Defines if a column is sortable.                             |
| sortableDisabled        | boolean                                                      | false   | When enabled, the data of columns with this property cannot be sorted or changed by the user. |
| sortField               | string                                                       | null    | Name of the field to sort data by default.                   |
| style                   | CSSProperties                                                | null    | Inline style of the component.                               |
| unstyled                | boolean                                                      | false   | When enabled, it removes component related styles in the core. |

### Callbacks

Defines callbacks that determine the behavior of the component based on a given condition or report the actions that the component takes.

| name                     | parameters                                                   | returnType | description                                                  |
| :----------------------- | :----------------------------------------------------------- | :--------- | :----------------------------------------------------------- |
| cellEditValidator        | event: [ColumnEvent](https://primereact.org/datatable/#api.Column.ColumnEvent) | boolean    | Validator function to validate the cell input value.         |
| filterFunction           | value: any filter: any filterLocale: string params: [ColumnFilterEvent](https://primereact.org/datatable/#api.Column.ColumnFilterEvent) | void       | Custom filter function.                                      |
| onBeforeCellEditHide     | event: [ColumnEvent](https://primereact.org/datatable/#api.Column.ColumnEvent) | void       | Callback to invoke before the cell editor is hidden.         |
| onBeforeCellEditShow     | event: [ColumnEvent](https://primereact.org/datatable/#api.Column.ColumnEvent) | void       | Callback to invoke before the cell editor is shown. To prevent editor from showing return false or originalEvent.preventDefault(). |
| onCellEditCancel         | event: [ColumnEvent](https://primereact.org/datatable/#api.Column.ColumnEvent) | void       | Callback to execute when editor is cancelled.                |
| onCellEditComplete       | event: [ColumnEvent](https://primereact.org/datatable/#api.Column.ColumnEvent) | void       | Callback to execute when editor is submitted.                |
| onCellEditInit           | event: [ColumnEvent](https://primereact.org/datatable/#api.Column.ColumnEvent) | void       | Callback to invoke when cell edit is initiated. To prevent editor from showing return false or originalEvent.preventDefault(). |
| onFilterApplyClick       | event: [ColumnFilterApplyClickEvent](https://primereact.org/datatable/#api.Column.ColumnFilterApplyClickEvent) | void       | Callback to invoke when the apply button is clicked.         |
| onFilterClear            |                                                              | void       | Callback to invoke when the filter meta is cleared.          |
| onFilterConstraintAdd    | event: [ColumnFilterConstraintAddEvent](https://primereact.org/datatable/#api.Column.ColumnFilterConstraintAddEvent) | void       | Callback to invoke when a new constraint is added.           |
| onFilterConstraintRemove | event: [ColumnFilterConstraintRemoveEvent](https://primereact.org/datatable/#api.Column.ColumnFilterConstraintRemoveEvent) | void       | Callback to invoke when a constraint is removed.             |
| onFilterMatchModeChange  | event: [ColumnFilterMatchModeChangeEvent](https://primereact.org/datatable/#api.Column.ColumnFilterMatchModeChangeEvent) | void       | Callback to invoke when the match mode option is changed.    |
| onFilterOperatorChange   | event: [ColumnFilterOperatorChangeEvent](https://primereact.org/datatable/#api.Column.ColumnFilterOperatorChangeEvent) | void       | Callback to invoke when the filter operator option is changed. |
| sortFunction             | event: [ColumnSortEvent](https://primereact.org/datatable/#api.Column.ColumnSortEvent) | void       | Sort function for custom sorting.                            |

### Events

Defines the custom events used by the component's callbacks.

#### ColumnEvent

Custom event. See *cellEditValidator*.

| name          | type                                                   | description                             |
| :------------ | :----------------------------------------------------- | :-------------------------------------- |
| originalEvent | SyntheticEvent<Element, Event>                         | Original event triggered.               |
| value         | any                                                    | Value of the element.                   |
| field         | string                                                 | Field name of the column.               |
| rowData       | any                                                    | Data of the selected row.               |
| rowIndex      | number                                                 | Index of the selected row.              |
| cellIndex     | number                                                 | Index of the selected cell.             |
| selected      | boolean                                                | Whether the element is selected or not. |
| column        | [Column](https://primereact.org/datatable/#api.Column) | Column of the element.                  |
| newRowData    | any                                                    | New data of the row.                    |
| newValue      | any                                                    | New value of the element.               |

#### ColumnSortEvent

Custom sort event. See *sortFunction*.

| name          | type                                                         | description                                               |
| :------------ | :----------------------------------------------------------- | :-------------------------------------------------------- |
| field         | string                                                       | Field name of the column.                                 |
| order         | undefined \| null \| 0 \| 1 \| -1                            | Sort order of the column.                                 |
| data          | any                                                          | Data to be sorted.                                        |
| multiSortMeta | [ColumnSortMetaData[\]](https://primereact.org/datatable/#api.Column.ColumnSortMetaData) | Array of multiple sort metadata for multi-column sorting. |

#### ColumnFilterApplyClickEvent

Custom filter event. See *onFilterApplyClick*.

| name        | type                                                         | description                                                  |
| :---------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| field       | string                                                       | Field name of the column.                                    |
| constraints | [ColumnFilterMetaData[\]](https://primereact.org/datatable/#api.Column.ColumnFilterMetaData) | Array of ColumnFilterMetaData objects representing the constraints. |

#### ColumnFilterMatchModeChangeEvent

Custom filter event. See *onFilterMatchModeChange*.

| name      | type   | description                                                  |
| :-------- | :----- | :----------------------------------------------------------- |
| field     | string | Field name of the column.                                    |
| matchMode | string | Type of filter match; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notIn", "lt", "lte", "gt", "gte" and "custom". |

#### ColumnFilterOperatorChangeEvent

Custom filter event. See *onFilterOperatorChange*.

| name     | type          | description                      |
| :------- | :------------ | :------------------------------- |
| field    | string        | Field name of the column.        |
| operator | "and" \| "or" | Logical operator for the filter. |

#### ColumnFilterConstraintAddEvent

Custom filter event. See *onFilterConstraintAdd*.

| name       | type                                                         | description                                                  |
| :--------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| field      | string                                                       | Field name of the column.                                    |
| constraint | [ColumnFilterMetaData](https://primereact.org/datatable/#api.Column.ColumnFilterMetaData) | Array of ColumnFilterMetaData objects representing the constraints. |

#### ColumnFilterConstraintRemoveEvent

Custom filter event. See *onFilterConstraintRemove*.

| name       | type                                                         | description                                                  |
| :--------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| field      | string                                                       | Field name of the column.                                    |
| constraint | [ColumnFilterMetaData](https://primereact.org/datatable/#api.Column.ColumnFilterMetaData) | Array of ColumnFilterMetaData objects representing the constraints. |

#### ColumnFilterEvent

Custom filter event. See *filterFunction*.

| name    | type                                                         | description                                                  |
| :------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| rowData | any                                                          | Data of the current row."                                    |
| filters | [ColumnFilterMeta](https://primereact.org/datatable/#api.Column.ColumnFilterMeta) | Object containing filter metadata for all columns.           |
| props   | any                                                          | Additional properties passed to the filter function.         |
| column  | Object                                                       | Object containing metadata for the current column, including filter metadata, field name, and column properties. |

### Interfaces

Defines the custom interfaces used by the module.

#### ColumnPassThroughMethodOptions

Custom passthrough(pt) option method.

| name    | type                                                         |
| :------ | :----------------------------------------------------------- |
| props   | [ColumnProps](https://primereact.org/datatable/#api.Column.props) |
| state   | [ColumnState](https://primereact.org/datatable/#api.Column.ColumnState) |
| context | [ColumnContext](https://primereact.org/datatable/#api.Column.ColumnContext) |
| parent  | DataTablePassThroughOptions                                  |

#### ColumnContext

Defines current options in Column component.

| name          | type    | description                                                  |
| :------------ | :------ | :----------------------------------------------------------- |
| checked       | boolean | Current checked state of row as a boolean.                   |
| disabled      | boolean | Current disabled state of row as a boolean.                  |
| index         | number  | Current index of the column.                                 |
| sorted        | boolean | Current sort state of the column as a boolean.               |
| resizable     | boolean | Current resizable state of the column as a boolean.          |
| size          | string  | Current size state of the table.                             |
| showGridlines | boolean | Current gridlines state of the table as a boolean.           |
| highlighted   | boolean | Current highlighted state of the filter row item as a boolean. |
| hidden        | boolean | Current hidden state of the filter clear button of a column as a boolean. |
| active        | boolean | Current active state of the filter menu of a column as a boolean. |

#### ColumnState

Defines current inline state in Column component.

| name                      | type    | description                                                  |
| :------------------------ | :------ | :----------------------------------------------------------- |
| editing                   | boolean | Current editing state of the body cell.                      |
| editingRowData            | any     | Current editing row data of the body cell.                   |
| styleObject               | object  | Current style of the body cell.                              |
| focused                   | boolean | Current focused state as a boolean.                          |
| overlayVisible            | boolean | Current visible state of the filter menu of a column as a boolean. |
| rowGroupHeaderStyleObject | object  | Current style of the rowgroup header.                        |
| sortableDisabledFields    | any[]   | Current sortable disabled fields of the table header.        |
| allSortableDisabled       | boolean | Current style of the table header.                           |

#### ColumnPassThroughOptions

Custom passthrough(pt) options.

| name                    | type                                                         | description                                                  |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| root                    | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the root's DOM element.           |
| headerCell              | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the header cell's DOM element.    |
| columnResizer           | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the column resizer's DOM element. |
| headerContent           | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the header content's DOM element. |
| headerTitle             | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the header title's DOM element.   |
| sort                    | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the sort's DOM element.           |
| sortIcon                | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the sort's DOM element.           |
| sortBadge               | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the sort badge's DOM element.     |
| headerCheckbox          | CheckboxPassThroughOptions                                   | Uses to pass attributes to the header checkbox's component.  |
| columnFilter            | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the column filter's DOM element.  |
| filterInput             | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter input's DOM element.   |
| filterMenuButton        | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter menu button's DOM element. |
| headerFilterClearButton | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the header filter clear button's DOM element. |
| filterClearIcon         | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the filter clear icon's DOM element. |
| filterOverlay           | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter overlay's DOM element. |
| filterRowItems          | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter row items' DOM element. |
| filterRowItem           | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter row item's DOM element. |
| filterSeparator         | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter separator's DOM element. |
| filterOperator          | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter operator's DOM element. |
| filterOperatorDropdown  | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the Dropdown component.           |
| filterConstraints       | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter constraints' DOM element. |
| filterConstraint        | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter constraint's DOM element. |
| filterMatchModeDropdown | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the Dropdown component.           |
| filterRemove            | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter remove button container's DOM element. |
| filterRemoveButton      | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the Button component.             |
| filterAddRule           | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter add rule's DOM element. |
| filterAddRuleButton     | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the Button component.             |
| filterButtonbar         | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the filter buttonbar's DOM element. |
| filterClearButton       | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the Button component.             |
| filterApplyButton       | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the Button component.             |
| bodyCell                | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the body cell's DOM element.      |
| footerCell              | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the footer cell's DOM element.    |
| rowGroupToggler         | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the rowgroup toggler's DOM element. |
| rowGroupTogglerIcon     | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the rowgroup toggler icon's DOM element. |
| columnTitle             | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the column title's DOM element.   |
| rowToggler              | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the rowtoggler's DOM element.     |
| rowTogglerIcon          | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the rowtoggler icon's DOM element. |
| rowEditorInitButton     | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the row editor init button's DOM element. |
| rowEditorInitIcon       | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the row editor init icon's DOM element. |
| rowEditorEditButton     | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the row editor edit button's DOM element. |
| rowEditorEditIcon       | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the row editor edit icon's DOM element. |
| rowEditorSaveButton     | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the row editor save button's DOM element. |
| rowEditorSaveIcon       | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the row editor save icon's DOM element. |
| rowEditorCancelButton   | [ColumnPassThroughType>](https://primereact.org/datatable/#api.Column.ColumnPassThroughType) | Uses to pass attributes to the row editor cancel button's DOM element. |
| rowEditorCancelIcon     | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the row editor cancel icon's DOM element. |
| rowReorderIcon          | [ColumnPassThroughType ](https://primereact.org/datatable/#api.Column.ColumnPassThroughType)\| SVGProps<SVGSVGElement>> | Uses to pass attributes to the row reorder icon's DOM element. |
| rowRadioButton          | RadioButtonPassThroughOptions                                | Uses to pass attributes to the row radiobutton component.    |
| rowCheckbox             | CheckboxPassThroughOptions                                   | Uses to pass attributes to the row checkbox component.       |
| hooks                   | ComponentHooks                                               | Used to manage all lifecycle hooks                           |

#### ColumnHeaderOptions

| name  | type | description                                         |
| :---- | :--- | :-------------------------------------------------- |
| props | any  | Additional properties passed to the body component. |

#### ColumnFooterOptions

Column Header Options Extends *ColumnHeaderOptions*.

| name  | type | description                                         |
| :---- | :--- | :-------------------------------------------------- |
| props | any  | Additional properties passed to the body component. |

#### ColumnBodyOptions

| name      | type                                                         | description                                         |
| :-------- | :----------------------------------------------------------- | :-------------------------------------------------- |
| column    | [Column](https://primereact.org/datatable/#api.Column)       | Column of the options.                              |
| field     | string                                                       | Field name of the column.                           |
| rowIndex  | number                                                       | Index of the row.                                   |
| props     | any                                                          | Additional properties passed to the body component. |
| frozenRow | boolean                                                      | Whether the row is frozen or not.                   |
| expander  | [ColumnBodyExpanderOptions](https://primereact.org/datatable/#api.Column.ColumnBodyExpanderOptions) | Options for the expander component.                 |
| rowEditor | [ColumnBodyRowEditorOptions](https://primereact.org/datatable/#api.Column.ColumnBodyRowEditorOptions) | Options for the row editor component.               |

#### ColumnBodyExpanderOptions

| name          | type    | description                         |
| :------------ | :------ | :---------------------------------- |
| className     | string  | Class name of the options.          |
| iconClassName | string  | Class name of the options icon.     |
| element       | Element | Custom JSX element for the options. |

#### ColumnBodyRowEditorOptions

| name                | type    | description                         |
| :------------------ | :------ | :---------------------------------- |
| editing             | boolean | Whether row is in editing mode.     |
| element             | Element | Custom JSX element for the options. |
| saveClassName       | string  | Class name of the save button.      |
| saveIconClassName   | string  | Class name of the save icon.        |
| cancelClassName     | string  | Class name of the cancel button.    |
| cancelIconClassName | string  | Class name of the cancel icon.      |
| initClassName       | string  | Class name of the init button.      |
| initIconClassName   | string  | Class name of the init icon.        |

#### ColumnEditorOptions

| name      | type                                                   | description                                         |
| :-------- | :----------------------------------------------------- | :-------------------------------------------------- |
| node      | any                                                    | Node element of the editor.                         |
| rowData   | any                                                    | Data of the edited row.                             |
| value     | any                                                    | Value of the editor.                                |
| column    | [Column](https://primereact.org/datatable/#api.Column) | Column of the editor.                               |
| field     | string                                                 | Field name of the column.                           |
| rowIndex  | number                                                 | Index of the edited row.                            |
| frozenRow | boolean                                                | Whether the row is frozen or not.                   |
| props     | any                                                    | Additional properties passed to the body component. |

#### ColumnFilterModelOptions

| name          | type                                                         |
| :------------ | :----------------------------------------------------------- |
| [key: string] | [ColumnFilterMetaData ](https://primereact.org/datatable/#api.Column.ColumnFilterMetaData)\|[ ColumnFilterMetaDataWithConstraint](https://primereact.org/datatable/#api.Column.ColumnFilterMetaDataWithConstraint) |

#### ColumnFilterClearTemplateOptions

| name        | type                                                         | description                                    |
| :---------- | :----------------------------------------------------------- | :--------------------------------------------- |
| field       | string                                                       | Field name of the column.                      |
| filterModel | [ColumnFilterModelOptions](https://primereact.org/datatable/#api.Column.ColumnFilterModelOptions) | Object containing column filter model options. |

#### ColumnFilterApplyTemplateOptions

| name        | type                                                         | description                                    |
| :---------- | :----------------------------------------------------------- | :--------------------------------------------- |
| field       | string                                                       | Field name of the column.                      |
| filterModel | [ColumnFilterModelOptions](https://primereact.org/datatable/#api.Column.ColumnFilterModelOptions) | Object containing column filter model options. |

#### ColumnFilterHeaderTemplateOptions

Column Filter Header Template Opitons Extends *ColumnFilterApplyTemplateOptions*.

| name        | type                                                         | description                                    |
| :---------- | :----------------------------------------------------------- | :--------------------------------------------- |
| field       | string                                                       | Field name of the column.                      |
| filterModel | [ColumnFilterModelOptions](https://primereact.org/datatable/#api.Column.ColumnFilterModelOptions) | Object containing column filter model options. |

#### ColumnFilterFooterTemplateOptions

Column Filter Footer Template Opitons Extends *ColumnFilterApplyTemplateOptions*.

| name        | type                                                         | description                                    |
| :---------- | :----------------------------------------------------------- | :--------------------------------------------- |
| field       | string                                                       | Field name of the column.                      |
| filterModel | [ColumnFilterModelOptions](https://primereact.org/datatable/#api.Column.ColumnFilterModelOptions) | Object containing column filter model options. |

#### ColumnFilterElementTemplateOptions

| name        | type                                                         | description                                    |
| :---------- | :----------------------------------------------------------- | :--------------------------------------------- |
| field       | string                                                       | Field name of the column.                      |
| index       | number                                                       | Index of the filter.                           |
| filterModel | [ColumnFilterModelOptions](https://primereact.org/datatable/#api.Column.ColumnFilterModelOptions) | Object containing column filter model options. |
| value       | any                                                          | Value of the filter.                           |

#### ColumnSortMetaData

| name  | type                              | description               |
| :---- | :-------------------------------- | :------------------------ |
| field | string                            | Field name of the column. |
| order | undefined \| null \| 0 \| 1 \| -1 | Sort order of the column. |

#### ColumnFilterMetaData

| name      | type   | description                                                  |
| :-------- | :----- | :----------------------------------------------------------- |
| value     | any    | Value of the filter.                                         |
| matchMode | string | Type of filter match; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notIn", "lt", "lte", "gt", "gte" and "custom". |

#### ColumnFilterMetaDataWithConstraint

| name        | type                                                         | description                                                  |
| :---------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| operator    | "and" \| "or"                                                | Logical operator for the constraints.                        |
| constraints | [ColumnFilterMetaData[\]](https://primereact.org/datatable/#api.Column.ColumnFilterMetaData) | Array of ColumnFilterMetaData objects representing the constraints. |

#### ColumnFilterMeta

| name          | type                                                         |
| :------------ | :----------------------------------------------------------- |
| [key: string] | [ColumnFilterMetaData](https://primereact.org/datatable/#api.Column.ColumnFilterMetaData) |

#### ColumnFilterMatchModeOptions

| name  | type   | description                                                  |
| :---- | :----- | :----------------------------------------------------------- |
| label | string | The label to display for the match mode                      |
| value | string | Type of filter match; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notIn", "lt", "lte", "gt", "gte" and "custom". |

### Types

Defines the custom types used by the module.

#### ColumnPassThroughType

| values                                             |
| :------------------------------------------------- |
| PassThroughType<T, ColumnPassThroughMethodOptions> |

## Row

Row component is a helper component used to create grouping structures in DataTable.

### Props

Defines valid properties in Row component.

| name      | type                                                         | default | description                                                  |
| :-------- | :----------------------------------------------------------- | :------ | :----------------------------------------------------------- |
| children  | ReactNode                                                    | null    | Used to get the child elements of the component.             |
| className | string                                                       | null    | Style class of the row.                                      |
| pt        | [RowPassThroughOptions](https://primereact.org/datatable/#api.Row.RowPassThroughOptions) | null    | Uses to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions                                           | null    | Used to configure passthrough(pt) options of the component.  |
| style     | CSSProperties                                                | null    | Inline style of the element.                                 |
| unstyled  | boolean                                                      | false   | When enabled, it removes component related styles in the core. |

### Interfaces

Defines the custom interfaces used by the module.

#### RowPassThroughMethodOptions

Custom passthrough(pt) option method.

| name   | type                                                        |
| :----- | :---------------------------------------------------------- |
| props  | [RowProps](https://primereact.org/datatable/#api.Row.props) |
| parent | ColumnGroupPassThroughOptions                               |

#### RowPassThroughOptions

Custom passthrough(pt) options.

| name  | type                                                         | description                                        |
| :---- | :----------------------------------------------------------- | :------------------------------------------------- |
| root  | [RowPassThroughType>](https://primereact.org/datatable/#api.Row.RowPassThroughType) | Uses to pass attributes to the root's DOM element. |
| hooks | ComponentHooks                                               | Used to manage all lifecycle hooks                 |

### Types

Defines the custom types used by the module.

#### RowPassThroughType

| values                                          |
| :---------------------------------------------- |
| PassThroughType<T, RowPassThroughMethodOptions> |

## ColumnGroup

It is a helper component for DataTable.

### Props

Defines valid properties in ColumnGroup component.

| name      | type                                                         | default | description                                                  |
| :-------- | :----------------------------------------------------------- | :------ | :----------------------------------------------------------- |
| children  | ReactNode                                                    | null    | Used to get the child elements of the component.             |
| pt        | [ColumnGroupPassThroughOptions](https://primereact.org/datatable/#api.ColumnGroup.ColumnGroupPassThroughOptions) | null    | Uses to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions                                           | null    | Used to configure passthrough(pt) options of the component.  |
| unstyled  | boolean                                                      | false   | When enabled, it removes component related styles in the core. |

### Interfaces

Defines the custom interfaces used by the module.

#### ColumnGroupPassThroughMethodOptions

Custom passthrough(pt) option method.

| name   | type                                                         |
| :----- | :----------------------------------------------------------- |
| props  | [ColumnGroupProps](https://primereact.org/datatable/#api.ColumnGroup.props) |
| parent | DataTablePassThroughOptions                                  |

#### ColumnGroupPassThroughOptions[#](https://primereact.org/datatable/#api.ColumnGroup.ColumnGroupPassThroughOptions)

Custom passthrough(pt) options.

| name  | type                                                         | description                                        |
| :---- | :----------------------------------------------------------- | :------------------------------------------------- |
| root  | [ColumnGroupPassThroughType>](https://primereact.org/datatable/#api.ColumnGroup.ColumnGroupPassThroughType) | Uses to pass attributes to the root's DOM element. |
| hooks | ComponentHooks                                               | Used to manage all lifecycle hooks                 |

### Types

Defines the custom types used by the module.

#### ColumnGroupPassThroughType

| values                                                  |
| :------------------------------------------------------ |
| PassThroughType<T, ColumnGroupPassThroughMethodOptions> |