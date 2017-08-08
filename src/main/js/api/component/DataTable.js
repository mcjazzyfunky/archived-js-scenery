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
            metrics = DataTableUtils.prepareDataTableDetails(config, data);
       
        return (
            h('.sc-DataTable > table',
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
            addits.push(
                h('th',
                    { rowSpan: numHeaderRows - 1 }));
        } else {
            addits.push(h('th', ''));
        }
    }

    if (metrics.selectionMode !== 'none') {
        if (idx === 0 && numHeaderRows > 1) {
            addits.push(h('th', { rowSpan: numHeaderRows - 1 }));
        } else if (metrics.selectionMode === 'multi') {
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

    if (metrics.hasActions) {
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
                .map(createTableHeaderCell),
            tailExtra)
    );

}

function createTableHeaderCell(cell) {
    return (
        h('th',
            { className: null,
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
            h('td',
                metrics.offsetRecordNumbers + idx + 1));
    }

    if (metrics.selectionMode === 'multi') {
        addits.push(
            h('td.sc-DataTable-cell.sc-DataTable-cell--centerAligned',
                h('input[type=checkbox].k-checkbox'),
                h('label.k-checkbox-label', '')));
    } else if (metrics.selectionMode === 'single') {
        addits.push(
            h('td',
                h('input[type=radio].ui.radio')));
    }

    if (metrics.hasActions) {
        tailExtra = h('td',
            createActionButtonGroup(rec, metrics));
    }

    return (
        h('tr',
            { className: idx % 2 === 0 ? null : 'sc-DataTable-bodyRow--alt'},
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
            rec[column.field])
    );
}

function createActionButtonGroup(rec, metrics) {
    return h('div',
        h('div.item.icon', h('i.icon.edit.outline')),
        h('div.item.icon', h('i.icon.trash.outline')));
}
