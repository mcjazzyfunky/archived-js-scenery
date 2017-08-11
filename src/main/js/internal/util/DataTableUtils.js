export default {
    prepareDataTableDetails(config, data, dataOffset = 0) {
        const result =  {
            headers: [],
            columns: [],
            showRecordNumbers: config.showRecordNumbers,
            dataOffset,

            selectionMode:
                config.selectionMode || 'none',


            actions: [
                { text: 'Edit' },
                { text: 'Delete' }
            ],

            hasActions: false,
            
            data
        };

        walkColumnsConfig(config.columns, result);

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
                cell = { title, field, colspan: 1, rowspan: null, align, depth };
            
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
