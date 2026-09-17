import { EntityHydrator, OrderStateTransitionEvent } from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';

// Modeled on Vendure's own orderConfirmationHandler (@vendure/email-plugin default-email-handlers),
// but the recipient is the store's inbox rather than the customer.
export const orderAdminNotificationHandler = new EmailEventListener('order-admin-notification')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && event.fromState !== 'Modifying')
    .loadData(async ({ event, injector }) => {
        const entityHydrator = injector.get(EntityHydrator);
        await entityHydrator.hydrate(event.ctx, event.order, {
            relations: ['customer', 'lines'],
        });
        const itemCount = event.order.lines.reduce((sum, line) => sum + line.quantity, 0);
        return { itemCount };
    })
    .setRecipient(() => process.env.MAIL_ADMIN_NOTIFICATION_ADDRESS)
    .setFrom('{{ fromAddress }}')
    .setSubject(`New order #{{ order.code }} — {{ formatMoney order.totalWithTax order.currencyCode 'en' }}`)
    .setTemplateVars(event => ({ order: event.order, itemCount: event.data.itemCount }));
