import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import DataTable from '../../main/js/api/component/DataTable';
import DataNavigator from '../../main/js/api/component/DataNavigator';

const
    config =
        {
            headline: 'Customers',

            actions: [
                {
                    type: 'general',
                    text: 'New',
                    icon: 'k-plus'
                },
                {   
                    type: 'single-row',
                    text: 'View',
                    icon: 'k-file-txt'
                },
                {
                    type: 'single-row',
                    text: 'Delete',
                    icon: 'k-delete'
                },
                {
                    type: 'menu',
                    text: 'Export',

                    actions: [
                        {
                            type: 'menu',
                            text: 'Export to CSV',
                            actions: [
                                {   
                                    type: 'multi-row',
                                    text: 'Comma separated'
                                },
                                {
                                    type: 'multi-row',
                                    text: 'Tab separated'    
                                }
                            ]
                        },
                        {
                            type: 'multi-row',
                            text: 'Export to Excel'
                        }
                    ]
                }
            ],

            columns: [
                {
                    title: 'Name',
                    columns: [
                        {
                            title: 'First name',
                            field: 'firstName',
                            sortable: true,
                            align: 'left'
                        },
                        {
                            title: 'Last name',
                            field: 'lastName',
                            sortable: true,
                            align: 'left'
                        }
                    ]
                },
                {
                    title: 'Adress',
                    columns: [
                        {
                            title: 'Street',
                            field: 'street',
                            sortable: true,
                            align: 'left'
                        },
                        {
                            title: 'Postal code',
                            field: 'postalCode',
                            sortable: true,
                            align: 'left'
                        },
                        {
                            title: 'City',
                            field: 'city',
                            sortable: true,
                            align: 'left'
                        }
                    ]
                }
            ],

            showRecordNumbers: true,
            selectionMode: 'multi'
        };

const data2 = [
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        postalCode: '78222',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        postalCode: '78222',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        postalCode: '78222',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        postalCode: '78222',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        postalCode: '78222',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        postalCode: '78222',
        city: 'Towny Town'
    }];

const
    firstNames = ['Jane', 'John', 'Mary', 'Peter', 'Carla', 'Jim'],
    lastNames = ['Doe', 'Smith', 'Mayer', 'Steel', 'Becker', 'Bowles'],
    streets = ['Main Street 123', 'Green Road 432', 'Narrow Road 987'],
    postalCodes = ['1234', '2345', '5432'],
    cities = ['New York', 'Los Angelos', 'Seattle', 'Miami'];


const data = [];

for (let i = 0; i < 122333; ++i) {
    data.push({
        id: i,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        street: streets[Math.floor(Math.random() * streets.length)],
        postalCode: postalCodes[Math.floor(Math.random() * postalCodes.length)],
        city: cities[Math.floor(Math.random() * postalCodes.length)]
    });
}

const loadData = async function (params) {
    console.log('loading params:', params);
    
    if (!params.sorting) {
        data.sort((a, b) => a.id < b.id);
    } else {
        const
            field = params.sorting.field,
            sgn = params.sorting.direction === 'asc' ? 1 : -1;

        data.sort((a, b) => {
            const
                aEqualsB = a[field] === b[field],
                aGreaterB =
                    aEqualsB
                        ? (a.id < b.id)    
                        : (a[field] > b[field]);

            
            return aGreaterB ? sgn : -sgn;
        });
    }

    const result = {
        items: data.slice(params.offset, params.offset + params.itemCount),
        totalItemCount: data.length
    };

    let timeout = null;

    params.cancelNotifier.then(() => clearTimeout(timeout));

    return new Promise(resolve => {
        timeout = setTimeout(() => resolve(result), 500);
    });
};

const config2 = {
    columns: [
        {
            title: 'First Name',
            field: 'firstName'
        },
        {
            title: 'Last Name',
            field: 'lastName'
        },
        {
            title: 'City',
            field: 'city'
        }
    ]
};

export default defineClassComponent({
    displayName: 'ScenesOfDataTables',

    render() {
        return h('div',
            { style: { height: '395px', width: '800px', xborder: '1px solid green' }},
            // DataTable({ contentAbove: h('div', 'Juhu'), contentBelow: h('div', 'Woohoo'), config: { columns: config.columns}, data: data.slice(1, 10) }));
            DataNavigator({ config, loadData }));
    }
});
