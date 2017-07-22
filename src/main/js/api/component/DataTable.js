import DataTableHelper from '../../internal/helper/DataTableHelper';

import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import { Seq } from 'js-essential';
import { Spec } from 'js-spec';

const style = null; //{ backgroundColor: 'rgb(249, 250, 251)', borderStyle: 'solid', borderWidth: '1px 1px 0 0', borderColor: 'rgba(34, 36, 38, 0.1)' };

const tableConfigSpec =
    Spec.shape({
        columns:
            Spec.arrayOf( 
                Spec.or(
                    Spec.shape({
                        title: Spec.string,
                        field: Spec.string,
                        sortable: Spec.optional(Spec.boolean)
                    }),
                    Spec.shape({
                        title: Spec.string,
                        columns: Spec.lazy(() => tableConfigSpec.columns)
                    })
                )),

        recordNumbers:
            Spec.or(
                Spec.nothing,
                Spec.boolean,
                Spec.shape({
                    offset: Spec.nonnegativeInteger
                })
            )
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
        }
    },

    render() {
        const
            props = this.props,
            config = props.config,
            data = props.data,
            metrics = DataTableHelper.buildTableMetrics(config, data);
       
        return (
            h('div > table.ui.celled.compact.striped.table',
                h('colgroup',
                    h('col', { style: { width: '20px' } }),
                    h('col', { style: { width: '20px' } }),
                    h('col'),
                    h('col'),
                    h('col'),
                    h('col'),
                    h('col'),
                    h('col', { style: { width: '20px' } })),
                createTableHeader(metrics),
                createTableBody(metrics))
        );
    }
});

// ------------------------------------------------------------------

function createTableHeader(metrics) {
    const ret =
        h('thead',
            Seq.from(metrics.headers)
                .map((headerRow, idx) =>
                    createTableHeaderRow(headerRow, idx, metrics)));

    return ret;
}

function createTableHeaderRow(headerRow, idx, metrics) {
    let
        addits = [],
        tailExtra = null;

    const numHeaderRows = metrics.headers.length;

    if (metrics.showRecordNumbers) {
        if (idx === 0 && numHeaderRows > 1) {
            addits.push(h('th', { rowSpan: numHeaderRows - 1, style }));
        } else {
            addits.push(h('th.center.aligned', { style }, ''));
        }
    }

    if (metrics.selectionMode !== 'none') {
        if (idx === 0 && numHeaderRows > 1) {
            addits.push(h('th', { rowSpan: numHeaderRows - 1, style }));
        } else if (metrics.selectionMode === 'multi') {
            addits.push(
                h('th.center.aligned',
                    { style },
                    h('div.ui.checkbox',
                        h('input[type=checkbox]'),
                        h('label', { style: { position: 'absolute' } }))));
        } else {
            addits.push(
                h('th', { style }));
        }
    }

    if (metrics.hasActions) {
        if (idx === 0 && numHeaderRows > 1) {
            tailExtra = h('th', { rowSpan: numHeaderRows - 1 });
        } else {
            tailExtra = h('th.center.aligned', '');
        }
    }

    return (
        h('tr',
            addits,
            Seq.from(headerRow)
                .map(createTableHeaderCell),
            tailExtra)
    );

}

function createTableHeaderCell(cell) {
    return (
        h('th',
            { className: `${cell.align} aligned`,
                colSpan: cell.colspan,
                rowSpan: cell.rowspan 
            },
            cell.title)
    );
}

function createTableBody(metrics) {
    const recs = Seq.from(metrics.data);

    return (
        h('tbody',
            recs.map((rec, idx) =>
                createTableBodyRow(rec, idx, metrics)))  
    );
}

function createTableBodyRow(rec, idx, metrics) {
    let addits = [],
        tailExtra = null;
    
    if (metrics.showRecordNumbers) {
        addits.push(
            h('td.center.aligned > i',
                metrics.offsetRecordNumbers + idx + 1));
    }

    if (metrics.selectionMode === 'multi') {
        addits.push(
            h('td.center.aligned',
                { style }, 
                h('div.ui.checkbox',
                    h('input[type=checkbox]'),
                    h('label', { style: { position: 'absolute' } }))));
    } else if (metrics.selectionMode === 'single') {
        addits.push(
            h('td.center.aligned',
                { style },
                h('input[type=radio].ui.radio')));
    }

    if (metrics.hasActions) {
        tailExtra = h('td.center.aligned',
            createActionButtonGroup(rec, metrics));
    }

    return (
        h('tr',
            addits,
            Seq.from(metrics.columns)
                .map(column =>
                    createTableBodyCell(column, rec)),
            tailExtra)
    );
}

function createTableBodyCell(column, rec) {
    return (
        h('td',
            { className: `${column.align} aligned`},
            rec[column.field])
    );
}

function createActionButtonGroup(rec, metrics) {
    return h('div.ui.secondary.menu.icon',
        h('div.item.icon', h('i.icon.edit.outline')),
        h('div.item.icon', h('i.icon.trash.outline')));
}