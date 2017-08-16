export default {
    prepareDataTableDetails(config, data, dataOffset = 0, sorting = null) {
        const result =  {
            headers: [],
            columns: [],
            expandableRows: {},
            hasExpandableRows: false,
            showRecordNumbers: !!config.showRecordNumbers,
            dataOffset,
            sorting,

            selectionMode:
                config.selectionMode || 'none',

            actions: [
            ],

            hasActions: false,
            
            data
        };

        walkColumnsConfig(config.columns, result);

        const getExpandableRowContent =
            config.expandableRows
                ? config.expandableRows.getContent
                : null;

        if (data && getExpandableRowContent) {
            for (let i = 0; i < data.length; ++i) {
                const content = getExpandableRowContent(data[i]);

                if (content !== undefined && content !== null) {
                    result.expandableRows[i] = content;
                    result.hasExpandableRows = true;
                }
            }
        }

        result.additionalColumnCount =
            0 + result.showRecordNumbers
            + result.selectionMode !== 'none'
            + result.hasExpandableRows;

        return result;
    }
};

function walkColumnsConfig(columns, result, colspan = 0, depth = 0, ancestors = []) {
    for (let i = 0; i < columns.length; ++i) {
        const column = columns[i];

        const
            title = column.title,
            field = column.field;

        if (depth >= result.headers.length) {
            result.headers.push([]);
        }

        if (!column.columns) {
            const
                align = column.align || 'center',
                cell = {
                    title, field,
                    colspan: 1, rowspan: null,
                    align, depth,
                    width: column.width || '1*',
                    sortable: !!column.sortable
                };
            
            result.headers[depth].push(cell);
            result.columns.push(cell);
        } else {
            const header = { title, colspan: column.columns.length, align: 'center', rowspan: 1 };

            for (let j = 1; j < ancestors.length; ++j) {
                ancestors[j].colspan++;
            }

            result.headers[depth].push(header);
            ancestors.push(header);

            walkColumnsConfig(column.columns, result, colspan, depth + 1, ancestors, false);
        }

        if (depth === 0) {
            const numHeaderRows = result.headers.length;

            for (const column of result.columns) {
                column.rowspan = numHeaderRows - column.depth;
                delete(column.depth);
            }
        }
    }
}
