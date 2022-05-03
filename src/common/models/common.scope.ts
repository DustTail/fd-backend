import { col } from 'sequelize';
import { rules } from '../resources';

export const commonScopes: any = {
    pagination: ({
        limit = rules.paginationLimitDefaultValue,
        offset = rules.paginationOffsetDefaultValue
    }) => ({ limit, offset }),
    order: ({
        orderBy = rules.sortingOrderByDefaultValue,
        orderType = rules.sortingOrderTypeDefaultValue
    }) => ({ order: [[col(orderBy), orderType]] }),
};
