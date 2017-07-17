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
                ).usingHint('Must be a valid column configuration'))
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
            metric = DataTableHelper.getTableMetric(config),
            data = props.data;
        
        return (
            h('div > table',
                createTableHeader(columns),
                createTableBody(columns, data))
        );
    }
});

// ------------------------------------------------------------------

function createTableHeader(columns) {
    const ret =
        h('thead > tr',
            Seq.from(columns)
                .map(column => createHeaderColumn(column)));

    return ret;
}

function createHeaderColumn(column) {
    return (
        h('th',
            column.title)
    );
}

function createTableBody(columns, data) {

}
