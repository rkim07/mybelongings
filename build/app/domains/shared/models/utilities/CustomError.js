"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const _ = require("lodash");
const ERROR_MESSAGES = {
    GENERIC: {
        UNEXPECTED_ERROR: 'Unexpected Error',
        UNAUTHORIZED: 'Unauthorized',
        NOT_FOUND: 'Page not found',
        SEAT_TOKEN_MALFORMED: 'Seat JWT malformed',
        INVALID_REQUEST_FORMAT: 'Invalid request format',
        DEPENDENT_API_ERROR: 'Dependent API error'
    },
    BASKETS: {
        GET: {
            ERROR_404: 'Basket not found'
        },
        DELETE: {
            404: 'Basket not found',
            422: 'Basket cannot be deleted as it is does not have the right status'
        }
    },
    SHIPPING: {
        GET: {
            ERROR_404: 'Shipping methods not found or method doesn\'t exist on shipment.'
        },
        PUT: {
            ERROR_423: 'Selected method doesn\'t exist on group',
            ERROR_404: 'Selected method doesn\'t exist on group'
        }
    },
    BASKET_ITEMS: {
        GET: {
            ERROR_404: 'Basket not found'
        },
        POST: {
            ERROR_400: 'The item\'s condition has not been met so cannot be added to basket.',
            ERROR_403: 'The item being added has been tampered with as the BillableItem is not valid.',
            ERROR_404: 'There are no items in stock for this item.'
        },
        DELETE: {
            422: 'The basket does not contain any items being deleted.'
        },
        PUT: {
            ERROR_404: 'Basket item not found.',
            QUANTITY_OUT_OF_RANGE: 'Wrong data provided.'
        }
    },
    ORDER: {
        GET: {
            403: 'Provision is not owned by the requesting User',
            404: 'Order not found'
        },
        POST: {
            400: 'There was a problem with the contents of the shopping basket',
            403: 'ShoppingBasket already has an associated Order but the Order belongs to different user',
            422: 'Order Requirements have not been fulfilled by the request',
            423: 'ShoppingBasket already has an associated Order',
            425: 'Order has already been processed'
        }
    },
    CREW_ORDER_PICKUP: {
        POST: {
            422: 'Order is already assigned'
        },
        DELETE: {
            422: 'Order is not already assigned',
            COMPLETED: 'Order has already been completed'
        }
    },
    ORDER_ITEMS: {
        DELETE: {
            '422_NO_MATCHING_ORDER_ITEMS': 'Some or all of the items were not found in the order',
            '422_ORDER_ITEMS_UNREFUNDABLE': 'Some or all of the items are not refundable'
        }
    },
    CREW_ORDER: {
        DELETE: {
            422: 'Unable to cancel order as it is not in a cancellable state'
        }
    },
    ORDER_PAYMENT: {
        POST: {
            422: 'Order is already CANCELLED or PAID so cannot be paid again.'
        }
    },
    SEAT: {
        GET: {
            ERROR_404: 'Seat not found',
            ERROR_DEFAULT_PREFERENCES: 'Default seat preferences are not configured properly.'
        },
        PUT: {
            ERROR_SUBMITTED_PREFERENCES: 'The provided preferences does not contain the expected properties or is empty.'
        }
    },
    PAIRINGS: {
        GET: {
            PAIRING_DOES_NOT_EXIST: 'Pairing not found',
            PAIRING_TOKEN_DOES_NOT_MATCH: 'The provided pairing token does not match the pairing\'s token'
        },
        CREATE: {
            SEAT_TOKEN_NOT_SEAT_OWNER: 'The provided seat token in the owner of the provided seat'
        },
        DELETE: {
            SEAT_TOKEN_NOT_SEAT_OWNER: 'The provided seat token in the owner of the provided seat',
            ERROR_404: 'Pairing not found',
            PAIRING_DOES_NOT_BELONG_TO_SEAT: 'The provided pairing does not belong to the provided seat'
        },
        CONNECT: {
            PAIRING_DOES_NOT_EXIST: 'The requested pairing does not exist',
            PAIRING_ALREADY_ASSIGNED: 'The provided pairing has already been assigned to a user'
        }
    },
    SEAT_ENTITLEMENTS: {
        GET: {
            SEAT_TOKEN_NOT_SEAT_OWNER: 'The provided seat token in the owner of the provided seat',
            SEAT_DOES_NOT_HAVE_ENTITLEMENT: 'Seat has no entitlement',
            SEAT_NUMBER_DOES_NOT_EXIST: 'The provided seat number does not exist'
        }
    },
    ORDER_CREATE: {
        STOCK_RESERVATION_FAILED: 'Failed to reserve stock for the basket provided'
    },
    ORDER_CALL_CREW: {
        POST: {
            403: 'User does not own the Order',
            422: 'Order is not in a cancellable state'
        }
    },
    ORDER_PAY: {
        POST: {
            '403': 'Order is not owned by the requesting user',
            'PAYMENT_TOKEN_ERROR': 'Could not validate ownership of payment token',
            'PAYMENT_TOKEN_OWNERSHIP': 'PaymentMethod is not owned by the requesting user',
            '423': 'Order cannot be paid as it is not in the correct state',
            '422_INVALID_CURRENCY': 'Provided currency was not valid',
            '423_ORDER_REQUIREMENTS_NOT_MET': 'Order cannot be created while basket has unfulfilled order requirements',
            '423_NO_BASKET_ITEMS_IN_BASKET': 'Order cannot be created for a basket with no items',
        }
    },
    ORDER_PAY_BY_TOKEN: {
        POST: {
            PAIRING_DOES_NOT_EXIST: 'The requested pairing does not exist',
            PAIRING_TOKEN_DOES_NOT_MATCH: 'The provided pairing token does not match the pairing\'s token',
            PAIRINGS_DO_NOT_EXIST: 'No pairings were found'
        }
    },
    ZONE_CONFIGURATION: {
        GET: {
            422: 'No configuration exists'
        },
        PUT: {
            422: 'No configuration exists',
            INVALID_CREW_MEMBER: 'An invalid crew member key was provided'
        }
    },
    FLIGHT_INFORMATION: {
        GET: {
            424: 'Dependent Manufacturer API not available'
        },
        CONNECTIVITY_STATUS: {
            ERROR: 'Flight Connectivity Status Error'
        }
    },
    INTERNET_PROVISION: {
        PROVISION: {
            500: 'No provider-specific data was provided in the request'
        },
        GET: {
            403: 'Provision is not owned by the requesting User',
            422: 'No provision found'
        }
    },
    CREATE_ENTITLEMENT_VOUCHER: {
        PUT: {
            NO_ENTITLEMENT_FOR_USER: 'No booking entitlement was found for the provided User',
            NO_ENTITLEMENT_FOR_BOOKING: 'The associated booking entitlement does not have the requested entitlement'
        }
    },
    MARKETPLACE_CONFIG: {
        GET: {
            NOT_FOUND: 'Store config not found'
        }
    },
    PRODUCTS: {
        GET: {
            PRODUCT_NOT_FOUND: 'Product not found with given rule',
            FILE_NOT_FOUND: 'Content file not found',
        }
    },
    SHIPPING_ADDRESS: {
        GET: {
            NOT_FOUND: 'Shipping address not found'
        },
        POST: {
            ERROR_422: 'This type of address has been set already',
            NON_EXISTING_TYPE: 'Not an existing type'
        }
    },
    SHIPPING_METHOD: {
        GET: {
            ERROR_404: 'Shipping methods not found'
        }
    },
    CURRENCY: {
        PUT: {
            ERROR_UNAVAILABLE: 'The provided seat currency is not available in configuration.',
        }
    }
};
/**
 * A 'nice' error format
 * @author Swagger/James Gibbs
 */
class CustomError extends Error {
    constructor(code, errorKey, details) {
        super();
        this.code = code;
        this.details = details;
        this.message = this.getErrorMessageForErrorKey(errorKey) || errorKey;
        // Capture the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Gets a nice message for each HTTP request. Uses constant values
     * @param  {string}
     * @return {string}
     */
    getErrorMessageForErrorKey(errorKey) {
        return _.get(ERROR_MESSAGES, errorKey) || '';
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map