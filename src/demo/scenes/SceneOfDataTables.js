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
                { type: 'general',
                    text: 'New',
                    icon: 'k-plus'
                },
                { type: 'single-row',
                    text: 'View',
                    icon: 'k-file-txt'
                },
                { type: 'single-row',
                    text: 'Delete',
                    icon: 'k-delete'
                },
                { type: 'menu',
                    text: 'Export',

                    actions: [
                        { type: 'menu',
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
                        { type: 'multi-row',
                            text: 'Export to Excel'
                        }
                    ]
                }
            ],

            columns: [
                { title: 'Name',
                    columns: [
                        { title: 'First name',
                            field: 'firstName',
                            align: 'left'
                        },
                        { title: 'Last name',
                            field: 'lastName',
                            align: 'left'
                        }
                    ]
                },
                { title: 'Adress',
                    columns: [
                        { title: 'Street',
                            field: 'street',
                            align: 'left'
                        },
                        { title: 'Postal code',
                            field: 'postalCode',
                            align: 'left'
                        },
                        { title: 'City',
                            field: 'city',
                            align: 'left'
                        }
                    ]
                }
            ],

            recordNumbers: { offset: 0 },
            selectionMode: 'multi'
        };

const config2 = {
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

const loadData = async function (params) {
    console.log('loading params:', params)
    const result = { items: data, totalItemCount: 1223 };

    return new Promise(resolve => {
        setTimeout(() => resolve(result), 1000);
    });
};

export default defineClassComponent({
    displayName: 'ScenesOfDataTables',

    render() {
        return h('div',
            DataNavigator({ config, loadData }));
    }
});
