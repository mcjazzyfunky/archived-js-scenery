import DataTableUtils from '../../internal/util/DataTableUtils';
import VerticalLayout from '../../api/layout/VerticalLayout';

import {
    createElement as h,
    defineClassComponent
} from 'js-glow';

import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

const columnsSpec = 
    Spec.arrayOf( 
        Spec.or(
            {
                when:
                    it => it && !it.columns,
                check:
                    Spec.shape({
                        title: Spec.string,
                        field: Spec.string,
                        align: Spec.optional(Spec.oneOf('left', 'right', 'center')),
                        width: Spec.optional(Spec.string),
                        sortable: Spec.optional(Spec.boolean)
                    }),
            },
            {
                when:
                    it => it && it.columns,

                check:
                    Spec.shape({
                        title: Spec.string,
                        columns: Spec.lazy(() => columnsSpec)
                    })
            })
        );

const tableConfigSpec =
    Spec.shape({
        columns: columnsSpec,

        showRecordNumbers:
            Spec.optional(Spec.boolean),

        expandableRow:
            Spec.optional(
                Spec.shape({
                    getContent:
                        Spec.function
                }))
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

        contentAbove: {
            type: Object,
            nullable: true,
            defaultValue: null
        },

        contentBelow: {
            type: Object,
            nullable: true,
            defaultValue: null
        },

        className: {
            type: String,
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
        this._details = null;
        this._intervalId = null;
        this._headerTableNode = null;
        this._bodyTableNode = null;
        this._columnWidths = [];
        this._selectedRows = {};
        this._selection = [];
        this._expandedRows = {};
        this._expandedRowCount = 0;
    },

    updateDetails() {
        const
            props = this.props,
            config = props.config,
            data = props.data,
            dataOffset = props.dataOffset,
            sorting = props.sorting || null;
            
        this._details =
            DataTableUtils.prepareDataTableDetails(config, data, dataOffset, sorting);
    },

    onWillMount() {
        this.updateDetails();
    },

    onDidMount() {
        this.adjustTableWidths();
        this._intervalId = setInterval(() => this.adjustTableWidths(), 500);
        window.addEventListener('resize', this.adjustTableWidths);
    },

    onWillUnmount() {
        clearInterval(this._intervalId);
        window.removeEventListener('resize', this.adjustTableWidths);
    },

    onWillUpdate() {
        this.updateDetails();
    },

    render() {
        const
            props = this.props,
            details = this._details,

            className =
                props.className
                    ? 'sc-DataTable ' + props.className
                    : 'sc-DataTable';
       
        const
            above =
                !props.contentAbove
                    ? null
                    : h('div', props.contentAbove),

            below =
                !props.contentBelow
                    ? null
                    : h('div', props.contentBelow);

        return (
            VerticalLayout({
                className,
                
                cells: [
                    {
                        content: above,
                        flex: 0
                    },
                    {
                        className: 'x',

                        content:
                            h('table.sc-DataTable-table.sc-DataTable-header.sc-DataTable-headerTable',
                                { ref: it => this.setHeaderTableNode(it) },
                                this.createTableColGroup(details),
                                this.createTableHead(details)),
                        
                        flex: 0
                    },
                    {
                        className: 'y',

                        content:
                            h('.sc-DataTable-scrollpane',
                                h('table.sc-DataTable-table.sc-DataTable-bodyTable',
                                    { ref: this.setBodyTableNode },
                                    this.createTableColGroup(details),
                                    //this.createTableHead(details),
                                    this.createTableBody(details))),
                    },
                    {
                        content: below,
                        flex: 0
                    }
                ]
            })
        );
    },

    // ------------------------------------------------------------------

    createTableColGroup(details) {
        const
            cols = [],
            className = 'sc-DataTable-extraColumn';

        if (details.showRecordNumbers) {
            cols.push(h('col', { className, style: { width: '50px' } }));
        }

        if (details.selectionMode !== 'none') {
            cols.push(h('col', { className, style: { width: '50px' } }));
        }

        if (details.hasExpandableRows) {
            cols.push(h('col', { className, style: { width: '50px' } }));
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

    createTableHead(details) {
        const ret =
            h('thead',
                Seq.from(details.headers)
                    .map((headerRow, idx) =>
                        this.createTableHeadRow(headerRow, idx, details)));

        return ret;
    },

    createTableHeadRow(headerRow, idx, details) {
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
                addits.push(h('th'));
            }
        }

        if (details.selectionMode !== 'none') {
            if (idx === 0 && numHeaderRows > 1) {
                addits.push(h('th', { rowSpan: numHeaderRows - 1 }));
            } else if (details.selectionMode === 'multi') {
                const
                    selectionCount = this._selection.length,
                    dataLength = this.props.data.length,    
                    allSelected = dataLength > 0 
                        && selectionCount === this.props.data.length;

                addits.push(
                    h('th',
                        this.createRowSelector(-1,
                            allSelected,
                            this.onFullSelectionToggled)));
            } else {
                addits.push(
                    h('th'));
            }
        }

        if (details.hasExpandableRows) {
            if (idx === 0 && numHeaderRows > 1) {
                addits.push(h('th', { rowSpan: numHeaderRows - 1}));
            } else {
                addits.push(h('th', this.createRowExpander(-1, details)));
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
                        this.createTableHeadCell(headerCell, details)),
                tailExtra)
        );

    },

    createTableHeadCell(cell, details) {
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
        const
            data = details.data,
            hasExpandableRows = details.hasExpandableRows,
            rows = [];

        for (let i = 0; i < data.length; ++i) {
            rows.push(this.createTableBodyRow(data[i], i, details));

            if (hasExpandableRows && this._expandedRows[i]) {
                const expandableContent = details.expandableRows[i];

                if (expandableContent !== undefined) {
                    let className = 'sc-DataTable-bodyRow sc-DataTable-bodyRow--expansion';

                    if (i % 2 === 1) {
                        className += ' sc-DataTable-bodyRow--alt';
                    }

                    if (this._selectedRows[i] !== undefined) {
                        className += ' sc-DataTable-bodyRow--selected';
                    }

                    rows.push(
                        h('tr',
                            { className},
                            h('td',
                                {
                                    colSpan:
                                        1 + details.showRecordNumbers
                                        + (details.selectionMode !== 'none')
                                }),
                            h('td',
                                {
                                    colSpan: details.columns.length
                                },
                                expandableContent)));
                }
            }
        }


        return (
            h('tbody', rows)
        );
    },

    createTableBodyRow(rec, idx, details) {
        let addits = [],
            tailExtra = null,
            checked = this._selectedRows[idx] === true;
        
        if (details.showRecordNumbers) {
            addits.push(
                h('td.sc-DataTable-cell.sc-DataTable-cell--centerAligned',
                    details.dataOffset + idx + 1));
        }

        if (details.selectionMode === 'multi') {
            addits.push(
                h('td.sc-DataTable-cell.sc-DataTable-cell--centerAligned',
                    this.createRowSelector(idx, !!this._selectedRows[idx], this.onRowSelectionToggle)));
        } else if (details.selectionMode === 'single') {
            addits.push(
                h('td',
                    h('input[type=radio].ui.radio')));
        }

        if (details.hasExpandableRows) {
            if (details.expandableRows[idx] !== undefined) {
                addits.push(
                    h('td.sc-DataTable-cell.sc-DataTable-cell--centerAligned',
                        this.createRowExpander(idx, details)));
            } else {
                addits.push(h('td'));
            }
        }

        if (details.hasActions) {
            tailExtra = h('td',
                this.createActionButtonGroup(rec, details));
        }

        let className = 
            idx % 2 === 0 ? null : 'sc-DataTable-bodyRow--alt';

        if (checked) {
            className += ' sc-DataTable-bodyRow--selected';
        }

        if (details.hasExpandableRows && this._expandedRows[idx] === true) {
            className += ' sc-DataTable-bodyRow--expanded';
        }

        return (
            h('tr',
                { className },
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

    createRowSelector(idx, selected, onClick) {
        const
            className =
                selected
                    ? 'sc-DataTable-rowSelector fa fa-check-square-o'
                    : 'sc-DataTable-rowSelector fa fa-square-o';

        return h('button',
            {
                className,
                onClick,
                'data-index': idx,
                'data-selected': selected ? 1 : 0
            });
    },

    createRowExpander(idx, details) {
        const
            expanded =
                idx !== -1    
                    ? this._expandedRows[idx] !== undefined
                    : this._expandedRowCount === details.expandableRowCount,

            className = expanded
                ? 'sc-DataTable-rowExpander fa fa-minus-square-o'
                : 'sc-DataTable-rowExpander fa fa-plus-square-o',

            onClick = this.onRowExpansionToggle; 

        return h('button',
            {
                className,
                onClick,
                'data-index': idx,
                'data-expanded': expanded ? 1 : 0
            });
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

    onFullSelectionToggled(ev) {
        const
            recordCount = this.props.data ? this.props.data.length : 0,
            target = ev.target,
            selected = target.getAttribute('data-selected') === '1',
            selectedRows = {},
            selection = [];

        this._selectedRows = selectedRows;
        this._selection = selection;
        
        if (!selected) {
            for (let i = 0; i < recordCount; ++i) {
                selectedRows[i] = true;
                selection.push(i);
            }
        }

        Object.freeze(selection);
        this.forceUpdate();
    },

    setHeaderTableNode(node) {
        this._headerTableNode = node;
    },

    setBodyTableNode(node) {
        this._bodyTableNode = node;
    },

    onRowSelectionToggle(ev) {
        const
            target = ev.target,
            index = target.getAttribute('data-index'),
            selected = target.getAttribute('data-selected') === '1';

        if (!selected) {
            this._selectedRows[index] = true;
        } else {
            delete(this._selectedRows[index]);
        }

        const selection =
            Object.keys(this._selectedRows)
                .map(key => Number.parseInt(key, 10));

        selection.sort();
        Object.freeze(selection);

        this._selection = selection;
        this.forceUpdate();
    },

    onRowExpansionToggle(ev) {
        const
            target = ev.target,
            idx = Number.parseInt(target.getAttribute('data-index'), 10);

        if (idx !== -1) {
            if (this._expandedRows[idx] !== undefined) {
                delete(this._expandedRows[idx]);
                --this._expandedRowCount;
            } else {
                this._expandedRows[idx] = true;
                ++this._expandedRowCount;
            }
        } else {
            this._expandedRows = {};
           
            if (this._expandedRowCount === this._details.expandableRowCount) {
                this._expandedRowCount = 0;
            } else {
                const idxs = Object.keys(this._details.expandableRows);

                for (let i = 0; i < idxs.length; ++i) {
                    this._expandedRows[idxs[i]] = true;
                }

                this._expandedRowCount = idxs.length;
            }
        }

        this.forceUpdate();
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
                    const columnWidth = columns[i].getBoundingClientRect().width;

                    if (columnWidth !== this._columnWidths[i]) {
                        this._columnWidths[i] = columnWidth;
                        widthsHaveChanged = true;
                    }
                }

                if (widthsHaveChanged) {
                    const
                        totalWidth = this._headerTableNode.children[1].getBoundingClientRect().width + 0.49,
                        cols = this._headerTableNode.firstChild.children;

                    let sumWidths = 0;
    
                    for (let i = 0; i < this._columnWidths.length; ++i) {
                        let width = this._columnWidths[i];

                        if (i < this._columnWidths.length - 1) {
                            cols[i].style.width = (width * 100 / totalWidth) + '%';
                        } else {
                            cols[i].style.width = 100 - (100 * sumWidths / totalWidth) + '%';
                        }

                        sumWidths += width;
                    }
                }
            }
        }
    }
});
