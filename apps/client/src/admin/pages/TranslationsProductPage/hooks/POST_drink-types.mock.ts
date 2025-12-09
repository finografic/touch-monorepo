// ======================================================================== //
// NOTE: REQUEST
// [POST] http://localhost:4040/api/drink-types

export const POST_drinkTypes_REQUEST = {
  name: 'new-entry',
  hasSubtypes: 0,
  defaultTempConsume: 5,
  defaultTempFreeze: -2,
  translations: { 'en-GB': '', 'es-ES': 'NEW_ENTRY', 'ca-ES': '' },
};

// ======================================================================== //
// NOTE: RESPONSE

export const POST_drinkTypes_RESPONSE = {
  id: 'cmiy9qw9n0000fi7nlgt3tkvj',
  name: 'new-entry',
  translations: {
    'en-GB': '',
    'es-ES': 'NEW_ENTRY',
    'ca-ES': '',
  },
  hasSubtypes: false,
  defaultTempConsume: 5,
  defaultTempFreeze: -2,
  isActive: true,
  createdAt: '2025-12-09T07:38:33.000Z',
  updatedAt: '2025-12-09T07:38:33.000Z',
};
