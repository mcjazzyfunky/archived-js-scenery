export default class DataTableHelper {
    static buildTableMetrics(config, data) {
        const result =  {
            headers: [],
            columns: [],
            showRecordNumbers: !!config.recordNumbers,
            offsetRecordNumbers:
                config.recordNumbers
                    && typeof config.recordNumbers === 'object'
                    ? config.recordNumbers.offset || 0
                    : 0, 
            selectionMode:
                config.selectionMode || 'none',
                
            data
        };

        walkColumnsConfig(config.columns, result);

        return result;
    }
}

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

// ----------------------------

// ----------------------------
/*
const config = {
    columns: [
        { title: 'SNo.'
        },
        { title: 'Name',
            columns: [
                { title: '1' },
                { title: '2' }
            ]
        },
        { title: 'Language',
            columns: [
                { title: 'Native'
                },
                { title: 'Others',
                    columns: [
                        { title: "2"},
                        { title: "3"}
                    ]
                }
            ]    
        }

        
    ]
}


const config2 = {
    columns: [
        { title: 'ID'
        },
        { title: 'User',
            columns: [
                { title: 'Name',
                    columns: [
                        { title: 'First name'},
                        { title: 'Last name'}
                    ]
                },
                { title: 'City'
                }
            ]
        },
        { title: 'remarks'
        }
    ]
};

console.log(DataTableHelper.calcTableMetrics(config));
process.exit(0);

*/