import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import DataTable from '../../main/js/api/component/DataTable';
import DataNavigator from '../../main/js/api/component/DataNavigator';

const
    config =
        {
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
    }];

export default defineClassComponent({
    displayName: 'ScenesOfDataTables',

    render() {
        return h('div',
            DataNavigator({ config, data }));
    }
});
