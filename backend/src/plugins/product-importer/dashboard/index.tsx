import { defineDashboardExtension } from '@vendure/dashboard';

import { ImportFromUrlButton } from './import-from-url-button.js';

defineDashboardExtension({
    actionBarItems: [
        {
            id: 'import-product-from-url',
            pageId: 'product-detail',
            position: { itemId: 'save-button', order: 'before' },
            component: ImportFromUrlButton,
        },
    ],
});
