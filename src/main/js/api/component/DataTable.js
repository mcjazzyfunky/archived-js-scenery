import DataTableUtils from '../../internal/util/DataTableUtils';

import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

const tableConfigSpec =
    Spec.shape({
        columns:
            Spec.arrayOf( 
                Spec.or(
                    Spec.shape({
                        title: Spec.string,
                        field: Spec.string,
                        width: Spec.optional(Spec.string),
                        sortable: Spec.optional(Spec.boolean)
                    }),
                    Spec.shape({
                        title: Spec.string,
                        columns: Spec.lazy(() => tableConfigSpec.columns)
                    })
                )),

        showRecordNumbers:
            Spec.optional(Spec.boolean)
    });

export default defineClassComponent({
    displayName: 'DataTable',

    properties: {
        config: {
            type: Object,
            constraint: tableConfigSpec
        },

        data: {
            type: Array,
            nullable: true
        },

        dataOffset: {
            type: Number,
            constraint: Spec.nonnegativeInteger,
            defaultValue: 0
        },

        sorting: {
            type: Object,
            constraint: Spec.shape({
                field: Spec.String,
                direction: Spec.oneOf('asc', 'desc')
            }),
            nullable: true,
            defaultValue: null
        },

        onSort: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    constructor() {
        this._intervalId = null;
        this._headerTableNode = null;
        this._bodyTableNode = null;
        this._columnWidths = [];
    },

    onDidMount() {
        this.adjustTableWidths();
        this._intervalId = setInterval(() => this.adjustTableWidths(), 1000);
    },

    onWillUnmount() {
        clearInterval(this._intervalId);
    },

    render() {
        const
            props = this.props,
            config = props.config,
            data = props.data,
            dataOffset = props.dataOffset,
            sorting = props.sorting || null,
            details = DataTableUtils.prepareDataTableDetails(config, data, dataOffset, sorting);
       
        return (
            h('.sc-DataTable',
                h('table.sc-DataTable-headerTable',
                    { ref: this.setHeaderTableNode },
                    this.createTableColGroup(details),
                    this.createTableHeader(details)),
                h('.sc-DataTable-scrollpane',
                    h('table.sc-DataTable-bodyTable',
                        { ref: this.setBodyTableNode },
                        this.createTableColGroup(details),
                        this.createTableBody(details))))
        );
    },

    // ------------------------------------------------------------------

    createTableColGroup(details) {
        const cols = [];

        if (details.showRecordNumbers) {
            cols.push(h('col', { style: { width: '50px' } }));
        }

        if (details.selectionMode !== 'none') {
            cols.push(h('col', { style: { width: '50px' } }));
        }

        for (const col of details.columns) {
            const width =
                col.width.endsWith('*')    
                    ?  Math.floor(
                        Number.parseFloat(col.width) * 100
                            / details.columns.length) + '%'
                    : col.width;
col.calcWidth = width;
            cols.push(h('col', { style: { width } }));
        }

        return (
            h('colgroup',
                cols)
        );
    },

    createTableHeader(details) {
        const ret =
            h('thead',
                Seq.from(details.headers)
                    .map((headerRow, idx) =>
                        this.createTableHeaderRow(headerRow, idx, details)));

        return ret;
    },

    createTableHeaderRow(headerRow, idx, details) {
        let
            addits = [],
            tailExtra = null;

        const numHeaderRows = details.headers.length;

        if (details.showRecordNumbers) {
            if (idx === 0 && numHeaderRows > 1) {
                addits.push(
                    h('th',
                        { rowSpan: numHeaderRows - 1 }));
            } else {
                addits.push(h('th', ''));
            }
        }

        if (details.selectionMode !== 'none') {
            if (idx === 0 && numHeaderRows > 1) {
                addits.push(h('th', { rowSpan: numHeaderRows - 1 }));
            } else if (details.selectionMode === 'multi') {
                addits.push(
                    h('th',
                        h('div',
                            h('input[type=checkbox].k-checkbox'),
                            h('label.k-checkbox-label'))));
            } else {
                addits.push(
                    h('th'));
            }
        }

        if (details.hasActions) {
            if (idx === 0 && numHeaderRows > 1) {
                tailExtra = h('th', { rowSpan: numHeaderRows - 1 });
            } else {
                tailExtra = h('th', '');
            }
        }

        return (
            h('tr',
                addits,
                Seq.from(headerRow)
                    .map(headerCell =>
                        this.createTableHeaderCell(headerCell, details)),
                tailExtra)
        );

    },

    createTableHeaderCell(cell, details) {
        const onClick = cell.sortable
            ? this.onSortableHeaderClick
            : null;
    
        let
            sortIcon = null,
            sortDirection = null;

        if (cell.sortable) {
            if (details.sorting && cell.field && cell.field === details.sorting.field) {
                sortDirection = details.sorting.direction;
            
                sortIcon = h('i.sc-DataTable-sortingIcon.fa.fa-sort-'
                    + sortDirection);
            } else {
                sortIcon = h('i.sc-DataTable-sortingIcon.fa.fa-sort');
            }
        }

        return (
            h('th.sc-DataTable-sortableColumnHeader',
                {   
                    colSpan: cell.colspan,
                    rowSpan: cell.rowspan,
                    'data-sorting-field': cell.field,
                    'data-sorting-direction': sortDirection,
                    onClick
                },
                cell.title,
                sortIcon)
        );
    },

    createTableBody(details) {
        const recs = Seq.from(details.data);

        return (
            h('tbody',
                recs.map((rec, idx) =>
                    this.createTableBodyRow(rec, idx, details)))  
        );
    },

    createTableBodyRow(rec, idx, details) {
        let addits = [],
            tailExtra = null;
        
        if (details.showRecordNumbers) {
            addits.push(
                h('td.sc-DataTable-cell.sc-DataTable-cell--centerAligned',
                    details.dataOffset + idx + 1));
        }

        if (details.selectionMode === 'multi') {
            addits.push(
                h('td.sc-DataTable-cell.sc-DataTable-cell--centerAligned',
                    h('input[type=checkbox].k-checkbox'),
                    h('label.k-checkbox-label', '')));
        } else if (details.selectionMode === 'single') {
            addits.push(
                h('td',
                    h('input[type=radio].ui.radio')));
        }

        if (details.hasActions) {
            tailExtra = h('td',
                this.createActionButtonGroup(rec, details));
        }

        return (
            h('tr',
                { className: idx % 2 === 0 ? null : 'sc-DataTable-bodyRow--alt'},
                addits,
                Seq.from(details.columns)
                    .map(column =>
                        this.createTableBodyCell(column, rec)),
                tailExtra)
        );
    },

    createTableBodyCell(column, rec) {
        return (
            h('td',
                { style: { width: column.calcWidth } },
                rec[column.field])
        );
    },

    createActionButtonGroup(rec, details) {
        return h('div',
            h('div.item.icon', h('i.icon.edit.outline')),
            h('div.item.icon', h('i.icon.trash.outline')));
    },

    onSortableHeaderClick(ev) {
        const
            onSort = this.props.onSort,
            target = ev.target,
            field = target.getAttribute('data-sorting-field'),
            direction = target.getAttribute('data-sorting-direction');
        
        if (onSort) {
            onSort({
                type: 'sort',
                field,
                direction:
                    direction === 'asc'
                        ? 'desc'
                        : 'asc'
            });
        }
    },

    setHeaderTableNode(node) {
        this._headerTableNode = node;
    },

    setBodyTableNode(node) {
        this._bodyTableNode = node;
    },

    adjustTableWidths() {
        if (this._headerTableNode && this._bodyTableNode) {
            const firstRow = this._bodyTableNode.childNodes[1].firstChild;

            if (firstRow) {
                let widthsHaveChanged = false;

                const
                    columns = firstRow.children,
                    columnCount = columns.length;

                for (let i = 0; i < columnCount; ++i) {
                    const columnWidth = columns[i].clientWidth;

                    if (columnWidth !== this._columnWidths[i]) {
                        this._columnWidths[i] = columnWidth;
                        widthsHaveChanged = true;
                    }
                }

                if (widthsHaveChanged) {
                    const
                        totalWidth = this._headerTableNode.children[1].clientWidth,
                        cols = this._headerTableNode.firstChild.children;

                    let sumWidths = 0;
    
                    for (let i = 0; i < this._columnWidths.length; ++i) {
                        let width = this._columnWidths[i];

                        if (i < this._columnWidths.length - 1) {
                            cols[i].style.width = width + 'px';
                        } else {
                            cols[i].style.width = (totalWidth - sumWidths - 1) + 'px';
                        }
                        
                        sumWidths += width;
                    }
                }
            }
        }
    }
});
