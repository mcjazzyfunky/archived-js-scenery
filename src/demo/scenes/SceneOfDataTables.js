import {
    createElement as h,
    defineClassComponent
} from 'js-surface';

import DataTable from '../../main/api/component/DataTable';
import DataNavigator from '../../main/api/component/DataNavigator';

const
    config =
        {
            columns: [
                { title: 'Name',
                    columns: [
                        { title: 'First name',
                            field: 'firstName',
                            align: 'center'
                        },
                        { title: 'Last name',
                            field: 'lastName',
                            align: 'right'
                        }
                    ]
                },
                { title: 'Adress',
                    columns: [
                        { title: 'Street',
                            field: 'street'
                        },
                        { title: 'Postal code',
                            field: 'postalCode'
                        },
                        { title: 'City',
                            field: 'city'
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
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
    { firstName: 'Jane',
        lastName: 'Doe',
        street: 'Main Street 123',
        city: 'Towny Town'
    },
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
            DataNavigator({ config, data }));
    }
});
