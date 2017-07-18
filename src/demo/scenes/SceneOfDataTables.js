import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import DataTable from '../../main/api/component/DataTable';

const
    config2 =
        {
            columns: [
                { title: 'Column1',
                    field: 'a'
                },
                { title: 'Column2',
                    field: 'b'
                },
                { title: 'Column3',
                    field: 'b'
                }
            ]
        };

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
};

const data = [
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'John',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    }];

export default defineClassComponent({
    displayName: 'ScenesOfDataTables',

    render() {
        return h('div',
            DataTable({ config, data }));
    }
});
