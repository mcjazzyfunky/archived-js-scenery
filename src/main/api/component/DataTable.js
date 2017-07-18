import DataTableHelper from '../../internal/helper/DataTableHelper';

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
                ))
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
            metrics = DataTableHelper.calcTableMetrics(config),
            data = props.data;
        
        return (
            h('div > table',
                createTableHeader(metrics),
                createTableBody(metrics, data))
        );
    }
});

// ------------------------------------------------------------------

function createTableHeader(metrics) {
    const ret =
        h('thead',
            Seq.from(metrics.headers)
                .map(headerRow =>
                    h('tr',
                        Seq.from(headerRow).map(cell =>
                            h('th',
                                { colSpan: cell.colspan, rowSpan: cell.rowspan },
                                cell.title)))));

    return ret;
}

function createHeaderColumn(column) {
    return (
        h('th',
            column.title)
    );
}

function createTableBody(columns, data) {
    return null;
}
